export interface RentalOrder {
	id: number;
	user_id: number;
	order_date: string;
	total_amount: number;
	status: 'ongoing' | 'completed';
}
