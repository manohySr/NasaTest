const { Router } = require("express");
const { httpGetPlanets } = require("./planets.controller.js");

const planetsRouter = Router();
planetsRouter.get("/", httpGetPlanets);

module.exports = { planetsRouter };
