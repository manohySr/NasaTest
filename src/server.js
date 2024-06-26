const { createServer } = require("http");
require("dotenv").config();

const app = require("./app.js");
const { mongoConnect } = require("./services/mongo.js");
const { loadPlanetsData } = require("./models/planets/planets.model.js");
const { loadLaunchesData } = require("./models/launches/launches.model.js");

const PORT = process.env.PORT || 8000;

const startServer = async () => {
  await mongoConnect();
  await loadLaunchesData();
  await loadPlanetsData();

  const server = createServer(app);
  server.listen(PORT, () => console.log(`Listening to port ${PORT}`));
};

startServer();
