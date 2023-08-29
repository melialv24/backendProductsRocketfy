export interface ProductEntity {
    _id?: string;
    name: string;
    description?: string;
    sku: string;
    urlImage?: string;
    tags?: string[];
    price: number;
    stock: number;
}