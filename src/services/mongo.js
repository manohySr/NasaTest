require("dotenv").config();

const mongoose = require("mongoose");

const MONGO_URL = String(process.env.MONGO_URL);

const clientOptions = {
  serverApi: { version: "1", strict: true, deprecationErrors: true },
};

async function mongoConnect() {
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

async function mongoDisconnect() {
  try {
    await mongoose.disconnect();
  } catch (error) {
    console.error(`Error disconnecting to MongoDB: ${error}`);
  }
}

module.exports = {
  mongoConnect,
  mongoDisconnect,
};
