import { NextFunction, Response } from "express";
import { validationResult } from "express-validator";
import createHttpError from "http-errors";
import { Logger } from "winston";
import { ToppingService } from "./topping-service";
import { CreateToppingRequest, Filter, Topping } from "./topping-types";
import { FileStorage } from "../common/types/storage";
import { v4 as uuidv4 } from "uuid";
import { UploadedFile } from "express-fileupload";
import { AuthRequest } from "../common/types";
import { MessageProducerBroker } from "../common/types/broker";

export class ToppingController {
    constructor(
        private toppingService: ToppingService,
        private logger: Logger,
        private storage: FileStorage,
        private broker: MessageProducerBroker,
    ) {}
    async create(req: CreateToppingRequest, res: Response, next: NextFunction) {
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

        const topping = {
            name: req.body.name,
            image: imageName,
            tenantId: req.body.tenantId,
            isPublish: req.body.isPublish,
            price: req.body.price,
        };
        const newTopping: Topping = await this.toppingService.create(topping);
        if (!newTopping) {
            return next(createHttpError(500, "Failed to create topping"));
        }
        await this.broker.sendMessages(
            "topping",
            JSON.stringify({
                _id: newTopping._id,
                price: newTopping.price,
                tenantId: newTopping.tenantId,
            }),
        );
        return res.json({ data: newTopping._id });
    }

    async update(req: CreateToppingRequest, res: Response, next: NextFunction) {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return next(createHttpError(400, result.array()[0].msg as string));
        }

        const { toppingId } = req.params;
        const fetchedTopping =
            await this.toppingService.getToppingById(toppingId);

        if (!fetchedTopping) {
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
        if (fetchedTopping.tenantId !== String(tennantId)) {
            return next(
                createHttpError(
                    403,
                    "You are not allowed to update this product",
                ),
            );
        }

        let imageName = "";
        const oldImage = fetchedTopping.image;
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

        const updateTopping = {
            name: req.body.name,
            image: imageName || oldImage,
            price: req.body.price,
            tenantId: req.body.tenantId,
            isPublish: req.body.isPublish,
        };

        const topping = await this.toppingService.update(
            toppingId,
            updateTopping,
        );
        await this.broker.sendMessages(
            "topping",
            JSON.stringify({
                _id: topping._id,
                price: topping.price,
                tenantId: topping.tenantId,
            }),
        );
        if (!topping) {
            return next(createHttpError(404, "Topping not found"));
        }
        return res.json({ id: topping._id });
    }

    async getAllToppings(req: CreateToppingRequest, res: Response) {
        const { q, tenantId, isPublish } = req.query;
        const filters: Filter = {};
        if (isPublish === "true") {
            filters.isPublish = true;
        }
        if (tenantId) {
            filters.tenantId = tenantId as string;
        }

        const paginateQuery = {
            page: req.query.page ? parseInt(req.query.page as string) : 1,
            limit: req.query.limit ? parseInt(req.query.limit as string) : 10,
        };

        const toppings = await this.toppingService.getAllToppings(
            q as string,
            filters,
            paginateQuery,
        );
        if (!Array.isArray(toppings.data)) {
            return res.json({
                data: [],
                total: 0,
                pageSize: 0,
                currentPage: 0,
            });
        }

        const finalToppings = toppings?.data?.map((product: Topping) => {
            return {
                ...product,
                image: this.storage.getObjectUrl(product.image),
            };
        });
        return res.json({
            data: finalToppings,
            total: toppings.total,
            pageSize: toppings.pageSize,
            currentPage: toppings.currentPage,
        });
    }

    async getTopping(req: CreateToppingRequest, res: Response) {
        const { toppingId } = req.params;
        const fetchedTopping =
            await this.toppingService.getToppingById(toppingId);
        return res.json({ data: fetchedTopping });
    }

    async delete(req: CreateToppingRequest, res: Response) {
        const { toppingId } = req.params;
        const deletedTopping =
            await this.toppingService.deleteToppingById(toppingId);
        return res.json({ data: deletedTopping?._id });
    }
}
