import { getPlanets } from "./../../models/planets.model.js";

function httpGetPlanets(req, res) {
  return res.json(getPlanets());
}

export { httpGetPlanets };
