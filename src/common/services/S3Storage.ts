/* eslint-disable @typescript-eslint/ban-ts-comment */
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { FileData, FileStorage } from "../types/storage";
import config from "config";

export class S3Storage implements FileStorage {
    private client: S3Client;
    constructor() {
        this.client = new S3Client({
            region: config.get("aws.region"),
            credentials: {
                secretAccessKey: config.get("aws.secretAccessKey"),
                accessKeyId: config.get("aws.accessKeyId"),
            },
        });
    }
    async upload(data: FileData): Promise<void> {
        const objectParams = {
            Bucket: config.get("aws.bucket"),
            Key: data.filename,
            Body: data.fileData,
        };
        // @ts-ignore
        await this.client.send(new PutObjectCommand(objectParams));
    }
    delete(): void {
        throw new Error("Method not implemented.");
    }
    getObjectUrl(): string {
        throw new Error("Method not implemented.");
    }
}
