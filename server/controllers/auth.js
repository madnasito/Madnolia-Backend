const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


const login = async(req, res) => {

    let { username, password } = req.body

    try {
        // Verify user

        username = username.toLowerCase()

        const userDB = await User.findOne({ username })

        if (!userDB) {
            return res.status(400).json({
                ok: false,
                message: 'LOGIN.ERRORS.USER'
            })
        }

        // Validate passwords
        const validPassword = bcrypt.compareSync(password, userDB.password)

        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                message: 'LOGIN.ERRORS.PASSWORD'
            })
        }

        /// Create Token for new User
        let token = await jwt.sign({ user: userDB._id }, process.env.SEED, { expiresIn: process.env.END_TOKEN })

        res.json({
            ok: true,
            token
        })
    } catch (error) {
        console.log(error)

        res.status(500).json({
            ok: false,
            error
        })
    }
}

const createUser = async(req, res) => {

    const body = req.body;

    // Convert platforms to numbers directly in the map
    let numberPlatforms = body.platforms.map(str => parseInt(str, 10));

    let user = new User({
      name: body.name,
      username: body.username.toLowerCase(),
      email: body.email,
      password: body.password,
      platforms: body.platforms,
      // img: "https://i.ibb.co/4d8b4XY/fd0bc6699682.jpg",
      // thumb_img: "https://i.ibb.co/YZc5f1y/fd0bc6699682.jpg"
    });

    console.log(body);
    console.log(numberPlatforms)

    user.password = bcrypt.hashSync(user.password, 10)

    user.save((err, userDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        // Create Token for new User
        let token = jwt.sign({ user: userDB._id }, process.env.SEED, { expiresIn: process.env.END_TOKEN })

        res.json({
            ok: true,
            userDB,
            token
        })
    })

}

const renewToken = async(req, res = response) => {


    // Generar el TOKEN - JWT
    const token = await jwt.sign({ user: req.user }, process.env.SEED, { expiresIn: process.env.END_TOKEN })
    const _user = await User.findOne({ _id: req.user })

    const { platforms, games, _id, name, username, email, img, acceptInvitations, notifications, thumb_img } = _user
    const user = {
        platforms,
        games,
        _id,
        name,
        username,
        email,
        img,
        thumb_img,
        notifications,
        acceptInvitations
    }
    res.json({
        ok: true,
        token,
        user
    });

}

const recoverPasswordToken = (req, res) => {

    const email = req.body.email

    const token = jwt.sign({ user: email }, process.env.RECOVER_PASSWORD_SEED, { expiresIn: process.env.RECOVER_PASSWORD_TIME })

    res.json({
        ok: true,
        token
    })
}

module.exports = {
    login,
    createUser,
    renewToken,
    recoverPasswordToken
}