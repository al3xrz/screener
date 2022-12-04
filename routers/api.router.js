const { Router } = require("express");
const { getFullState } = require("../controllers/complex.controller");
const { createScreenshot } = require("../controllers/puppeteer.controller");
const path = require("path");
const state = require("../state");

const router = Router();

router.get("/state/hostid/current", async (_, res) => {
  const hostid = state.currentHostID;
  res.status(200).json({ hostid });
});

router.get("/state", async (_, res) => {
  const state = await getFullState();
  res.status(200).json(state);
});


router.get("/screenshot/download/:hostid", async (req, res) => {
  console.log("in download")
  state.currentHostID = req.params.hostid
  console.log(state)
  
  const fileName = await createScreenshot();
  res.sendFile(path.resolve(`public/results/${fileName}`));

  // res.status(200).json(state);
});


router.get("/screenshot/download", async (_, res) => {
  const fileName = await createScreenshot();
  res.sendFile(path.resolve(`public/results/${fileName}`));
});


router.get("/screenshot", async (_, res) => {
  const fileName = await createScreenshot();
  res.status(200).json({ fileName: `/results/${fileName}` });
});

module.exports = router;
