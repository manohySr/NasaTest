const {
  abordedLunchById,
  scheduleNewLaunch,
  getAllLaunches,
  isLaunchIdExist,
} = require("../../models/launches/launches.model.js");

async function httpGetLaunches(req, res) {
  const data = await getAllLaunches();
  res.status(200).json({
    ok: true,
    data,
  });
}

async function httpPostLaunch(req, res) {
  const launch = req.body;

  if (
    !launch.mission ||
    !launch.rocket ||
    !launch.launchDate ||
    !launch.target
  ) {
    return res.status(400).json({
      ok: false,
      error:
        "launch.mission | launch.rocket | launch.launchDate | launch.target should not be void",
    });
  }

  launch.launchDate = new Date(launch.launchDate);
  if (isNaN(launch.launchDate)) {
    return res.status(400).json({
      ok: false,
      error: "date format error",
    });
  }
  const newLaunchSchedulted = await scheduleNewLaunch(launch);
  return res.status(201).json({
    ok: true,
    data: newLaunchSchedulted,
  });
}

async function httpDeleteLaunch(req, res) {
  const launchId = Number(req.params.id);
  const isExist = await isLaunchIdExist(launchId);
  if (!isExist) {
    return res.status(404).json({
      ok: false,
      error: "Error: launch not found",
    });
  }

  const aborded = await abordedLunchById(launchId);
  if (!aborded) {
    return res.status(400).json({
      ok: false,
      error: "Error: launch not found",
    });
  }
  return res.status(200).json({ ok: true });
}

module.exports = { httpGetLaunches, httpPostLaunch, httpDeleteLaunch };
