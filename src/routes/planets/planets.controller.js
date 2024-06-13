const { getPlanets } = require("./../../models/planets.model.js");

function httpGetPlanets(req, res) {
  return res.json(getPlanets());
}

module.exports = { httpGetPlanets };
