import { ProductEntity } from "../../entities";
import { v4 as uuidv4 } from 'uuid';

export class ProductValue implements ProductEntity{

    _id: string;
    name: string;
    description: string;
    sku: string;
    urlImage: string;
    tags: string[];
    price: number;
    stock: number;

    constructor({ 
        _id,
        name,
        description,
        sku,
        urlImage,
        tags,
        price,
        stock 
    }: ProductEntity){
        this._id = _id || uuidv4()
        this.name = name 
        this.description = description || ''
        this.sku = sku
        this.urlImage = urlImage || ''
        this.tags = tags || []
        this.price = price
        this.stock = stock
    }
}