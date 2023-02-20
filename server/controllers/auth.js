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
                message: 'No founded user'
            })
        }

        // Validate passwords
        const validPassword = bcrypt.compareSync(password, userDB.password)

        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                message: 'No valid password'
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

const renewToken = async(req, res = response) => {

    // Generar el TOKEN - JWT
    const token = await jwt.sign({ user: req.user }, process.env.SEED, { expiresIn: process.env.END_TOKEN })
    const user = await User.findOne({ _id: req.user })

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
    renewToken,
    recoverPasswordToken
}