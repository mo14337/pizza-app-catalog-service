import { NextFunction, Response } from "express";
import { validationResult } from "express-validator";
import createHttpError from "http-errors";
import { Logger } from "winston";
import { ProductService } from "./product-service";
import { CreateProductRequest } from "./product-types";

export class ProductController {
    constructor(
        private productService: ProductService,
        private logger: Logger,
    ) {}
    async create(req: CreateProductRequest, res: Response, next: NextFunction) {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return next(createHttpError(400, result.array()[0].msg as string));
        }
        const product = {
            name: req.body.name,
            description: req.body.description,
            image: "image",
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

        const newProduct = await this.productService.create(product);
        return res.json({ data: newProduct._id });
    }
}
