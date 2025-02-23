import { body } from "express-validator";

export default [
    body("name")
        .exists()
        .withMessage("Product name is required")
        .isString()
        .withMessage("Product name should be an string"),
    body("image").custom((value, { req }) => {
        if (!req.files) throw new Error("Image is required");
        return true;
    }),
    body("price")
        .exists()
        .withMessage("Price is required")
        .isNumeric()
        .withMessage("Price should be a number"),
    body("tenantId")
        .exists()
        .withMessage("Tenant ID is required")
        .isString()
        .withMessage("Tenant ID should be an string"),
];
