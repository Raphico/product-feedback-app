import { initApp } from "./app.js";
import { config } from "./config.js";
import { initLogger } from "./logging.js";
import gracefulShutdown from "http-graceful-shutdown";

void (async function main() {
  const logger = initLogger(config);
  const app = await initApp(config, { logger });

  app.fastify.listen(
    {
      host: "0.0.0.0",
      port: config.port,
    },
    (error, address) => {
      if (error) {
        logger.error(error);
        process.exit(1);
      }

      logger.info(`Server is running on ${address}`);
    },
  );

  gracefulShutdown(app, {
    async preShutdown(signal) {
      logger.info(signal, "Shutdown signal received");
    },
    async onShutdown() {
      await app.shutdown();
    },
    finally() {
      logger.info("Shutdown complete");
    },
  });
})();
