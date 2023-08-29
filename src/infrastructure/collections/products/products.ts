
import { db } from "../../database";

export const collectionProduct = async () => {
    try {
        const productsCollection = await db.collection('productsDesc');
        return productsCollection
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        throw error; // Relanzar el error para manejarlo en el contexto superior
    }
};