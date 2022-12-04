const { Router } = require('express')
const path = require('path')
const router = Router()


router.get("/", async (_, res) => {
  res.sendFile("index.html");
});

module.exports = router