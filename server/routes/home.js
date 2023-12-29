const { Router } = require("express")
const { verifyToken } = require("../middleware/autentication")
const { userHomeGames } = require("../controllers/home")

const router = Router()

router.get("/api/home/user-matches", verifyToken, userHomeGames)

module.exports = router