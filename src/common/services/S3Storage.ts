/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
    DeleteObjectCommand,
    PutObjectCommand,
    S3Client,
} from "@aws-sdk/client-s3";
import { FileData, FileStorage } from "../types/storage";
import config from "config";
import createHttpError from "http-errors";

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
    async delete(filename: string): Promise<void> {
        const objectParams = {
            Bucket: config.get("aws.bucket"),
            Key: filename,
        };
        // @ts-ignore
        await this.client.send(new DeleteObjectCommand(objectParams));
    }
    getObjectUrl(id: string): string {
        //https://pizza-mern-bucket-image.s3.ap-south-1.amazonaws.com/23573ed4-bed8-4ab1-9475-3783639ecc4e
        const bucket = config.get("aws.bucket");
        const region = config.get("aws.region");
        if (typeof bucket === "string" && typeof region === "string") {
            return `https://${bucket}.s3.${region}.amazonaws.com/${id}`;
        }
        const error = createHttpError(500, "Invalid s3 config");
        throw error;
    }
}
