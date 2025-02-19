import express from "express";
import authenticate from "../common/middlewares/authenticate";
import { ProductController } from "./product-controller";
import { canAccess } from "../common/middlewares/canAccess";
import { Roles } from "../common/constants";
import productValidator from "./product-validator";

const router = express.Router();

const productController = new ProductController();

router.post(
    "/",
    authenticate,
    canAccess([Roles.ADMIN, Roles.MANAGER]),
    productValidator,
    productController.create.bind(productController),
);

export default router;
