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

const SPACEX_API_URL = "https://api.spacexdata.com/v5/launches/query";

async function populateLaunches() {
  console.log("Downloading launch data ...");
  const options = {
    query: {},
    options: {
      pagination: false,
      populate: [
        {
          path: "rocket",
          select: {
            name: 1,
          },
        },
        {
          path: "payloads",
          select: {
            customers: 1,
          },
        },
      ],
    },
  };

  const response = await fetch(SPACEX_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(options),
  });

  if (response.status !== 200) {
    console.log("Problem downloading launch data");
    throw new Error("Launch data download failed");
  }

  const data = await response.json();
  const launchDocs = data.docs;

  for (const launchDoc of launchDocs) {
    const payloads = launchDoc["payloads"];
    const customers = payloads.flatMap((payload) => {
      return payload["customers"];
    });

    const launch = {
      flightNumber: launchDoc["flight_number"],
      mission: launchDoc["name"],
      rocket: launchDoc["rocket"]["name"],
      launchDate: launchDoc["date_local"],
      upcoming: launchDoc["upcoming"],
      success: launchDoc["success"],
      customers,
    };
    console.log(`${launch.flightNumber} ${launch.mission}`);
    saveLaunch(launch);
  }
}

async function loadLaunchesData() {
  const firstLaunch = await findLaunch({
    flightNumber: 1,
    rocket: "Falcon 1",
    mission: "FalconSat",
  });
  if (firstLaunch) {
    console.log("Launch data already loaded!");
  } else {
    await populateLaunches();
  }
}

async function getAllLaunches(skip, limit) {
  return await launchDbCollection
    .find({}, { _id: 0, __v: 0 })
    .sort({ flightNumber: 1 })
    .skip(skip)
    .limit(limit);
}

async function saveLaunch(launch) {
  try {
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
  const target = await planet.findOne({ keplerName: launch.target });

  if (!target) {
    throw new Error("Error: the targeted planet doesn't exist");
  }
  const newFlightNumber = (await getLastLaunchFlightNumber()) + 1;
  const newLaunch = Object.assign(launch, {
    flightNumber: newFlightNumber,
    customers: ["NASA"],
    upcoming: true,
    success: true,
  });
  return await saveLaunch(newLaunch);
}

async function findLaunch(filter) {
  return await launchDbCollection.findOne(filter);
}

async function isLaunchIdExist(launchId) {
  const isExist = await findLaunch({
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
  loadLaunchesData,
  getAllLaunches,
  scheduleNewLaunch,
  abordedLunchById,
  isLaunchIdExist,
};
