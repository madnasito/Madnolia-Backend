const express = require('express')
const app = express()
const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const _ = require('underscore')
const fileUpload = require('express-fileupload')
const { verifyImage } = require('../middleware/upload_validation')



const getUserInfo = async(req, res) => {

    let user = await User.findById(req.user)

    // Create Token the user again
    let token = jwt.sign({ user: user._id }, process.env.SEED, { expiresIn: process.env.END_TOKEN })

    res.json({
        ok: true,
        name: user.name,
        email: user.email,
        username: user.username,
        platforms: user.platforms,
        games: user.games,
        img: user.img,
        thumb_img: user.thumb_img,
        accept_invitations: user.accept_invitations,
        uid: user._id,
        token
    })

}

const getUserInvitations = async(req, res) => {
    const user = req.user

    User.findById(user)
        .populate('invitations')
        .exec((err, userDB) => {
            if (err) {
                return
            }
            res.send(userDB)
        })
}

const verifyUser = async(req, res) => {

    const username = req.params.username.toLowerCase()
    const email = req.params.email

    const userExists = await User.findOne({ username })
    const emailExists = await User.findOne({ email })


    if (userExists) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'This user name is already taked, try another'
            }
        })
    } else if (emailExists) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'An user is using this email'
            }
        })
    } else {
        return res.status(200).json({
            ok: true
        })
    }

}

const updateUser = async(req, res) => {

    // Validate Token

    const uid = req.user

    try {

        const userDB = await User.findById(uid)

        if (!userDB) {
            return res.status(404).json({
                ok: false,
                err: {
                    message: "The user does not exists"
                }
            })
        }

        if (req.body.username) {
            req.body.username = req.body.username.toLowerCase()
        }
        // Updating user
        let body = _.pick(req.body, ['name', 'email', 'username', 'accept_invitations'])

        //Modify User
        User.findByIdAndUpdate(uid, body, { new: true }, (err, userUpdated) => {

            // Verify Errors
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }

            // Create Token for new User
            let token = jwt.sign({ user: userUpdated._id }, process.env.SEED, { expiresIn: process.env.END_TOKEN })

            // User Updated
            res.json({
                ok: true,
                name: userUpdated.name,
                email: userUpdated.email,
                username: userUpdated.username,
                token,
                message: 'PROFILE.USER_PAGE.UPDATED',
                accept_invitations: userUpdated.accept_invitations,
                platforms: userUpdated.platforms,
                _id: userUpdated._id
            })

        })

    } catch (error) {

    }
}

const resetNotifications = (req, res) => {

    const user = req.user

    User.findOneAndUpdate({ _id: user }, { notifications: 0 }, { new: true }, (err, userDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true
        })
    })

}

// Control to update PFP
const updateImg = async(req, res) => {

    app.use(fileUpload())

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.json({
            ok: false,
            err: {
                message: "Error in image"
            }
        })
    }

    let file = req.files.img
    let fileName = await verifyImage(file, res)

    res.json({
        ok: true,
        fileName,
        file
    })

}

const updatePlatforms = async(req, res) => {
    // Validate Token

    const uid = req.user

    // let numberPlatforms = req.body.platforms.map(str => parseInt(str, 10));
    console.log(typeof req.body.platforms[0])
    

    try {
        const userDB = await User.findById(uid)

        if (!userDB) {
            return res.status(404).json({
                ok: false,
                err: {
                    message: "The user does not exists"
                }
            })
        }

        let platforms = {
            platforms: req.body.platforms
        }

        User.findByIdAndUpdate(uid, platforms, (err, platformsDB) => {
            // Verify Errors
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }

            // Create Token for new User

            // let token = jwt.sign({ user: userUpdated._id }, process.env.SEED, { expiresIn: process.env.END_TOKEN })

            res.json({
                ok: true,
                message: "PROFILE.PLATFORMS_PAGE.SUCCESS"
            })
        })

    } catch (error) {

    }
}

// Get user's partners
const getPartners = async(req, res) => {

    // Validate Token

    User.findById(req.user)
        .populate('partners', 'name username img')
        .exec((err, userDB) => {
            if (err) {
                return status(404).json({
                    ok: false,
                    err
                })
            }

            res.json(
                userDB.partners
            )
        })

}

// Search user by username
const searchUser = async(req, res) => {

    username = req.params.username

    if (!username || username == "") {
        return
    }

    let regex = new RegExp(username, 'i');

    User.find({ username: regex, status: true })
        .limit(3)
        .exec((err, userDB) => {
            if (err) {
                return status(404).json({
                    ok: false,
                    err
                })
            }

            res.send(userDB)

        })
}

// Add a partner
const addPartner = async(req, res) => {

    partner = req.body.partner


    if (req.user === partner) {
        return res.send(false)
    }

    User.findOne({ _id: req.user, partners: partner })
        .exec((err, partnerDB) => {
            if (err) {
                return status(404).json({
                    ok: false,
                    err
                })
            }

            if (partnerDB == null) {
                User.findByIdAndUpdate({ _id: req.user }, { $push: { 'partners': partner } }, (err) => {

                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            err
                        })
                    }

                    res.json({
                        ok: true,
                        message: "Partner added"
                    })
                })
            } else {
                res.json({
                    ok: false,
                    message: "You already have this user as a partner"
                })
            }
        })


}

const recoverPassword = (req, res) => {
    const token = req.params.token
    const user = req.user
    const body = req.body

    body.password = bcrypt.hashSync(body.password, 10)

    User.findOneAndUpdate({ email: user }, { password: body.password }, { new: true })
        .exec((err, userDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            res.json({
                ok: true,
                userDB
            })
        })
}
module.exports = {
    getUserInfo,
    getUserInvitations,
    updateUser,
    verifyUser,
    updatePlatforms,
    searchUser,
    getPartners,
    addPartner,
    recoverPassword,
    updateImg,
    resetNotifications
}
