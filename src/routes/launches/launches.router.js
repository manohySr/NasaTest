import { Router } from "express";
import {
  httpDeleteLaunch,
  httpGetLaunches,
  httpPostLaunch,
} from "./launches.controller.js";

const launchesRouter = Router();
launchesRouter.get("/", httpGetLaunches);
launchesRouter.post("/", httpPostLaunch);
launchesRouter.delete("/:id", httpDeleteLaunch);

export { launchesRouter };
