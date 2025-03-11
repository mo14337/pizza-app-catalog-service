import { AggregatePaginateResult } from "mongoose";
import productModal from "./product-modal";
import { Filter, PaginateQuery, Product } from "./product-types";
import { paginationLables } from "../config/pagination";

export class ProductService {
    async create(product: Product): Promise<Product> {
        //create product
        return (await productModal.create(product)) as Product;
    }
    async update(id: string, product: Product) {
        //update product
        return (await productModal
            .findByIdAndUpdate(id, product, { new: true })
            .exec()) as Product;
    }
    async getProductById(id: string): Promise<Product | null> {
        //get product
        return (await productModal.findById(id)) as Product;
    }

    async deleteProductById(id: string): Promise<Product | null> {
        //delete product
        return (await productModal.findByIdAndDelete(id, {
            new: true,
        })) as Product;
    }
    async getAllProducts(
        q: string,
        filters: Filter,
        paginateQuery: PaginateQuery,
    ): Promise<AggregatePaginateResult<Product>> {
        const searchQyeryRegex = new RegExp(q || "", "i");
        const matchQuery = {
            ...filters,
            name: searchQyeryRegex,
        };
        const aggregate = productModal.aggregate([
            {
                $match: matchQuery,
            },
            {
                $lookup: {
                    from: "categories",
                    localField: "categoryId",
                    foreignField: "_id",
                    as: "category",
                    pipeline: [
                        {
                            $project: {
                                _id: 1,
                                name: 1,
                                priceConfiguration: 1,
                                attributes: 1,
                                hasToppings: 1,
                            },
                        },
                    ],
                },
            },
            {
                $unwind: "$category",
            },
        ]);
        return await productModal.aggregatePaginate(aggregate, {
            ...paginateQuery,
            customLabels: paginationLables,
        });
    }
}
