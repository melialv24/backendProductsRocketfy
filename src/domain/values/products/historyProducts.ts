import { HistoryProductEntity } from "../../entities";


export class HistoryProductValue implements HistoryProductEntity {

    _id: string;
    product_id: string;
    date: Date;
    new_price: number;
    new_stock: number;

    constructor({
        _id,
        product_id,
        date,
        new_price,
        new_stock,
    }: HistoryProductEntity) {
        this._id = _id
        this.product_id = product_id
        this.date = date
        this.new_price = new_price
        this.new_stock = new_stock
    }
}