import { Pool, ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import { RentalOrder } from '../models/rental_order.models';
import { RentalOrder_Item } from '../models/rental_order_item.models';
import { InventoryItem } from '../models/inventory_item.models';

interface OrderPayload {
	userId: number;
	cart: {
		id: number;
		items: any[];
	};
	deliveryAddress: any;
	total: number;
}

export class OrderService {
	private db: Pool;

	constructor(db: Pool) {
		this.db = db;
	}

	async getUserOrders(userId: number): Promise<any[]> {
		// @ts-ignore
		const [orders] = await this.db.query<RentalOrder[]>(
			`SELECT * FROM rental_orders WHERE user_id = ? ORDER BY order_date DESC`,
			[userId]
		);

		const result = [];
		for (const order of orders) {
			const [itemRows] = await this.db.query<RowDataPacket[]>(
				`SELECT roi.*, p.name, p.image_url
			 FROM rental_order_items roi
			 JOIN products p ON roi.product_id = p.id
			 WHERE roi.order_id = ?`,
				[order.id]
			);
			result.push({
				...order,
				items: itemRows
			});
		}
		return result;
	}

	async createOrder(payload: OrderPayload): Promise<{ orderId: number }> {
		const connection = await this.db.getConnection();

		function toMySQLDateTime(dateString: string): string {
			const date = new Date(dateString);
			return date.toISOString().slice(0, 19).replace('T', ' ');
		}

		await connection.beginTransaction();

		try {
			const { userId, cart, total } = payload;

			const [orderResult] = await connection.query<ResultSetHeader>(
				`INSERT INTO rental_orders (user_id, order_date, total_amount, status) VALUES (?, NOW(), ?, ?)`,
				[userId, total, 'pending']
			);
			const orderId = orderResult.insertId;

			for (const item of cart.items) {
				// @ts-ignore
				const [availableItems] = await connection.query<InventoryItem[]>(
					`SELECT id FROM inventory_items WHERE product_id = ? AND status = 'available' LIMIT ? FOR UPDATE`,
					[item.product_id, item.quantity]
				);

				if (availableItems.length < item.quantity) {
					throw new Error(`Not enough stock for product ID ${item.product_id}.`);
				}

				for (const inventoryItem of availableItems) {
					const rental_start_date = toMySQLDateTime(item.rental_start_date);
					const rental_end_date = toMySQLDateTime(item.rental_end_date);
					await connection.query<ResultSetHeader>(
						`INSERT INTO rental_order_items (order_id, inventory_item_id, product_id, price, rental_start_date, rental_end_date) VALUES (?, ?, ?, ?, ?, ?)`,
						[orderId, inventoryItem.id, item.product_id, item.monthly_price, rental_start_date, rental_end_date]
					);

					await connection.query(
						`UPDATE inventory_items SET status = 'rented', date_loan = ?, date_return = ?, borrowed_by = ? WHERE id = ?`,
						[rental_start_date, rental_end_date, userId, inventoryItem.id]
					);
				}
			}

			await connection.query(
				`UPDATE shopping_carts SET status = 'completed' WHERE id = ?`,
				[cart.id]
			);

			await connection.query(
				`UPDATE rental_orders SET status = 'ongoing' WHERE id = ?`,
				[orderId]
			);

			await connection.commit();
			return { orderId };

		} catch (error) {
			await connection.rollback();
			console.error("Order creation failed, transaction rolled back.", error);
			throw error;
		} finally {
			connection.release();
		}
	}

	async getOrderById(orderId: number): Promise<(RentalOrder & { items: RentalOrder_Item[] }) | null> {
		const [orderRows] = await this.db.query<RowDataPacket[]>(
			`SELECT * FROM rental_orders WHERE id = ?`,
			[orderId]
		);

		if (orderRows.length === 0) {
			return null;
		}
		const order = orderRows[0] as RentalOrder;

		const [itemRows] = await this.db.query<RowDataPacket[]>(
			`SELECT roi.*, p.name, p.image_url
			 FROM rental_order_items roi
							JOIN products p ON roi.product_id = p.id
			 WHERE roi.order_id = ?`,
			[orderId]
		);

		return {
			...order,
			items: itemRows as RentalOrder_Item[]
		};
	}
}
