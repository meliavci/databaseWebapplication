export interface InventoryItem {
	id: number;
	product_id: number;
	serial_number: string;
	status: 'available' | 'rented';
	date_loan?: string;
	date_return?: string;
	borrowed_by?: number;
}
