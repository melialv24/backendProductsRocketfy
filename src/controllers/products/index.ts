
import { db }  from '../../database'
import { Request, Response } from 'express';
import { FilterOptions, ProductUpdate } from './types';
import { ObjectId } from 'mongodb';

const create = async (req: Request, res: Response) => {
    try {
        const { name, description, sku, urlImage, tags, price, stock } = req.body;

        // Referencia a la colección
        const productsCollection = db.collection('productsDesc');

        // Eliminar espacios en blanco al inicio y al final del nombre
        const cleanedName = name.trim();

        // Verificar si ya existe un producto con el mismo nombre (sin considerar espacios)
        const existingProduct = await productsCollection.findOne({ sku });
        
        if (existingProduct) {
            return res.status(400).json({ error: `Ya existe un producto con el sku establecido ${sku}.` });
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
            return res.status(201).json({ message: "Producto creado de manera satisfactoria.", flag: true });
        } else {
            return res.status(500).json({ error: "Ha ocurrido un error en el servidor.", flag: false });
        }
    } catch (error) {
        console.error("Error creando el producto:", error);
        return res.status(500).json({ error: "Un error ha ocurrido mientras se creaba el producto.", flag: false });
    }
};

const edit = async (req: Request, res: Response) => {

    try {

        const {_id, ...updateData} = req.body; // Datos actualizados del producto desde el cuerpo de la solicitud
        const transform = new ObjectId(_id)
        
        // Obtener una referencia a la colección de productos
        const productsCollection = db.collection('productsDesc');
        const historyProductsCollection = db.collection('historyProducts');


        // Buscar el producto por su ID y obtener el producto actual
        const existingProduct = await productsCollection.findOne({ _id: transform });

        if (!existingProduct) {
            return res.status(404).json({ message: 'Producto no encontrado' });
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
                updatedFields[key] = updateData[key];
            }
        }

        // Actualizar el producto con los nuevos datos
        const updatedProduct = { ...existingProduct, ...updateData };
        await productsCollection.updateOne({ _id: transform }, { $set: updatedProduct });

        // Registrar el cambio en el historial de cambios
        const changeEntry = {
            product_id: _id,
            date: new Date(),
            new_price: updateData.precio || existingProduct.precio,
            new_stock: updateData.stock || existingProduct.stock
        };

        await historyProductsCollection.insertOne(changeEntry);


        return res.status(200).json({ message: 'Producto actualizado exitosamente', flag: true });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ message: 'Error en el servidor', flag: false });
    }
};

const deleteProduct = async (req: Request, res: Response) => {
    try {
        const productId = req.params.id; // Obtener el ID del producto a eliminar

        // Referencia a la colección
        const productsCollection = db.collection('productsDesc');

        // Verificar si el producto existe
        const existingProduct = await productsCollection.findOne({ _id: new ObjectId(productId) });

        if (!existingProduct) {
            return res.status(404).json({ error: `No se encontró el producto con el ID ${productId}.` });
        }

        // Eliminar el producto
        const result = await productsCollection.deleteOne({ _id: new ObjectId(productId) });

        if (result.deletedCount === 1) {
            return res.status(200).json({ message: "Producto eliminado de manera satisfactoria.", flag: true });
        } else {
            return res.status(500).json({ error: "No se pudo eliminar el producto.", flag: false });
        }
    } catch (error) {
        console.error("Error eliminando el producto:", error);
        return res.status(500).json({ error: "Un error ha ocurrido mientras se eliminaba el producto.", flag: false });
    }
}

const products = async (req: Request, res: Response) => {
    try {
        const { filterState, name, sku, tags, minPrice, maxPrice } = req.body;

        // Obtener una referencia a la colección de productos
        const productsCollection = db.collection('productsDesc');

        if (filterState){
            // Construir el filtro para la consulta
            const filter: FilterOptions = {}; // Usar "any" para ser más flexible con los filtros

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

            return res.status(200).json({ message: 'Productos hallado de manera exitosa', data: productList });
        }

        // Realizar la consulta a la base de datos
        const productList = await productsCollection.find({}, {projection: { description: 0,  tags:0, stock: 0 } }).toArray();

        return res.status(200).json({ message: 'Productos hallado de manera exitosa', data: productList });
        


    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const productById = async (req: Request, res: Response) => {
    try {
        const productId = req.params.id; // Supongo que el ID se pasa como parámetro en la URL

        // Obtener una referencia a la colección de productos
        const productsCollection = db.collection('productsDesc');

        // Buscar el producto por ID
        const product = await productsCollection.findOne({ _id: new ObjectId(productId) });

        if (product) {
            return res.status(200).json({ message: 'Producto encontrado exitosamente', data: product });
        } else {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

const getCategories = async (req: Request, res: Response) =>{

    try {
        
        const productsCollection = db.collection('productsDesc');

        const data = await productsCollection.distinct("tags")

        if (data) {
            return res.status(200).json({ message: 'Categorías cargadas exitosamente', data });
        } else {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }


    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }

}


export default {
    create,
    edit,
    products,
    productById,
    getCategories,
    deleteProduct

};