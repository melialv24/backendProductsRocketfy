
import { Request, Response } from 'express';
import { ProductUseCase } from '../../../application/useCases/products/products';

export class ProductController {
    constructor(private productUseCase: ProductUseCase){

    }

    public createCtrl = async ({body}: Request, res: Response) => {
        try {
            const { name, description, sku, urlImage, tags, price, stock } = body;

            const rest = await this.productUseCase.createProduct({ name, description, sku, urlImage, tags, price, stock })

            res.send(rest)
           
        } catch (error) {
            console.error("Error creando el producto:", error);
            return res.status(500).json({ error: "Un error ha ocurrido mientras se creaba el producto.", flag: false });
        }
    };

    public editCtrl = async ({body}: Request, res: Response) => {

        try {

            const { _id, ...updateData } = body; // Datos actualizados del producto desde el cuerpo de la solicitud
            
            const rest = await this.productUseCase.updateProduct( _id, updateData )

            res.send(rest)
        } catch (error) {
            console.error('Error:', error);
            return res.status(500).json({ message: 'Error en el servidor', flag: false });
        }
    };

    public deleteProductCtrl = async ({params}: Request, res: Response) => {
        try {
            const productId = params.id; // Obtener el ID del producto a eliminar

            const rest = await this.productUseCase.deleteProduct(productId)

            res.send(rest)
        } catch (error) {
            console.error("Error eliminando el producto:", error);
            return res.status(500).json({ error: "Un error ha ocurrido mientras se eliminaba el producto.", flag: false });
        }
    }

    public productsCtrl = async (req: Request, res: Response) => {
        try {
            
            const rest = await this.productUseCase.getAllProducts()

            res.send(rest)


        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    };

    public productsByParams = async ({body}: Request, res: Response) => {
        const { name, sku, tags, minPrice, maxPrice } = body;

        const rest = await this.productUseCase.findByParams({ name, sku, tags, minPrice, maxPrice })
        res.send(rest)
    }

    public productByIdCtrl = async ({params}: Request, res: Response) => {
        try {
            const productId = params.id; // Supongo que el ID se pasa como parámetro en la URL

            const rest = await this.productUseCase.getProductById(productId)

            res.send(rest)

        } catch (error) {
            console.error('Error:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    };

    public getCategoriesCtrl = async (req: Request, res: Response) => {

        try {

            const rest = await this.productUseCase.getCategories()

            res.send(rest)

        } catch (error) {
            console.error('Error:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

    }
}
