<<<<<<< HEAD
const jwt = require('jsonwebtoken');



const verifyToken = (req, res, next) => {

    let token = req.get("token")

    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: "Invalid Token, Please Login"
                }
            })
        }

        req.user = decoded.user
        next()
    })

}

const verifyPasswordToken = (req, res, next) => {

    let token = req.params.token

    jwt.verify(token, process.env.RECOVER_PASSWORD_SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: "Invalid Token"
                }
            })
        }

        req.user = decoded.user
        next()
    })

}


module.exports = {
    verifyToken,
    verifyPasswordToken
=======
const jwt = require('jsonwebtoken');



let verifyToken = (req, res, next) => {

    let token = req.get("token")

    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: "Invalid Token, Please Login"
                }
            })
        }

        req.user = decoded.user
        next()
    })

}

let verifyPasswordToken = (req, res, next) => {

    let token = req.params.token

    jwt.verify(token, process.env.RECOVER_PASSWORD_SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: "Invalid Token"
                }
            })
        }

        req.user = decoded.user
        next()
    })

}




module.exports = {
    verifyToken,
    verifyPasswordToken
>>>>>>> 3f575ba2f65495761cb8fbe59ed74702355a3a32
}