const express = require("express");
const router = express.Router();

const userRoutes = require("./user")
const assessmentRoutes = require("./assessment")

router.use("/assessment", assessmentRoutes);
router.use("/user", userRoutes);

module.exports = router;