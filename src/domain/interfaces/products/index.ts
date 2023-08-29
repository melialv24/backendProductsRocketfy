

export interface ParamsProducts {
    name: string,
    sku: string,
    tags: string[],
    minPrice: number,
    maxPrice: number
}

export interface ResponseP<T> {
    flag: boolean,
    data?: T,
    status: number
    message: string
}

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