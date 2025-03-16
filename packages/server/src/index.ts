import { initApp } from "./app.js";
import { config, Env } from "./config.js";
import { initDB, shutdownDB } from "./db.js";
import { initLogger } from "./logging.js";
import gracefulShutdown from "http-graceful-shutdown";
import { MailService } from "./services/mail.js";

void (async function main() {
  const logger = initLogger(config);

  await initDB(config)
    .then(() => logger.info("MongoDB connected successfully"))
    .catch((error) => logger.error(error));

  const mailService = new MailService(config, logger);

  const app = await initApp(config, { logger, mailService });

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
      await shutdownDB();
    },
    finally() {
      logger.info("Shutdown complete");
    },
  });
})();
