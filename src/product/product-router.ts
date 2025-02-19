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

const router = express.Router();

const productService = new ProductService();
const productController = new ProductController(productService, logger);

router.post(
    "/",
    authenticate,
    canAccess([Roles.ADMIN, Roles.MANAGER]),
    fileUpload(),
    productValidator,
    asyncWraper(productController.create.bind(productController)),
);

export default router;
