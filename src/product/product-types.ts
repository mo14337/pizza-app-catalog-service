import { Request } from "express";

export interface Product {
    name: string;
    description: string;
    image: string;
    priceConfiguration: {
        priceType: string;
        availableOptions: Map<string, number>;
    };
    attributes: {
        name: string;
        value: string | number;
    }[];
    tenantId: number;
    categoryId: string;
    isPublish: boolean;
}

export interface CreateProductRequest extends Request {
    body: Product;
}
