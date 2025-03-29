import { KafkaProducerBroker } from "../../config/kafka";
import { MessageProducerBroker } from "../types/broker";
import config from "config";
let messageProducer: MessageProducerBroker | null = null;

export const createMessageProducerBroker =
    async (): Promise<MessageProducerBroker> => {
        //making singleton instance
        if (!messageProducer) {
            messageProducer = new KafkaProducerBroker("catalog-service", [
                config.get("kafka.brokers"),
            ]);
            await messageProducer.connect();
        }
        return messageProducer;
    };
