import {
  abordedLunchById,
  addNewLaunch,
  getAllLaunches,
} from "../../models/launches.model.js";

function httpGetLaunches(req, res) {
  res.status(200).json(getAllLaunches());
}

function httpPostLaunch(req, res) {
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

  addNewLaunch(launch);
  return res.status(201).json(launch);
}

function httpDeleteLaunch(req, res) {
  const launchId = Number(req.params.id);
  const aborded = abordedLunchById(launchId);
  return res.status(200).json(aborded);
}

export { httpGetLaunches, httpPostLaunch, httpDeleteLaunch };
