import { body } from "express-validator";

export default [
    body("name")
        .exists()
        .withMessage("Category name is required")
        .isString()
        .withMessage("Category name should be an string"),
    body("priceConfiguration")
        .exists()
        .withMessage("Price configuration is reuiqred"),
    body("priceConfiguration.*.priceType")
        .exists()
        .withMessage("Price type is required")
        .custom((value: string) => {
            const validKeys = ["base", "aditional"];
            if (!validKeys.includes(value)) {
                throw new Error(
                    `${value} is invalid attribute for priceType filed.`,
                );
            }
            return true;
        }),
    body("attributes").exists().withMessage("Attributes is required"),
];
