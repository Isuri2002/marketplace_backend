const app = require("../src/app");
const { connectDatabase } = require("../src/config/dbConnection");
const config = require("../src/config/config");

// Connect to DB on cold start; reused across warm invocations
connectDatabase().catch((err) => {
  console.error("MongoDB connection failed:", err);
});

// When started directly (npm start/dev), run as a normal HTTP server.
// When loaded by Vercel, this file is imported and only exports the app handler.
if (require.main === module) {
  app.listen(config.port, () => {
    console.log(`API server listening on port ${config.port}`);
  });
}

module.exports = app;
