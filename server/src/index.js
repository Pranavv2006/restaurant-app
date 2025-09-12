const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const loginRegisterRoutes = require("./routes/loginRegisterRoutes");
const merchantRoutes = require("./routes/merchantRoutes");
const { authenticate } = require("./middlewares/authenticate");
const prisma = require("./models/prismaClient");
const rateLimit = require("express-rate-limit");

require("dotenv").config();

const app = express();
const port = process.env.server_port || 3000;

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      "http://localhost:4173",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const uploadsDir = path.join(__dirname, "../uploads"); // Corrected path
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log("✅ Created uploads directory:", uploadsDir);
}

const menuItemsDir = path.join(uploadsDir, "menu-items");
if (!fs.existsSync(menuItemsDir)) {
  fs.mkdirSync(menuItemsDir, { recursive: true });
  console.log("✅ Created menu-items directory:", menuItemsDir);
}

app.use((req, res, next) => {
  console.log(`📍 ${req.method} ${req.path}`);
  next();
});

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Serve /uploads/menu-items
app.use(
  "/uploads/menu-items",
  express.static(path.join(__dirname, "../uploads/menu-items"))
);

// Serve /uploads/restaurants
app.use(
  "/uploads/restaurants",
  express.static(path.join(__dirname, "../uploads/restaurants"))
);

app.get("/test-image/:filename", (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(__dirname, "../uploads/menu-items", filename); // Corrected path

  console.log("Looking for file:", filePath);

  try {
    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath);
      const allFiles = fs.readdirSync(
        path.join(__dirname, "../uploads/menu-items")
      );
      res.json({
        exists: true,
        path: filePath,
        size: stats.size,
        allFiles: allFiles,
      });
    } else {
      const allFiles = fs.readdirSync(
        path.join(__dirname, "../uploads/menu-items")
      );
      res.status(404).json({
        exists: false,
        path: filePath,
        allFiles: allFiles,
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/debug-image/:filename", (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(__dirname, "../uploads/restaurants", filename); // Corrected path

  console.log("Looking for file:", filePath);

  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).json({ error: "File not found", path: filePath });
  }
});

const limiter = rateLimit({
  max: 100,
  windowMs: 10 * 60 * 1000,
  message: "Too many Requests, please try again after 10 minutes",
});

const openPaths = ["/login", "/register"];
const jwtGuard = (req, res, next) => {
  if (req.path.startsWith("/uploads") || openPaths.includes(req.path)) {
    return next();
  }
  return authenticate(req, res, next);
};

app.use("/Restaurant", limiter, jwtGuard, loginRegisterRoutes);
app.use("/Restaurant/Merchant", authenticate, merchantRoutes);

app.get("/", async (req, res) => {
  const result = await prisma.$queryRaw`SELECT current_database()`;
  res.send(`The Database name is ${result[0].current_database}`);
});

app.get("/debug-uploads", (req, res) => {
  try {
    const uploadsPath = path.join(__dirname, "../uploads"); // Corrected path

    function getDirectoryContents(dirPath, relativePath = "") {
      const items = [];

      if (!fs.existsSync(dirPath)) {
        return { error: `Directory doesn't exist: ${dirPath}` };
      }

      const files = fs.readdirSync(dirPath);

      files.forEach((file) => {
        const fullPath = path.join(dirPath, file);
        const stats = fs.statSync(fullPath);
        const relativeFilePath = path.join(relativePath, file);

        if (stats.isDirectory()) {
          items.push({
            name: file,
            type: "directory",
            path: relativeFilePath,
            contents: getDirectoryContents(fullPath, relativeFilePath),
          });
        } else {
          items.push({
            name: file,
            type: "file",
            path: relativeFilePath,
            size: stats.size,
            modified: stats.mtime,
            url: `http://localhost:${port}/uploads/${relativeFilePath.replace(
              /\\/g,
              "/"
            )}`,
          });
        }
      });

      return items;
    }

    const result = {
      uploadsDirectory: uploadsPath,
      contents: getDirectoryContents(uploadsPath),
    };

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`🚀 Server listening on port ${port}`);
});
