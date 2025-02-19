export interface Product {
  id: string;
  name: string;
  short_name: string;
  category: string;
  is_active?: boolean;
  active_principle?: string;
  synonyms?: string;
  search_vector?: string;
}
