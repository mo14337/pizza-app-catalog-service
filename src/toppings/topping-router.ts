import express from "express";
import authenticate from "../common/middlewares/authenticate";
import { canAccess } from "../common/middlewares/canAccess";
import { Roles } from "../common/constants";
import productValidator from "./topping-validator";
import { ToppingService } from "./topping-service";
import logger from "../config/logger";
import fileUpload from "express-fileupload";
import { asyncWraper } from "../common/utils/asyncWrapper";
import { S3Storage } from "../common/services/S3Storage";
import createHttpError from "http-errors";
import updateProductValidator from "./updateToppingValidator";
import { ToppingController } from "./topping-controller";
import { createMessageProducerBroker } from "../common/factories/brokerFactory";

const router = express.Router();

const toppingService = new ToppingService();
const s3Storage = new S3Storage();
const messageProducerBroker = createMessageProducerBroker();
const toppingController = new ToppingController(
    toppingService,
    logger,
    s3Storage,
    messageProducerBroker,
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
    asyncWraper(toppingController.create.bind(toppingController)),
);

router.put(
    "/:toppingId",
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
    updateProductValidator,
    asyncWraper(toppingController.update.bind(toppingController)),
);

router.get(
    "/",
    asyncWraper(toppingController.getAllToppings.bind(toppingController)),
);

router.get(
    "/:productId",
    asyncWraper(toppingController.getTopping.bind(toppingController)),
);

router.delete(
    "/:productId",
    authenticate,
    canAccess([Roles.ADMIN, Roles.MANAGER]),
    asyncWraper(toppingController.delete.bind(toppingController)),
);

export default router;
