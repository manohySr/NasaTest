const { getPlanets } = require("./../../models/planets.model.js");

function httpGetPlanets(req, res) {
  const data = getPlanets()
  res.statusCode = 200;
  return res.json({
    ok: true,
    data
  });
}

module.exports = { httpGetPlanets };
