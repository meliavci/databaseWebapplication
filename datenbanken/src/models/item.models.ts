export interface Item{
  id: number;
	name:string;
  category: string;
  description: string;
  status: string;
  borrowed_by?: number;
  date_loan?: string;
  date_return?: string;
  price: number;
  source?:string;
}
