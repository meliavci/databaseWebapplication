export interface Payment{
  id: number;
  order_id: number;
  total_amount: number;
  currency: string;
  method: string;
  status: string;
  transaction_id: string; //???? Doppelt gemoppelt?
  paid_at: string;
}
