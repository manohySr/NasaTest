const express = require("express");
const { route } = require("./routes/api.js");

const app = express();
app.use(express.json());

app.use("/v1", route);

module.exports = app;
