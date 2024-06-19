const { createServer } = require("http");
const mongoose = require("mongoose");
const app = require("./app.js");
const { loadPlanetsData } = require("./models/planets/planets.model.js");

const PORT = process.env.PORT || 8000;
const MONGO_URL = `mongodb+srv://Manohy:n8ZEQLah5-2jg2s@cluster0.ywtcljw.mongodb.net/nasa?retryWrites=true&w=majority&appName=Cluster0`;

const clientOptions = {
  serverApi: { version: "1", strict: true, deprecationErrors: true },
};
async function run() {
  try {
    // Create a Mongoose client with a MongoClientOptions object to set the Stable API version
    await mongoose.connect(MONGO_URL, clientOptions);
    await mongoose.connection.db.admin().command({ ping: 1 });

    mongoose.connection.once("open", () => {
      console.log("MongoDB connecion ready!");
    });

    mongoose.connection.on("error", (err) => {
      console.error(err);
    });
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error}`);
    process.exit(1); // Exit process with failure
  }
}
run().catch(console.dir);

const startServer = async () => {
  await loadPlanetsData();

  const server = createServer(app);
  server.listen(PORT, () => console.log(`Listening to port ${PORT}`));
};

startServer();
