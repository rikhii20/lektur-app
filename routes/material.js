const express = require("express");
const {
  createMaterial,
  updateMaterial,
  deleteMaterial,
} = require("../controllers/materialController");
const router = express.Router();
const { isTeacher } = require("../middlewares/auth");
const { uploadCloud } = require("../middlewares/upload-files");

router.post("/", isTeacher, uploadCloud("url", "pdf"), createMaterial);
router.put("/:id", isTeacher, uploadCloud("url", "pdf"), updateMaterial);
router.delete("/:id", isTeacher, deleteMaterial);

module.exports = router;
