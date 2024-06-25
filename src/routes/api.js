const route = require("express").Router();

const { launchesRouter } = require("./launches/launches.router");
const { planetsRouter } = require("./planets/planets.router");

route.use("/planet", planetsRouter);
route.use("/launch", launchesRouter);

module.exports = { route };
