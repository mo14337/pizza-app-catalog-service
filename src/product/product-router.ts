import express from "express";
import authenticate from "../common/middlewares/authenticate";
import { ProductController } from "./product-controller";
import { canAccess } from "../common/middlewares/canAccess";
import { Roles } from "../common/constants";
import productValidator from "./product-validator";
import { ProductService } from "./product-service";
import logger from "../config/logger";
import fileUpload from "express-fileupload";
import { asyncWraper } from "../common/utils/asyncWrapper";
import { S3Storage } from "../common/services/S3Storage";
import createHttpError from "http-errors";

const router = express.Router();

const productService = new ProductService();
const s3Storage = new S3Storage();
const productController = new ProductController(
    productService,
    logger,
    s3Storage,
);

router.post(
    "/",
    authenticate,
    canAccess([Roles.ADMIN, Roles.MANAGER]),
    fileUpload({
        limits: { fileSize: 500 * 1024 },
        abortOnLimit: true,
        limitHandler: (req, res, next) => {
            const error = createHttpError(400, "File size exceeds limit");
            next(error);
        },
    }),
    productValidator,
    asyncWraper(productController.create.bind(productController)),
);

export default router;
