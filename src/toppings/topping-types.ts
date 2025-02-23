import { Request } from "express";
import mongoose from "mongoose";

export interface Topping {
    _id?: mongoose.Types.ObjectId;
    name: string;
    image: string;
    price: number;
    tenantId: string;
    isPublish: boolean;
}

export interface CreateToppingRequest extends Request {
    body: Topping;
}

export interface Filter {
    tenantId?: string;
    isPublish?: boolean;
}

export interface PaginateQuery {
    page: number;
    limit: number;
}
