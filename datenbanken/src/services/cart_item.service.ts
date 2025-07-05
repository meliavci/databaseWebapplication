import { ResultSetHeader, Pool } from "mysql2/promise";
import { Cart_Item } from "../models/cart_item.models";

export class CartItemService {
	constructor(private db: Pool) {}

	/**
	 * Fügt einen neuen Artikel zum Warenkorb hinzu.
	 * Jedes Hinzufügen erzeugt einen neuen Eintrag, um mehrere Mieten desselben Produkts zu ermöglichen.
	 * @param cart_id Die ID des Warenkorbs.
	 * @param productId Die ID des Produkts.
	 * @param quantity Die hinzuzufügende Menge.
	 * @param monthly_price Der monatliche Preis zum Zeitpunkt des Hinzufügens.
	 * @param rental_start_date Optionales Startdatum der Miete.
	 * @param rental_end_date Optionales Enddatum der Miete.
	 * @returns Das neu erstellte Cart_Item-Objekt.
	 */
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

	/**
	 * Holt alle Artikel für einen bestimmten Warenkorb.
	 * @param cart_id Die ID des Warenkorbs.
	 * @returns Eine Liste von Cart_Item-Objekten mit Produktdetails.
	 */
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

	/**
	 * Entfernt einen Artikel komplett aus dem Warenkorb anhand seiner eindeutigen ID.
	 * @param id Die primäre ID des 'cart_items'-Eintrags.
	 * @returns true bei Erfolg, false wenn kein Artikel gefunden wurde.
	 */
	async removeItem(id: number): Promise<boolean> {
		const [result] = await this.db.query<ResultSetHeader>(`DELETE FROM cart_items WHERE id = ?`, [id]);
		return result.affectedRows > 0;
	}
}
