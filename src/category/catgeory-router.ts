import express from "express";
import { CategoryController } from "./category-controller";
import categoryValidator from "./category-validator";
import { CategoryService } from "./category-service";
import logger from "../config/logger";
import { asyncWraper } from "../common/utils/asyncWrapper";
import authenticate from "../common/middlewares/authenticate";
const router = express.Router();

const catgeoryService = new CategoryService();
const categoryController = new CategoryController(catgeoryService, logger);

router.post(
    "/",
    authenticate,
    categoryValidator,
    asyncWraper(categoryController.create.bind(categoryController)),
);

export default router;
