import app from "./app";
import { createMessageProducerBroker } from "./common/factories/brokerFactory";
import { MessageProducerBroker } from "./common/types/broker";
import { initDb } from "./config/db";
import logger from "./config/logger";
import config from "config";

const startServer = async () => {
    const PORT: number = config.get("server.port") || 5502;
    let messageProducerBroker: MessageProducerBroker | null = null;
    try {
        await initDb();
        messageProducerBroker = createMessageProducerBroker();
        await messageProducerBroker.connect();
        app.listen(PORT, () => logger.info(`Listening on port ${PORT}`));
    } catch (err: unknown) {
        if (messageProducerBroker) {
            await messageProducerBroker.disconnect();
        }
        if (err instanceof Error) {
            logger.error(err.message);
            logger.on("finish", () => {
                process.exit(1);
            });
        }
    }
};

void startServer();
