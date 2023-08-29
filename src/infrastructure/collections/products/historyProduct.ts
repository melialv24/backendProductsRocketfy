import { db } from "../../database";

export const collectionHistoryProduct = async () => {
    try {
        const historyProductsCollection = await db.collection('historyProducts');
        return historyProductsCollection
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        throw error; // Relanzar el error para manejarlo en el contexto superior
    }
};