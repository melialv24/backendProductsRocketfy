import { ProductEntity } from "../../entities/index"
import { ParamsProducts, ProductUpdate, ResponseP } from "../../interfaces";

export interface ProductRepository {
    createProduct(productData: ProductEntity): Promise<ResponseP<string>>;
    updateProduct(_id: string, updateData: Partial<ProductEntity>): Promise<ResponseP<string>>;
    deleteProduct(productId: string): Promise<ResponseP<string>>;
    getProductById(_id: string): Promise<ResponseP<ProductUpdate>>;
    getAllProducts(): Promise<ResponseP<ProductUpdate[]>>;
    findByParams(params: Partial<ParamsProducts>): Promise<ResponseP<ProductUpdate[]>>;
    getCategories(): Promise<ResponseP<string[]>>;
}