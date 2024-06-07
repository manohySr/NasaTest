import express from "express";
import { planetsRouter } from "./routes/planets/planets.router.js";
import { launchesRouter } from "./routes/launches/launches.router.js";

const app = express();
app.use(express.json());

app.use("/planet", planetsRouter);
app.use("/launch", launchesRouter);

export default app;
