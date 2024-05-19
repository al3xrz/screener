const { Router } = require("express");
const { getFullState } = require("../controllers/complex.controller");
const { createScreenshot } = require("../controllers/puppeteer.controller");
const { getGraphs } = require("../controllers/graph.controller")

const router = Router();

router.get("/state/id/:hostid", async (req, res) => {
  try {
    const state = await getFullState(req.params.hostid);
    res.status(200).json(state);
  } catch (e) {
    res.status(400).json({ Error: e.message });
  }
});


router.get("/screenshot/id/:hostid", async (req, res) => {
  console.log("Selected hostid: ", req.params.hostid)
  try {
    const graphURLs = await getGraphs(req.params.hostid)
    const mapURL = await createScreenshot(req.params.hostid);

    res.status(200).json({ paths: [mapURL, ...graphURLs].map(url => `results/${url}`) })


  } catch (e) {
    res.status(400).json({ Error: e.message });
  }
});




module.exports = router;
