const express = require("express");
const router = express.Router();
const {
  uploadFile,
  getFile,
  getAllFiles,
  deleteFile,
  updateFile,
  downloadFile,
} = require("../controllers/file");

const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/files/");
  },
  filename: function (req, file, cb) {
    const randomName = Array(32)
      .fill(null)
      .map(() => Math.round(Math.random() * 16).toString(16))
      .join("");
    cb(null, `${randomName}${file.originalname}`);
  },
});

const upload = multer({ storage });

router.post("/upload", upload.single("file"), uploadFile);
router.get("/list", getAllFiles);
router.get("/:id", getFile);
router.delete("/delete/:id", deleteFile);
router.put("/update/:id", upload.single("file"), updateFile);
router.get("/download/:id", downloadFile);

module.exports = router;
