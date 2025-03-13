import { initApp } from "./app.js";
import { config, Env } from "./config.js";
import { initLogger } from "./logging.js";
import gracefulShutdown from "http-graceful-shutdown";

void (async function main() {
  const logger = initLogger(config);
  const app = await initApp(config, { logger });

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
    },
    finally() {
      logger.info("Shutdown complete");
    },
  });
})();
