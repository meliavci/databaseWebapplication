import { Pool } from "mysql2/promise";
import { Item } from "../models/item.models";

export class ItemService {
  constructor(private db: Pool) {}

  /**
   * Erstellt ein neues Item in der Datenbank
   */
  async createItem(itemData: Omit<Item, 'id'>): Promise<Item> {
    const [result] = await this.db.query(
      'INSERT INTO items (category, description, status, price, source) VALUES (?, ?, ?, ?)',
      [itemData.category, itemData.description, itemData.status, itemData.price, itemData.source]
    );
    const insertId = (result as any).insertId;
    return { id: insertId, ...itemData };
  }

  /**
   * Findet ein Item anhand seiner ID
   */
  async findItemById(id: number): Promise<Item | null> {
    const [rows] = await this.db.query('SELECT * FROM items WHERE id = ?', [id]);
    if ((rows as any).length === 0) return null;
    return (rows as any)[0] as Item;
  }

  /**
   * Ruft alle Items ab
   */
  async findAllItems(): Promise<Item[]> {
    const [rows] = await this.db.query('SELECT * FROM items');
    return rows as Item[];
  }

  /**
   * Aktualisiert ein bestehendes Item (z.B. um es auszuleihen)
   */
  async updateItem(id: number, itemData: Partial<Item>): Promise<Item | null> {
    // Erstellt dynamisch den SET-Teil der SQL-Abfrage
    const fields = Object.keys(itemData);
    const values = Object.values(itemData);
    const setClause = fields.map(field => `${field} = ?`).join(', ');

    if (fields.length === 0) return this.findItemById(id);

    await this.db.query(`UPDATE items SET ${setClause} WHERE id = ?`, [...values, id]);
    return this.findItemById(id);
  }

  /**
   * Löscht ein Item
   */
  async deleteItem(id: number): Promise<boolean> {
    const [result] = await this.db.query('DELETE FROM items WHERE id = ?', [id]);
    return (result as any).affectedRows > 0;
  }
}
