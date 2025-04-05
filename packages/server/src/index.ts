import "@dotenvx/dotenvx/config";
import { initApp } from "./app.js";
import { config, Env } from "./config.js";
import { initDB, shutdownDB } from "./db/index.js";
import { initLogger } from "./logging.js";
import gracefulShutdown from "http-graceful-shutdown";
import { MailService } from "./services/mail.js";
import { FileUploadService } from "./services/file-upload.js";

void (async function main() {
  const logger = initLogger(config);

  const { db, pool } = await initDB(config)
    .then((response) => {
      logger.info("Database connected successfully");
      return response;
    })
    .catch((error) => {
      logger.error(error);
      process.exit(1);
    });

  const mailService = new MailService(config, logger);
  const fileUploadService = new FileUploadService(config, logger);

  const app = await initApp(config, {
    logger,
    mailService,
    fileUploadService,
    db,
  });

  app.fastify.listen(
    {
      host: "localhost",
      port: config.port,
    },
    (error) => {
      if (error) {
        logger.error(error);
        process.exit(1);
      }
    },
  );

  gracefulShutdown(app.fastify.server, {
    timeout: config.shutdownTimeout,
    development: config.env != Env.Prod,
    async preShutdown(signal) {
      logger.info(signal, "Shutdown signal received");
    },
    async onShutdown() {
      await app.shutdown();
      await shutdownDB(pool);
    },
    finally() {
      logger.info("Shutdown complete");
    },
  });
})();
