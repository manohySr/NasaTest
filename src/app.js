import express from "express";
import { planetsRouter } from "./routes/planets/planets.router.js";

const app = express();
app.use(express.json());

app.use("/planet", planetsRouter);

export default app;
