const { Router } = require("express");
const { getFullState } = require("../controllers/complex.controller");
const { createScreenshot } = require("../controllers/puppeteer.controller");
const path = require("path");

const router = Router();

router.get("/state/hostid/:hostid", async (req, res) => {});

router.get("/state", async (_, res) => {
  const state = await getFullState();
  res.status(200).json(state);
});

router.get("/screenshot/download", async (_, res) => {
  const fileName = await createScreenshot();
  res.sendFile(path.resolve(`public/results/${fileName}`));
});

router.get("/screenshot/download/:hostid", async (_, res) => {
  const fileName = await createScreenshot();
  res.sendFile(path.resolve(`public/results/${fileName}`));
});


router.get("/screenshot", async (_, res) => {
  const fileName = await createScreenshot();
  res.status(200).json({ fileName: `/results/${fileName}` });
});

module.exports = router;
