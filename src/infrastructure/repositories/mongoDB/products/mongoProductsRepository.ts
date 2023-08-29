import { ObjectId } from "mongodb";
import { ProductEntity } from "../../../../domain/entities";
import { FilterOptions, ParamsProducts, ProductUpdate, ResponseP } from "../../../../domain/interfaces";
import { ProductRepository } from "../../../../domain/repositories";
import { collectionHistoryProduct, collectionProduct } from "../../../collections";

export class MongoProductRepository implements ProductRepository {

    public createProduct = async ({ name, description, sku, urlImage, tags, price, stock }: ProductEntity): Promise<ResponseP<string>> => {
        try {

            // Referencia a la colección
            const productsCollection = await collectionProduct()

            // Eliminar espacios en blanco al inicio y al final del nombre
            const cleanedName = name.trim();

            // Verificar si ya existe un producto con el mismo nombre (sin considerar espacios)
            const existingProduct = await productsCollection.findOne({ sku });

            if (existingProduct) {
                return { status: 400, message: `Ya existe un producto con el sku establecido ${sku}.`, flag: false }
            }

            // Crear el nuevo producto
            const newProduct = {
                name: cleanedName,
                description,
                sku,
                urlImage,
                tags,
                price,
                stock,
            };

            // Insertar el nuevo producto en la base de datos
            const result = await productsCollection.insertOne(newProduct);

            if (result) {
                return { message: "Producto creado de manera satisfactoria.", status: 200, flag: true }
            } else {
                return { message: "Ha ocurrido un error en el servidor.", status: 500, flag: false }
                
            }
        } catch (error) {
            return { message: "Un error ha ocurrido mientras se creaba el producto.", status: 500, flag: false }
           
        }
    };

    public updateProduct = async (_id: string, updateData: Partial<ProductEntity>): Promise<ResponseP<string>> => {

        try {
            const transform = new ObjectId(_id)

            // Obtener una referencia a la colección de productos
            const productsCollection = await collectionProduct()
            const historyProductsCollection = await collectionHistoryProduct()


            // Buscar el producto por su ID y obtener el producto actual
            const existingProduct = await productsCollection.findOne({ _id: transform });

            if (!existingProduct) {
                return { status: 400, message: 'Producto no encontrado', flag: false }
            }

            // Crear un objeto con los campos actualizados del producto
            const updatedFields: ProductUpdate = {};

            // Iterar a través de las claves en updateData y agregarlas al objeto de campos actualizados
            for (const key in updateData) {
                if (key in updateData && (
                    key === 'name'
                    || key === 'description'
                    || key === 'sku'
                    || key === 'urlImage'
                    || key === 'tags'
                    || key === 'price'
                    || key === 'stock'
                )) {
                    updatedFields[key] = updateData[key] as ProductEntity[typeof key];
                }
            }

            // Actualizar el producto con los nuevos datos
            const updatedProduct = { ...existingProduct, ...updateData };
            await productsCollection.updateOne({ _id: transform }, { $set: updatedProduct });

            // Registrar el cambio en el historial de cambios
            const changeEntry = {
                product_id: _id,
                date: new Date(),
                new_price: updateData.price || existingProduct.price,
                new_stock: updateData.stock || existingProduct.stock
            };

            await historyProductsCollection.insertOne(changeEntry);


            return { status: 200, message: 'Producto actualizado exitosamente', flag: true }
        } catch (error) {
            console.error('Error:', error);
            return { message: 'Error en el servidor', flag: false, status: 500 }
        }
    };

