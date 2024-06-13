const { Router } = require("express");
const {
  httpDeleteLaunch,
  httpGetLaunches,
  httpPostLaunch,
} = require("./launches.controller.js");

const launchesRouter = Router();
launchesRouter.get("/", httpGetLaunches);
launchesRouter.post("/", httpPostLaunch);
launchesRouter.delete("/:id", httpDeleteLaunch);

module.exports = { launchesRouter };
