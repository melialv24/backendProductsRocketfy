import { MongoClient, Db } from "mongodb";

const uri = process.env.MONGO_CNN; // URL de conexión adecuada

let db: Db; // Variable para almacenar la referencia a la base de datos

export const connectDB = async () => {
    try {
        const client = new MongoClient(uri!);

        await client.connect();
        console.log("Connected to MongoDB");

        db = client.db("products"); // Asignar la referencia de la base de datos

        const productsCollection = db.collection('productsDesc');
        
        // Crear un índice en el campo "name" para búsqueda de texto completo
        await productsCollection.createIndex({ name: "text" });

        // Crear un índice en el campo "sku"
        await productsCollection.createIndex({ sku: 1 });

        // Crear un índice en el campo "sku"
        await productsCollection.createIndex({ tags: 1 });

        // Crear un índice en el campo "sku"
        await productsCollection.createIndex({ price: 1 });

        return db; // devolver la referencia de la base de datos
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        throw error; // Relanzar el error para manejarlo en el contexto superior
    }
};

// Exportar la referencia de la base de datos
export { db };