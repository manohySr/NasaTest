const { createReadStream } = require("fs");
const path = require("path");
const { parse } = require("csv-parse");

const planets = require("./planets.mongo");

const pathToDB = path.join(
  __dirname,
  "..",
  "..",
  "..",
  "data",
  "kepler_data.csv"
);

function loadPlanetsData() {
  return new Promise((resolve, reject) => {
    createReadStream(pathToDB).pipe(
      parse({
        comment: "#",
        columns: true,
      })
        .on("data", async (data) => {
          if (isHabitablePlanet(data)) {
            await savePlanet(data);
            resolve();
          }
        })
        .on("error", (err) => {
          console.log(err);
          reject(err);
        })
        .on("end", async () => {
          const countPlanetsFound = (await getPlanets()).length;
          console.log(`there is ${countPlanetsFound} habitable planets`);
        })
    );
  });
}

function isHabitablePlanet(planet) {
  return (
    planet["koi_disposition"] === "CONFIRMED" &&
    planet["koi_insol"] > 0.36 &&
    planet["koi_insol"] < 1.11 &&
    planet["koi_prad"] < 1.6
  );
}

async function getPlanets() {
  return await planets.find(
    {},
    {
      _id: 0,
      __v: 0,
    }
  );
}

async function savePlanet(planet) {
  try {
    await planets.updateOne(
      {
        keplerName: planet.kepler_name,
      },
      {
        keplerName: planet.kepler_name,
      },
      {
        upsert: true,
      }
    );
  } catch (error) {
    console.error(error);
  }
}

module.exports = { getPlanets, loadPlanetsData };
