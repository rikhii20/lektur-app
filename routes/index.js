const express = require("express");
const router = express.Router();
const userRoutes = require("./user");
const courseRoutes = require("./course");
const contentRoutes = require("./content");
const materialRoutes = require("./material");
const studentRoutes = require("./student");
const assessmentRoutes = require("./assessment")

router.use("/course", courseRoutes);
router.use("/content", contentRoutes);
router.use("/user", userRoutes);
router.use("/material", materialRoutes);
router.use("/student", studentRoutes);
router.use("/assessment", assessmentRoutes);


module.exports = router;
