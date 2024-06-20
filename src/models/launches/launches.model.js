const launchDbCollection = require("./launches.mongo");
const planet = require("./../planets/planets.mongo");

let DEFAULT_FLIGHT_NUMBER = 0;

const launch = {
  flightNumber: 1,
  mission: "From Madagascar to the stars",
  rocket: "Explorer IS1",
  launchDate: new Date("December 27, 2023"),
  target: "Kepler-442 b",
  customers: ["ZTM", "NASA"],
  upcoming: true,
  success: true,
};

saveLaunch(launch);

async function getAllLaunches() {
  return await launchDbCollection.find({}, { _id: 0, __v: 0 });
}

async function saveLaunch(launch) {
  try {
    const target = await planet.findOne({ keplerName: launch.target });

    if (!target) {
      throw new Error("Error: the targeted planet doesn't exist");
    }

    return await launchDbCollection.findOneAndUpdate(
      {
        flightNumber: launch.flightNumber,
      },
      launch,
      {
        upsert: true,
        returnDocument: "after",
        projection: {
          _id: 0,
          __v: 0,
        },
      }
    );
  } catch (error) {
    console.error(error);
  }
}

async function getLastLaunchFlightNumber() {
  const latestLaunch = await launchDbCollection.findOne().sort("-flightNumber");
  if (!latestLaunch) return DEFAULT_FLIGHT_NUMBER;
  return latestLaunch.flightNumber;
}

async function scheduleNewLaunch(launch) {
  const newFlightNumber = (await getLastLaunchFlightNumber()) + 1;
  const newLaunch = Object.assign(launch, {
    flightNumber: newFlightNumber,
    customers: ["NASA"],
    upcoming: true,
    success: true,
  });
  return await saveLaunch(newLaunch);
}

async function isLaunchIdExist(launchId) {
  const isExist = await launchDbCollection.findOne({
    flightNumber: launchId,
  });
  return isExist ? true : false;
}

async function abordedLunchById(launchId) {
  const abordedLaunch = await launchDbCollection.updateOne(
    {
      flightNumber: launchId,
    },
    {
      upcoming: false,
      success: false,
    }
  );
  return abordedLaunch.modifiedCount === 1;
}

module.exports = {
  getAllLaunches,
  scheduleNewLaunch,
  abordedLunchById,
  isLaunchIdExist,
};
