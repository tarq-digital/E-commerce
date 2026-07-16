const app = require("./app");
const appConfig = require("./config/app");
const { logger } = require("./logs");
const pool = require("./database/connection");

// Uncaught Exception Handler
process.on("uncaughtException", (err) => {
  logger.error("UNCAUGHT EXCEPTION! 💥 Shutting down...", err);
  process.exit(1);
});

let server;

const startServer = async () => {
  try {
    // Await DB connection verify before accepting HTTP requests
    await pool.getConnection();

    server = app.listen(appConfig.port, () => {
      logger.info(
        `🚀 Weebster API v${appConfig.apiVersion} running on port ${appConfig.port} in ${appConfig.env} mode`,
      );
    });
  } catch (err) {
    logger.error("Failed to start server due to Database error", err);
    process.exit(1);
  }
};

startServer();

// Unhandled Rejection Handler
process.on("unhandledRejection", (err) => {
  logger.error("UNHANDLED REJECTION! 💥 Shutting down...", err);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

// Graceful Shutdown on SIGINT/SIGTERM (e.g. Docker stopping container)
const gracefulShutdown = () => {
  logger.info("SIGTERM/SIGINT received. Shutting down gracefully...");
  if (server) {
    server.close(async () => {
      logger.info("HTTP server closed.");
      await pool.end();
      logger.info("Database connections closed.");
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
};

process.on("SIGTERM", gracefulShutdown);
process.on("SIGINT", gracefulShutdown);
