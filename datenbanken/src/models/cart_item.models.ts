import {RowDataPacket} from 'mysql2';

export interface Cart_Item extends RowDataPacket{
	id: number;
	cart_id: number;
	product_id: number;
	quantity: number;
	monthly_price: number;
	rental_start_date?: string;
	rental_end_date?: string;
}
