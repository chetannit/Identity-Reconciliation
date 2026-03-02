const express = require("express");
const cors = require("cors");
const routes = require("./routes");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/", routes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Start server with error handling
const server = app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
  console.log(`📍 Identify endpoint: http://localhost:${PORT}/identify`);
});

// Handle server errors
server.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    console.error(`\n❌ Error: Port ${PORT} is already in use!`);
    console.error(`\n💡 Solutions:`);
    console.error(`   1. Stop the other process using port ${PORT}`);
    console.error(`   2. Use a different port: PORT=3001 npm start`);
    console.error(`   3. Kill the process: netstat -ano | findstr :${PORT}\n`);
    process.exit(1);
  } else {
    console.error("❌ Server error:", error);
    process.exit(1);
  }
});

// Handle graceful shutdown
process.on("SIGINT", () => {
  console.log("\n🛑 Shutting down server gracefully...");
  server.close(() => {
    console.log("✅ Server closed");
    process.exit(0);
  });
});
