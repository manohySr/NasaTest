const { getPlanets } = require("./../../models/planets/planets.model.js");

async function httpGetPlanets(req, res) {
  const data = await getPlanets()
  res.statusCode = 200;
  return res.json({
    ok: true,
    data
  });
}

module.exports = { httpGetPlanets };
