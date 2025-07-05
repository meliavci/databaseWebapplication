export interface Payment{
  id: number;
  order_id: number;
  amount: number;
  method: string;
	status: 'pending' | 'completed' | 'failed';
  transaction_id: string;
  paid_at: string;
}
