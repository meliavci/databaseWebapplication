export interface RentalOrder_Item {
	id: number;
	order_id: number;
	inventory_item_id: number;
	product_id: number;
	price: number;
	rental_start_date: string;
	rental_end_date: string;
}
