const express = require("express");
const {
  createMaterial,
  updateMaterial,
  deleteMaterial,
  getMaterials,
} = require("../controllers/materialController");
const router = express.Router();
const { isTeacher } = require("../middlewares/auth");
const { uploadCloud } = require("../middlewares/upload-files");

router.post("/create", isTeacher, uploadCloud("url", "pdf"), createMaterial);
router.get("/fetch", getMaterials);
router.put("/edit", isTeacher, uploadCloud("url", "pdf"), updateMaterial);
router.delete("/delete", isTeacher, deleteMaterial);

module.exports = router;
