import { ProductEntity } from "../../../domain/entities";
import { ParamsProducts } from "../../../domain/interfaces";
import { ProductRepository } from "../../../domain/repositories";


export class ProductUseCase {
    constructor(private readonly productRepository: ProductRepository){}

    public createProduct = async (productData: ProductEntity) => {
        try {
            const result = await this.productRepository.createProduct(productData);

            if (!result?.flag) {
                return { message: result?.message , flag: false };
            }

            return { message: result.message, flag: true };
        } catch (error) {
            console.error('Error creando el producto:', error);
            return { error: 'Un error ha ocurrido mientras se creaba el producto.', flag: false };
        }
    };

    public updateProduct = async (_id: string, updateData: Partial<ProductEntity>) => {
        try {
            const result = await this.productRepository.updateProduct(_id, updateData);

            if (!result.flag) {
                return { message: result.message, flag: false };
            }

            return { message: result.message, flag: true };
        } catch (error) {
            console.error('Error:', error);
            return { message: 'Error en el servidor', flag: false };
        }
    };

    public deleteProduct = async (productId: string) => {
        try {
            const result = await this.productRepository.deleteProduct(productId);

            if (!result.flag) {
                return { message: result.message, flag: false };
            }

            return { message: result.message, flag: true };
        } catch (error) {
            console.error('Error eliminando el producto:', error);
            return { error: 'Un error ha ocurrido mientras se eliminaba el producto.', flag: false };
        }
    };

    public getAllProducts = async () => {
        try {
            const result = await this.productRepository.getAllProducts();

            if (!result.flag) {
                return { error: result.message, flag: false };
            }

            return { message: result.message, data: result.data, flag: true };
        } catch (error) {
            console.error('Error:', error);
            return { error: 'Internal Server Error', flag: false };
        }
    };

    public getProductById = async (productId: string) => {
        try {
            const result = await this.productRepository.getProductById(productId);

            if (!result.flag) {
                return { error: result.message, flag: false };
            }

            return { message: result.message, data: result.data, flag: true };
        } catch (error) {
            console.error('Error:', error);
            return { error: 'Internal Server Error', flag: false };
        }
    };

    public findByParams = async (params: Partial<ParamsProducts>) => {
        try {
            const result = await this.productRepository.findByParams(params);

            if (!result.flag) {
                return { error: result.message, flag: false };
            }

            return { message: result.message, data: result.data, flag: true };
        } catch (error) {
            console.error('Error:', error);
            return { error: 'Internal Server Error', flag: false };
        }
    };

    public getCategories = async () => {
        try {
            const result = await this.productRepository.getCategories();

            if (!result.flag) {
                return { error: result.message, flag: false };
            }

            return { message: result.message, data: result.data, flag: true };
        } catch (error) {
            console.error('Error:', error);
            return { error: 'Internal Server Error', flag: false };
        }
    }; 
}