import express from "express";
import { CategoryController } from "./category-controller";
import categoryValidator from "./category-validator";
import { CategoryService } from "./category-service";
import logger from "../config/logger";
import { asyncWraper } from "../common/utils/asyncWrapper";
import authenticate from "../common/middlewares/authenticate";
import { canAccess } from "../common/middlewares/canAccess";
import { Roles } from "../common/constants";
const router = express.Router();

const catgeoryService = new CategoryService();
const categoryController = new CategoryController(catgeoryService, logger);

router.post(
    "/",
    authenticate,
    canAccess([Roles.ADMIN]),
    categoryValidator,
    asyncWraper(categoryController.create.bind(categoryController)),
);
router.patch(
    "/:id",
    authenticate,
    canAccess([Roles.ADMIN]),
    categoryValidator,
    asyncWraper(categoryController.update.bind(categoryController)),
);
router.delete(
    "/:id",
    authenticate,
    canAccess([Roles.ADMIN]),
    categoryValidator,
    asyncWraper(categoryController.deleteCategory.bind(categoryController)),
);
router.get(
    "/:id",
    authenticate,
    canAccess([Roles.ADMIN]),
    categoryValidator,
    asyncWraper(categoryController.getCategory.bind(categoryController)),
);
router.get(
    "/",
    authenticate,
    canAccess([Roles.ADMIN]),
    categoryValidator,
    asyncWraper(categoryController.getAllCatgeory.bind(categoryController)),
);

export default router;
