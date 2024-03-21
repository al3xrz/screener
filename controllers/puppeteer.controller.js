const puppeteer = require("puppeteer");
const path = require("path");
const {delay} = require("../helpers/sys/sys")

async function createScreenshot(hostid) {
  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();
  await page.goto(`http://127.0.0.1:${process.env.EXPRESS_PORT}/hostid/${hostid}`);
  // await page.goto(`http://127.0.0.1:3000/hostid/${hostid}`);
  
  await page.waitForSelector(".leaflet-popup-content", {
    visible: true,
    timeout : 100000
  });
  await delay(1000)
  const fileName = `screen_${hostid}_${Date.now()}.jpg`;
  await page.screenshot({
    path: path.resolve(__dirname, `../public/results/${fileName}`),
    quality : 100,
    type: 'jpeg',
    omitBackground : true
  });
  await browser.close();
  return fileName;
}

module.exports = {
  createScreenshot,
};
