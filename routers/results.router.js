const {Router} = require("express")

const router = new Router()

router.get("", async (req, res) => {
    res.status(200).json({res : "xxx"})
})

module.exports = router
