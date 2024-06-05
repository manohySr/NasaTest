import { Router } from "express";
import { getPlanets } from "./planets.controller.js";

const planetsRouter = Router();
planetsRouter.get("/", getPlanets);

export { planetsRouter };
