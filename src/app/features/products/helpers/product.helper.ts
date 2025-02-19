import {Product} from '../interfaces/product.interface';

export interface CategorizedProducts {
  [key: string]: Product[]
}

export const categorizeProducts = (products: Product[]): CategorizedProducts => (
  products.reduce((acc, product) => {
    if (!acc[product.category]) acc[product.category] = [];
    acc[product.category].push(product);
    return acc;
  }, {} as CategorizedProducts)
);
