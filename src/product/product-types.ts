import { Request } from "express";

interface priceConfiguration {
    priceType: string;
    availableOptions: Map<string, number>;
}

export interface Product {
    name: string;
    description: string;
    image: string;
    priceConfiguration: Map<string, priceConfiguration>;
    attributes: {
        name: string;
        value: string | number;
    }[];
    tenantId: string;
    categoryId: string;
    isPublish: boolean;
}

export interface CreateProductRequest extends Request {
    body: Product;
}
