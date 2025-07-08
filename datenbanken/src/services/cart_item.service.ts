import { ResultSetHeader, Pool } from "mysql2/promise";
import { Cart_Item } from "../models/cart_item.models";

export class CartItemService {
	constructor(private db: Pool) {}

	async addItem(
		cart_id: number,
		productId: number,
		quantity: number,
		monthly_price: number,
		rental_start_date?: string,
		rental_end_date?: string
	): Promise<Cart_Item> {
		if (quantity <= 0) {
			throw new Error("Ein neuer Artikel kann nicht mit einer Menge von 0 oder weniger hinzugefügt werden.");
		}

		const [result] = await this.db.query<ResultSetHeader>(
			`INSERT INTO cart_items (cart_id, product_id, quantity, monthly_price, rental_start_date, rental_end_date) VALUES (?, ?, ?, ?, ?, ?)`,
			[cart_id, productId, quantity, monthly_price, rental_start_date, rental_end_date]
		);

		const [newItems] = await this.db.query<Cart_Item[]>(
			`SELECT * FROM cart_items WHERE id = ?`,
			[result.insertId]
		);
		return newItems[0];
	}

	async getCartItems(cart_id: number): Promise<any[]> {
		const [rows] = await this.db.query<any[]>(
			`SELECT ci.*, p.name, p.image_url
			 FROM cart_items ci
							JOIN products p ON ci.product_id = p.id
			 WHERE ci.cart_id = ?`,
			[cart_id]
		);
		return rows;
	}

	async removeItem(id: number): Promise<boolean> {
		const [result] = await this.db.query<ResultSetHeader>(`DELETE FROM cart_items WHERE id = ?`, [id]);
		return result.affectedRows > 0;
	}
}
