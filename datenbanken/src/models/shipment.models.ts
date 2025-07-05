export interface Shipment {
	id: number;
	order_id: number;
	tracking_number?: string;
	carrier: string;
	status: 'preparing' | 'shipped' | 'delivered' | 'return_shipped' | 'return_delivered';
	date_shipped?: string;
	date_delivered?: string;
}
