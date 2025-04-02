import { NextFunction, Response } from "express";
import { validationResult } from "express-validator";
import createHttpError from "http-errors";
import { Logger } from "winston";
import { ProductService } from "./product-service";
import { CreateProductRequest, Filter, Product } from "./product-types";
import { FileStorage } from "../common/types/storage";
import { v4 as uuidv4 } from "uuid";
import { UploadedFile } from "express-fileupload";
import { AuthRequest } from "../common/types";
import mongoose from "mongoose";
import { MessageProducerBroker } from "../common/types/broker";
import { mapToObject } from "../utils";

export class ProductController {
    constructor(
        private productService: ProductService,
        private logger: Logger,
        private storage: FileStorage,
        private broker: MessageProducerBroker,
    ) {}
    async create(req: CreateProductRequest, res: Response, next: NextFunction) {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return next(createHttpError(400, result.array()[0].msg as string));
        }

        const image = req.files!.image as UploadedFile;
        const imageName = uuidv4();
        await this.storage.upload({
            filename: imageName,
            fileData: image.data.buffer,
        });

        const updatProductData = {
            name: req.body.name,
            description: req.body.description,
            image: imageName,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            priceConfiguration: JSON.parse(
                req.body.priceConfiguration as unknown as string,
            ),
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            attributes: JSON.parse(req.body.attributes as unknown as string),
            tenantId: req.body.tenantId,
            categoryId: req.body.categoryId,
            isPublish: req.body.isPublish,
        };

        const newProduct = await this.productService.create(updatProductData);
        //send product to kafka
        await this.broker.sendMessages(
            "product",
            JSON.stringify({
                _id: newProduct?._id,
                priceConfiguration: mapToObject(newProduct?.priceConfiguration),
            }),
        );

        return res.json({ data: newProduct._id });
    }

    async update(req: CreateProductRequest, res: Response, next: NextFunction) {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return next(createHttpError(400, result.array()[0].msg as string));
        }

        const { productId } = req.params;
        const fetchedProduct =
            await this.productService.getProductById(productId);

        if (!fetchedProduct) {
            return next(createHttpError(404, "Product not found"));
        }
        if (
            (req as AuthRequest)?.auth.role !== "admin" &&
            (req as AuthRequest)?.auth.role !== "manager"
        ) {
            return next(
                createHttpError(
                    403,
                    "You are not allowed to update this product",
                ),
            );
        }
        const tennantId = (req as AuthRequest)?.auth?.tenant;
        if (tennantId && fetchedProduct.tenantId !== String(tennantId)) {
            return next(
                createHttpError(
                    403,
                    "You are not allowed to update this product",
                ),
            );
        }

        let imageName = "";
        const oldImage = fetchedProduct.image;
        if (req.files?.image) {
            const image = req.files.image as UploadedFile;
            imageName = uuidv4();
            await this.storage.upload({
                filename: imageName,
                fileData: image.data.buffer,
            });
            if (oldImage) {
                await this.storage.delete(oldImage);
            }
        }

        const updatProductData = {
            name: req.body.name,
            description: req.body.description,
            image: imageName ? imageName : oldImage || "",
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            priceConfiguration: JSON.parse(
                req.body.priceConfiguration as unknown as string,
            ),
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            attributes: JSON.parse(req.body.attributes as unknown as string),
            tenantId: req.body.tenantId,
            categoryId: req.body.categoryId,
            isPublish: req.body.isPublish,
        };

        const product = await this.productService.update(
            productId,
            updatProductData,
        );
        await this.broker.sendMessages(
            "product",
            JSON.stringify({
                _id: product?._id,
                priceConfiguration: mapToObject(product?.priceConfiguration),
            }),
        );
        if (!product) {
            return next(createHttpError(404, "Product not found"));
        }
        return res.json({ id: product._id });
    }

    async getAllProducts(req: CreateProductRequest, res: Response) {
        const { q, tenantId, categoryId, isPublish } = req.query;
        const filters: Filter = {};
        if (isPublish === "true") {
            filters.isPublish = true;
        }
        if (tenantId) {
            filters.tenantId = tenantId as string;
        }
        if (
            categoryId &&
            mongoose.Types.ObjectId.isValid(categoryId as string)
        ) {
            filters.categoryId = new mongoose.Types.ObjectId(
                categoryId as string,
            );
        }
        const paginateQuery = {
            page: req.query.currentPage
                ? parseInt(req.query.currentPage as string)
                : 1,
            limit: req.query.perPage
                ? parseInt(req.query.perPage as string)
                : 10,
        };

        const products = await this.productService.getAllProducts(
            q as string,
            filters,
            paginateQuery,
        );
        if (!Array.isArray(products.data)) {
            return res.json({
                data: [],
                total: 0,
                pageSize: 0,
                currentPage: 0,
            });
        }

        const finalProduct = products?.data?.map((product: Product) => {
            return {
                ...product,
                image: this.storage.getObjectUrl(product.image),
            };
        });
        return res.json({
            data: finalProduct,
            total: products.total,
            pageSize: products.pageSize,
            currentPage: products.currentPage,
        });
    }
    async getProduct(req: CreateProductRequest, res: Response) {
        const { productId } = req.params;
        const fetchedProduct =
            await this.productService.getProductById(productId);
        return res.json({ data: fetchedProduct });
    }

    async delete(req: CreateProductRequest, res: Response) {
        const { productId } = req.params;
        const deletedProduct =
            await this.productService.deleteProductById(productId);
        return res.json({ id: deletedProduct?._id });
    }
}
