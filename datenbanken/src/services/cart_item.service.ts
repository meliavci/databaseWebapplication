import { ResultSetHeader, Pool } from "mysql2/promise";
import { Cart_Item } from "../models/cart_item.models";

export class CartItemService {
  constructor(private db: Pool) {}

  /**
   * Findet einen bestimmten Artikel in einem bestimmten Warenkorb.
   * @param cart_id Die ID des Warenkorbs.
   * @param itemId Die ID des Artikels (Produkt-ID).
   * @returns Das Cart_Item-Objekt oder null.
   */
  async findCartItem(cart_id: number, itemId: number): Promise<Cart_Item | null> {
    const [rows] = await this.db.query<Cart_Item[]>(
      `SELECT * FROM cart_items WHERE cart_id = ? AND item_id = ? LIMIT 1`,
      [cart_id, itemId]
    );
    return rows[0] || null;
  }

  /**
   * Fügt einen Artikel zum Warenkorb hinzu oder aktualisiert die Menge, wenn er bereits existiert.
   * Diese Methode kapselt die komplette Logik für das Hinzufügen/Aktualisieren.
   * @param cart_id Die ID des Warenkorbs.
   * @param itemId Die ID des Artikels.
   * @param quantity Die hinzuzufügende Menge (kann auch negativ sein, um zu reduzieren).
   * @returns Das resultierende Cart_Item-Objekt (kann eine Menge von 0 haben, wenn es entfernt wurde).
   */
  async addOrUpdateItem(cart_id: number, itemId: number, quantity: number): Promise<Cart_Item> {
    const existingItem = await this.findCartItem(cart_id, itemId);

    // Fall 1: Der Artikel existiert bereits im Warenkorb.
    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;

      // Wenn die neue Menge 0 oder weniger ist, entfernen wir den Artikel.
      if (newQuantity <= 0) {
        await this.removeItem(existingItem.id);
        return { ...existingItem, quantity: 0 }; // Repräsentiert den gelöschten Zustand
      }

      // Ansonsten aktualisieren wir die Menge.
      await this.updateItemQuantity(existingItem.id, newQuantity);
      return { ...existingItem, quantity: newQuantity };
    }

    // Fall 2: Der Artikel ist neu im Warenkorb.
    if (quantity <= 0) {
      throw new Error("Ein neuer Artikel kann nicht mit einer Menge von 0 oder weniger hinzugefügt werden.");
    }

    const [result] = await this.db.query<ResultSetHeader>(
      `INSERT INTO cart_items (cart_id, item_id, quantity) VALUES (?, ?, ?)`,
      [cart_id, itemId, quantity]
    );

    // Das neu eingefügte Objekt abrufen, um ein vollständiges Cart_Item zurückzugeben.
    const [newItems] = await this.db.query<Cart_Item[]>(
      `SELECT * FROM cart_items WHERE id = ?`,
      [result.insertId]
    );
    return newItems[0];
  }

  /**
   * Holt alle Artikel für einen bestimmten Warenkorb.
   * @param cart_id Die ID des Warenkorbs.
   * @returns Eine Liste von Cart_Item-Objekten.
   */
  async getCartItems(cart_id: number): Promise<Cart_Item[]> {
    const [rows] = await this.db.query<Cart_Item[]>(
      `SELECT * FROM cart_items WHERE cart_id = ?`,
      [cart_id]
    );
    return rows;
  }

  /**
   * Aktualisiert die Menge eines Warenkorb-Artikels über seine primäre ID.
   * Dies ist eine interne Hilfsmethode.
   * @param id Die primäre ID des `cart_items`-Eintrags.
   * @param quantity Die neue, absolute Menge.
   */
  private async updateItemQuantity(id: number, quantity: number): Promise<void> {
    await this.db.query(
      `UPDATE cart_items SET quantity = ? WHERE id = ?`,
      [quantity, id]
    );
  }

  /**
   * Entfernt einen Artikel komplett aus dem Warenkorb über seine primäre ID.
   * Dies ist eine interne Hilfsmethode.
   * @param id Die primäre ID des `cart_items`-Eintrags.
   */
  private async removeItem(id: number): Promise<void> {
    await this.db.query(`DELETE FROM cart_items WHERE id = ?`, [id]);
  }
}
