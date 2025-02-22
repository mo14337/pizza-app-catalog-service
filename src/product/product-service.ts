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
    async findById(id: string) {
        //find product
        return await productModal.findById(id);
    }
    async getProductImage(id: string) {
        //find product
        const product = await productModal.findById(id);
        return product?.image;
    }
}
