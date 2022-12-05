const { Router } = require("express");
const { getFullState } = require("../controllers/complex.controller");
const { createScreenshot } = require("../controllers/puppeteer.controller");
const path = require("path");

const router = Router();

router.get("/state", async (_, res) => {
  try {
    const state = await getFullState();
    res.status(200).json(state);
  } catch(e) {
    res.status(400).json({Error : e.message});
  }
});


router.get("/screenshot/download/:hostid", async (req, res) => {
  console.log("Selected hostid: ", req.params.hostid)
  try {
    const fileName = await createScreenshot(req.params.hostid);
    res.sendFile(path.resolve(`public/results/${fileName}`));
  } catch(e) {
    res.status(400).json({Error : e.message});
  }
});


module.exports = router;
