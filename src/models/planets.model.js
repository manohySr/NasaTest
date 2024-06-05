import { createReadStream } from "fs";
import path from "path";
import { parse } from "csv-parse";

const habitablePlanets = [];

const pathToDB = path.join(
  import.meta.dirname,
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
        .on("data", (data) => {
          if (isHabitablePlanet(data)) {
            habitablePlanets.push(data);
            resolve();
          }
        })
        .on("error", (err) => {
          console.log(err);
          reject(err);
        })
        .on("end", () => {
          console.log(`there is ${habitablePlanets.length} habitable planets`);
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

export { habitablePlanets, loadPlanetsData };
