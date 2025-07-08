import { Pool, ResultSetHeader } from "mysql2/promise";
import { Shopping_Cart } from "../models/shopping_cart.models";

export class ShoppingCartService {
	constructor(private db: Pool) {}

	async findActiveCartByUserId(userId: number): Promise<Shopping_Cart | null> {
		const [rows] = await this.db.query<Shopping_Cart[]>(
			`SELECT * FROM shopping_carts WHERE user_id = ? AND status = 'active' LIMIT 1`,
			[userId]
		);
		return rows[0] || null;
	}

	async createCart(userId: number): Promise<Shopping_Cart> {
		const [result] = await this.db.query<ResultSetHeader>(
			`INSERT INTO shopping_carts (user_id, status) VALUES (?, 'active')`,
			[userId]
		);

		const [newCarts] = await this.db.query<Shopping_Cart[]>(
			`SELECT * FROM shopping_carts WHERE id = ?`,
			[result.insertId]
		);
		return newCarts[0];
	}

	async getOrCreateActiveCart(userId: number): Promise<Shopping_Cart> {
		const existingCart = await this.findActiveCartByUserId(userId);
		if (existingCart) {
			return existingCart;
		}
		return this.createCart(userId);
	}

	async getCartById(cartId: number): Promise<Shopping_Cart | null> {
		const [rows] = await this.db.query<Shopping_Cart[]>(
			`SELECT * FROM shopping_carts WHERE id = ?`,
			[cartId]
		);
		return rows[0] || null;
	}

	async updateCartStatus(cartId: number, status: 'active' | 'completed' | 'abandoned'): Promise<void> {
		await this.db.query(
			`UPDATE shopping_carts SET status = ?, updated_at = NOW() WHERE id = ?`,
			[status, cartId]
		);
	}
}
