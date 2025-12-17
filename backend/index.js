const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");
const { logger } = require("./middleware");

dotenv.config();
const db = require("./models");
db.mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
let dbConnection = db.mongoose.connection;
dbConnection.on("error", (error) => {
  console.log("Error connecting to database: ", error.message);
});
dbConnection.once("open", () => {
  console.log("connection to db established");
});

const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false, // Disable for easier development
  crossOriginEmbedderPolicy: false
}));

// Logging middleware
app.use(logger);

app.use(bodyParser.json());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(function (req, res, next) {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
});

// Serve static files (Frontend)
app.use(express.static(path.join(__dirname, '../frontend/public')));

// API Routes
app.use("/task", require("./routes/task.route"));
app.use("/auth", require("./routes/auth.route"));

// Serve index.html for root
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(`Error: ${err.message}`);
  console.error(`Stack: ${err.stack}`);
  res.status(err.status || 500).json({
    message: err.message,
    error: err.message,
    status: err.status || 500
  });
});

app.listen(process.env.APP_PORT, () => {
  console.log(`Example app listening on port ${process.env.APP_PORT}`);
});
