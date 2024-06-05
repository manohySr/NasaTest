import { habitablePlanets } from "./../../models/planets.model.js";

function getPlanets(req, res) {
  return res.json(habitablePlanets);
}

export { getPlanets };
