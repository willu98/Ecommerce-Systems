import { Product        } from '../models/product.model';

export interface CartItem {
    id:  string;
    qty: number;
    product?: Product;
}