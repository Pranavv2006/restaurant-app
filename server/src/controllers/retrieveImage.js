const retrieveImageController = (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(__dirname, "../uploads/menu-items", filename);

  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).json({ error: "Image not found" });
  }
};

module.exports = { retrieveImageController };
