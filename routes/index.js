const express = require("express");
const router = express.Router();

const userRoutes = require("./user")
const questionRoutes = require("./question")

router.use("/user", userRoutes );
router.use("/question",questionRoutes )

module.exports = router;