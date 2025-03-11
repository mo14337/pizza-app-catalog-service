import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import createHttpError from "http-errors";
import { ICategory } from "./category-types";
import { CategoryService } from "./category-service";
import { Logger } from "winston";
import { Types } from "mongoose";

export class CategoryController {
    constructor(
        private categoryService: CategoryService,
        private logger: Logger,
    ) {}

    async create(req: Request, res: Response, next: NextFunction) {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return next(createHttpError(400, result.array()[0].msg as string));
        }

        const { name, priceConfiguration, attributes, hasToppings } =
            req.body as ICategory;

        const category = await this.categoryService.create({
            name,
            priceConfiguration,
            attributes,
            hasToppings,
        });

        this.logger.info("Created category", { id: category._id });
        res.json({ id: category._id });
    }

    async update(req: Request, res: Response, next: NextFunction) {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return next(createHttpError(400, result.array()[0].msg as string));
        }

        const categoryId = req.params.id;

        if (!Types.ObjectId.isValid(categoryId)) {
            return next(createHttpError(400, "Invalid category ID"));
        }

        const { name, priceConfiguration, attributes, hasToppings } =
            req.body as ICategory;

        const category = await this.categoryService.update(categoryId, {
            name,
            priceConfiguration,
            attributes,
            hasToppings,
        });

        if (!category) {
            return next(createHttpError(404, "Category not found"));
        }

        this.logger.info("Updated category", { id: category._id });
        res.json({ data: category });
    }

    async getCategory(req: Request, res: Response, next: NextFunction) {
        const categoryId = req.params.id;

        if (!Types.ObjectId.isValid(categoryId)) {
            return next(createHttpError(400, "Invalid category ID"));
        }

        const category = await this.categoryService.getCategoryById(categoryId);
        if (!category) {
            return next(createHttpError(404, "Category not found"));
        }

        res.json({ data: category });
    }
    async getAllCatgeory(req: Request, res: Response) {
        const categories = await this.categoryService.getAllCatgeory();
        res.json({ data: categories });
    }
    async deleteCategory(req: Request, res: Response, next: NextFunction) {
        const categoryId = req.params.id;

        if (!Types.ObjectId.isValid(categoryId)) {
            return next(createHttpError(400, "Invalid category ID"));
        }

        const category = await this.categoryService.deleteCategory(categoryId);
        if (!category) {
            return next(createHttpError(404, "Category not found"));
        }

        this.logger.info("Created category", { id: category._id });
        res.json({ data: category });
    }
}
