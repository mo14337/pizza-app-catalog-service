import productModal from "./product-modal";
import { Product } from "./product-types";

export class ProductService {
    async create(product: Product) {
        //create product
        return await productModal.create(product);
    }
    async update(id: string, product: Product) {
        //update product
        return await productModal
            .findByIdAndUpdate(id, product, { new: true })
            .exec();
    }
    async getProductById(id: string): Promise<Product | null> {
        //find product
        return await productModal.findById(id);
    }
}
