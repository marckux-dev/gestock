import {Product} from '../../products/interfaces/product.interface';

export interface Stock {
  id: string;
  product: Product;
  maximum_storage: number;
  current_storage: number;
  stock_order: number;
  stock_category: string;
}
