require("dotenv").config();
const express = require("express");
const app = express();

require("./startup")(app);

module.exports = app;
