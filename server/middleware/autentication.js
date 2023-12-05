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

const verifySocketToken = ( token = "" ) => {

    try {

        const user = jwt.verify( token, process.env.SEED );
        
        return [true, user.user];

    } catch (error) {
        return [false, null];
    }




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
    verifySocketToken,
    verifyPasswordToken
}