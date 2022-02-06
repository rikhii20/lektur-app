const express = require("express");
const {
  createMaterial,
  updateMaterial,
  deleteMaterial,
} = require("../controllers/materialController");
const router = express.Router();
const { isTeacher } = require("../middlewares/auth");
const { uploadCloud } = require("../middlewares/upload-image");

router.post("/", isTeacher, uploadCloud("url"), createMaterial);
router.put("/:id", isTeacher, uploadCloud("url"), updateMaterial);
router.delete("/:id", isTeacher, deleteMaterial);

module.exports = router;
