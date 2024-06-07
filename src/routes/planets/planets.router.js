import { Router } from "express";
import { httpGetPlanets } from "./planets.controller.js";

const planetsRouter = Router();
planetsRouter.get("/", httpGetPlanets);

export { planetsRouter };
