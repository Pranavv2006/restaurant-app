const path = require("path");
const fs = require("fs");
const item = require("../controllers/addItem");

const beforeUploadMiddleware = (req, res, next) => {
  console.log("🔍 BEFORE upload middleware:");
  console.log("- Content-Type:", req.headers["content-type"]);
  console.log("- Body exists:", !!req.body);
  console.log(
    "- Body keys:",
    req.body ? Object.keys(req.body) : "Body is null/undefined"
  );
  next();
};

const afterUploadMiddleware = (req, res, next) => {
  console.log("🔍 AFTER upload middleware:");
  console.log("- req.file:", req.file);
  console.log("- req.body:", req.body);
  console.log("- File path:", req.file?.path);
  console.log(
    "- File exists:",
    req.file ? fs.existsSync(req.file.path) : false
  );
  next();
};

module.exports = [
  beforeUploadMiddleware,
  item.uploadMiddleware,
  afterUploadMiddleware,
  item.addItemController,
];
