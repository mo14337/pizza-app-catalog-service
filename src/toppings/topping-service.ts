import { AggregatePaginateResult } from "mongoose";
import toppingModal from "./topping-modal";
import { Filter, PaginateQuery, Topping } from "./topping-types";
import { paginationLables } from "../config/pagination";

export class ToppingService {
    async create(product: Topping): Promise<Topping> {
        //create product
        return (await toppingModal.create(product)) as Topping;
    }
    async update(id: string, product: Topping) {
        //update product
        return (await toppingModal
            .findByIdAndUpdate(id, product, { new: true })
            .exec()) as Topping;
    }
    async getToppingById(id: string): Promise<Topping | null> {
        //get product
        return (await toppingModal.findById(id)) as Topping;
    }

    async deleteToppingById(id: string): Promise<Topping | null> {
        //get product
        return (await toppingModal.findByIdAndDelete(id, {
            new: true,
        })) as Topping;
    }
    async getAllToppings(
        q: string,
        filters: Filter,
        paginateQuery: PaginateQuery,
    ): Promise<AggregatePaginateResult<Topping>> {
        const searchQyeryRegex = new RegExp(q || "", "i");
        const matchQuery = {
            ...filters,
            name: searchQyeryRegex,
        };
        const aggregate = toppingModal.aggregate([
            {
                $match: matchQuery,
            },
        ]);
        return await toppingModal.aggregatePaginate(aggregate, {
            ...paginateQuery,
            customLabels: paginationLables,
        });
    }
}
