const express = require("express");
const router = express.Router();

const userRoutes = require("./user")
const courseRoutes = require('./course')

router.use("/course", courseRoutes)
router.use("/user", userRoutes );

module.exports = router;