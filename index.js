require("dotenv").config();
const express = require("express");
const cors = require("cors");
const viewRouter = require("./routers/view.router");
const apiRouter = require("./routers/api.router");

const app = express();
app.use(cors());

app.use(express.json());
app.use(express.static("public"));
app.use(cors());

app.use("/map", viewRouter);
app.use("/api", apiRouter);


app.listen(process.env.EXPRESS_PORT, () => {
  console.log(`Server started on ${process.env.EXPRESS_PORT}`);
});

(async () => {})();
