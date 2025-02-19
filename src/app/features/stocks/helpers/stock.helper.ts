import {Stock} from '../interfaces/stock.interface';


export interface CategorizedStocks {
  [key: string]: Stock[]
}

export const categorizeStocks: (s:Stock[]) => CategorizedStocks =
  (stocks: Stock[]): CategorizedStocks => (
    stocks.reduce(
      (acc: CategorizedStocks, stock: Stock): CategorizedStocks => {
        const category: string = stock.product.category;
        if (!acc[category]) acc[category] = [];
        acc[category].push(stock);
        return acc;
      }, {} as CategorizedStocks
    )
  );
