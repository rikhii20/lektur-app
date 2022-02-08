const express = require("express");
const router = express.Router();

const userRoutes = require("./user")
const assessmentRoutes = require("./assessment")
const answerRoutes = require("./answer")
router.use("/quiz", answerRoutes)
router.use("/assessment", assessmentRoutes);
router.use("/user", userRoutes);

module.exports = router;