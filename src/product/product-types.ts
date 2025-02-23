import { Request } from "express";
import mongoose from "mongoose";

interface priceConfiguration {
    priceType: string;
    availableOptions: Map<string, number>;
}

export interface Product {
    _id?: mongoose.Types.ObjectId;
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

export interface Filter {
    tenantId?: string;
    categoryId?: mongoose.Types.ObjectId;
    isPublish?: boolean;
}

export interface PaginateQuery {
    page: number;
    limit: number;
}
