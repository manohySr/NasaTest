const { createServer } = require('http');
const app = require('./app.js');
const { loadPlanetsData } = require('./models/planets.model.js');

const PORT = process.env.PORT || 8000;

const startServer = async () => {
  await loadPlanetsData();
  const server = createServer(app);
  server.listen(PORT, () => console.log(`Listening to port ${PORT}`));
};

startServer();