    public deleteProduct = async (productId: string): Promise<ResponseP<string>> => {
        try {

            // Referencia a la colección
            // Obtener una referencia a la colección de productos
            const productsCollection = await collectionProduct()

            // Verificar si el producto existe
            const existingProduct = await productsCollection.findOne({ _id: new ObjectId(productId) });

            if (!existingProduct) {
                return { status: 400, message: `No se encontró el producto con el ID ${productId}.`, flag: false }
            }

            // Eliminar el producto
            const result = await productsCollection.deleteOne({ _id: new ObjectId(productId) });

            if (result.deletedCount === 1) {
                return { status: 200, message: 'Producto eliminado de manera satisfactoria.', flag: true }
            } else {
                return { status: 500, message: 'No se pudo eliminar el producto.', flag: false }
            }
        } catch (error) {
            console.error("Error eliminando el producto:", error);
            return { status: 500, message: 'Un error ha ocurrido mientras se eliminaba el producto.', flag: false }
        }
    }

    public getAllProducts = async (): Promise<ResponseP<ProductUpdate[]>> => {
        try {

            // Referencia a la colección
            const productsCollection = await collectionProduct()

            // Realizar la consulta a la base de datos
            const productList = await productsCollection.find({}, { projection: { description: 0, tags: 0, stock: 0 } }).toArray();


            return { status: 200, data: productList as ProductUpdate[], message: 'Productos hallados de manera exitosa', flag: true }

        } catch (error) {
            console.error('Error:', error);
            return { status: 500, flag: false, message: 'Ha ocurrido un error en el servidor' }
        }
    };

    public getProductById = async (_id: string): Promise<ResponseP<ProductUpdate>> => {
        try {

            // Obtener una referencia a la colección de productos
            // Referencia a la colección
            const productsCollection = await collectionProduct()

            // Buscar el producto por ID
            const product = await productsCollection.findOne({ _id: new ObjectId(_id) });

            if (product) {
                return { flag: true, data: product as ProductUpdate, status: 200, message: 'Producto encontrado de manera exitosa' }
            } else {
                return { flag: false, message: 'Producto no encontrado', status: 400 }
            }

        } catch (error) {
            console.error('Error:', error);
            return { flag: false, message: 'Internal Server Error', status: 500 }
        }
    };

    public findByParams = async ({ name, sku, tags, minPrice, maxPrice }: Partial<ParamsProducts>): Promise<ResponseP<ProductUpdate[]>> => {
        try {

            // Referencia a la colección
            const productsCollection = await collectionProduct()

                // Construir el filtro para la consulta
                const filter: FilterOptions = {};

                if (name) {
                    filter.name = { $regex: name as string, $options: 'i' }; // Búsqueda por nombre, insensible a mayúsculas
                }

                if (sku) {
                    filter.sku = sku as string;
                }

                if (tags && Array.isArray(tags) && tags.length > 0 && !!tags[0]) {
                    filter.tags = { $in: tags as string[] };
                }

                if (minPrice || maxPrice) {
                    filter.price = {};
                    if (minPrice && typeof minPrice === 'number' && minPrice !== 0) {
                        filter.price.$gte = minPrice;
                    }
                    if (maxPrice && typeof maxPrice === 'number' && maxPrice !== 0) {
                        filter.price.$lte = maxPrice;
                    }
                }


                // Realizar la consulta a la base de datos
                const productList = await productsCollection.find(filter, { projection: { description: 0, tags: 0, stock: 0 } }).toArray();

            return { flag: true, message: 'Productos encontrados con éxito', status: 200, data: productList as ProductUpdate[] }

            
        } catch (error) {
            console.error('Error:', error);
            return { flag: false, message: 'Internal Server Error', status: 500 }
        }
    }

    public getCategories = async (): Promise<ResponseP<string[]>> => {

        try {
            const productsCollection = await collectionProduct()

            const data: string[] = await productsCollection.distinct("tags")
            console.log({data})

            if (data.length > 0) {
                return { flag: true, data, message: 'categorías hallada de manera exitosa', status: 200}
            } else {
                return { flag: false, message: 'Producto no encontrado', status: 400 }
            }
        } catch (error) {
            console.error('Error:', error);
            return { flag: false, message: 'Internal Server Error', status: 500 }
        }

    }
}
