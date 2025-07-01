export interface Artikel{
  id: number;
  category: string;
  description: string;
  status: string;
  borrowed_by?: number;
  date_loan?: string;
  date_return?: string;
  price: number;
}
