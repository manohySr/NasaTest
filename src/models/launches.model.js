const launches = new Map();
let lastLaunchFlighNumber = 100;
const launch = {
  flighNumber: lastLaunchFlighNumber,
  mission: "Kepler Exploration X",
  rocket: "Explorer IS1",
  launchDate: new Date("December 27, 2023"),
  target: "Kepler-442 b",
  customers: ["ZTM", "NASA"],
  upcoming: true,
  success: true,
};

function getAllLaunches() {
  return Array.from(launches.values());
}

launches.set(launch.flighNumber, launch);

function addNewLaunch(launch) {
  launches.set(
    lastLaunchFlighNumber++,
    Object.assign(launch, {
      flighNumber: lastLaunchFlighNumber,
      customers: ["NASA"],
      upcoming: true,
      success: true,
    })
  );
}

function abordedLunchById(launchId) {
  const launch = launches.get(launchId);
  launch.upcoming = false;
  launch.success = false;
  return launch;
}

export { getAllLaunches, addNewLaunch, abordedLunchById };
