export interface MessageProducerBroker {
    connect: () => Promise<void>;
    disconnect: () => Promise<void>;
    sendMessages: (topic: string, message: string) => Promise<void>;
}
