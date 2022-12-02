const { Router } = require('express')
const path = require('path')
const router = Router()

router.get("/hostid/:hostid", async (req, res) => {

});

router.get("/", async (_, res) => {
  res.sendFile(path.resolve(__dirname , "../public/index.html"));
});

module.exports = router