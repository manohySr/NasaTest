const express = require("express");
const { planetsRouter } = require("./routes/planets/planets.router.js");
const { launchesRouter } = require("./routes/launches/launches.router.js");

const app = express();
app.use(express.json());

app.use("/planet", planetsRouter);
app.use("/launch", launchesRouter);

module.exports = app;
