import { Pool, ResultSetHeader } from "mysql2/promise";
import { Shopping_Cart } from "../models/shopping_cart.models";

export class ShoppingCartService {
  constructor(private db: Pool) {}

  /**
   * Findet den aktiven Warenkorb für einen Benutzer.
   * Ein Benutzer sollte normalerweise nur einen aktiven Warenkorb haben.
   * @param userId Die ID des Benutzers.
   * @returns Den aktiven Warenkorb oder null, wenn keiner gefunden wird.
   */
  async findActiveCartByUserId(userId: number): Promise<Shopping_Cart | null> {
    const [rows] = await this.db.query<Shopping_Cart[]>(
      `SELECT * FROM shopping_carts WHERE user_id = ? AND status = 'active' LIMIT 1`,
      [userId]
    );
    return rows[0] || null;
  }

  /**
   * Erstellt einen neuen, leeren Warenkorb für einen Benutzer.
   * @param userId Die ID des Benutzers.
   * @returns Den neu erstellten Warenkorb.
   */
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

  /**
   * Holt den aktiven Warenkorb eines Benutzers oder erstellt einen neuen, falls keiner existiert.
   * Dies ist die nützlichste Methode für den Controller.
   * @param userId Die ID des Benutzers.
   * @returns Den existierenden oder neu erstellten aktiven Warenkorb.
   */
  async getOrCreateActiveCart(userId: number): Promise<Shopping_Cart> {
    const existingCart = await this.findActiveCartByUserId(userId);
    if (existingCart) {
      return existingCart;
    }
    return this.createCart(userId);
  }

  /**
   * Findet einen Warenkorb anhand seiner ID.
   * @param cartId Die ID des Warenkorbs.
   * @returns Den Warenkorb oder null.
   */
  async getCartById(cartId: number): Promise<Shopping_Cart | null> {
    const [rows] = await this.db.query<Shopping_Cart[]>(
      `SELECT * FROM shopping_carts WHERE id = ?`,
      [cartId]
    );
    return rows[0] || null;
  }

  /**
   * Ändert den Status eines Warenkorbs (z.B. von 'active' auf 'completed' nach dem Checkout).
   * @param cartId Die ID des Warenkorbs.
   * @param status Der neue Status (z.B. 'completed', 'abandoned').
   */
  async updateCartStatus(cartId: number, status: string): Promise<void> {
    await this.db.query(
      `UPDATE shopping_carts SET status = ?, updated_at = NOW() WHERE id = ?`,
      [status, cartId]
    );
  }
}
