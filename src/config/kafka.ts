import { Kafka, Producer } from "kafkajs";
import { MessageProducerBroker } from "../common/types/broker";

export class KafkaProducerBroker implements MessageProducerBroker {
    private producer: Producer;

    constructor(clientId: string, brokers: string[]) {
        const kafka = new Kafka({
            clientId: clientId,
            brokers: brokers,
        });
        this.producer = kafka.producer();
    }

    async connect() {
        await this.producer.connect();
    }

    async disconnect() {
        if (this.producer) {
            return await this.producer.disconnect();
        }
    }
    /**
     *
     * @param topic - this is the topic to which the message will be sent
     * @param message - this is the message that will be sent to the topic
     * @throws {Error} - if the message is not sent successfully
     */

    async sendMessages(topic: string, message: string, key?: string) {
        const data: { value: string; key?: string } = { value: message };
        if (key) {
            data.key = key;
        }
        await this.producer.send({
            topic: topic,
            messages: [data],
        });
    }
}
