import { body } from "express-validator";

export default [
    body("name")
        .exists()
        .withMessage("Product name is required")
        .isString()
        .withMessage("Product name should be an string"),
    body("description")
        .exists()
        .withMessage("Product description is required")
        .isString()
        .withMessage("Product description should be an string"),
    body("image").custom((value, { req }) => {
        if (!req.files) throw new Error("Image is required");
        return true;
    }),
    body("priceConfiguration")
        .exists()
        .withMessage("Price configuration is required"),
    body("attributes").exists().withMessage("Attributes is required"),
    body("tenantId")
        .exists()
        .withMessage("Tenant ID is required")
        .isNumeric()
        .withMessage("Tenant ID should be a number"),
    body("categoryId")
        .exists()
        .withMessage("Category ID is required")
        .isMongoId()
        .withMessage("Category ID should be a valid Mongo ID"),
];
