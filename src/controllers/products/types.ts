export interface ProductUpdate {
    name?: string
    description?: string
    sku?: string
    urlImage?: string
    tags?: string[]
    price?: number
    stock?: number
}

export interface FilterOptions {
    name?: { $regex: string; $options: string };
    sku?: string;
    tags?: { $in: string[] };
    price?: {
        $gte?: number;
        $lte?: number;
    };
}