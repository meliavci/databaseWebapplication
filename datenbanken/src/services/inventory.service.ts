import { Pool, RowDataPacket } from "mysql2/promise";
import { InventoryItem } from "../models/inventory_item.models";

export class InventoryService {
	constructor(private db: Pool) {}

	/**
	 * Adds a specified number of new inventory items for a given product.
	 * @param productId The ID of the product.
	 * @param count The number of items to add.
	 */
	async addStockForProduct(productId: number, count: number): Promise<void> {
		if (count <= 0) return;
		const values = [];
		for (let i = 0; i < count; i++) {
			// Using a placeholder for serial_number, adjust as needed
			const serialNumber = `SN-${productId}-${Date.now()}-${i}`;
			values.push([productId, serialNumber, 'available']);
		}
		await this.db.query(
			'INSERT INTO inventory_items (product_id, serial_number, status) VALUES ?',
			[values]
		);
	}

	/**
	 * Removes a specified number of available inventory items for a given product.
	 * @param productId The ID of the product.
	 * @param count The number of items to remove.
	 */
	async removeStockForProduct(productId: number, count: number): Promise<void> {
		if (count <= 0) return;
		// Find available items to delete
		const [itemsToDelete] = await this.db.query<RowDataPacket[]>(
			`SELECT id FROM inventory_items WHERE product_id = ? AND status = 'available' LIMIT ?`,
			[productId, count]
		);

		if (itemsToDelete.length > 0) {
			const ids = itemsToDelete.map(item => item["id"]);
			await this.db.query('DELETE FROM inventory_items WHERE id IN (?)', [ids]);
		}
	}

	async getAvailableStock(productId: number): Promise<number> {
		const [rows] = await this.db.query<RowDataPacket[]>(
			`SELECT COUNT(*) as stockCount FROM inventory_items WHERE product_id = ? AND status = 'available'`,
			[productId]
		);
		return rows[0]["stockCount"] || 0;
	}

	async createItem(itemData: Omit<InventoryItem, 'id'>): Promise<InventoryItem> {
		const [result] = await this.db.query(
			'INSERT INTO inventory_items (product_id, serial_number, status, date_loan, date_return, borrowed_by) VALUES (?, ?, ?, ?, ?, ?)',
			[itemData.product_id, itemData.serial_number, itemData.status || 'available', itemData.date_loan, itemData.date_return, itemData.borrowed_by]
		);
		const insertId = (result as any).insertId;
		return { id: insertId, ...itemData };
	}

	async findItemById(id: number): Promise<InventoryItem | null> {
		const [rows] = await this.db.query<InventoryItem[] & RowDataPacket[]>(
			'SELECT * FROM inventory_items WHERE id = ?',
			[id]
		);
		return rows[0] || null;
	}

	async findAllItems(): Promise<InventoryItem[]> {
		const [rows] = await this.db.query<InventoryItem[] & RowDataPacket[]>(
			'SELECT * FROM inventory_items'
		);
		return rows;
	}

	async updateItem(id: number, itemData: Partial<Omit<InventoryItem, 'id'>>): Promise<InventoryItem | null> {
		const fields = Object.keys(itemData);
		const values = Object.values(itemData);
		if (fields.length === 0) return this.findItemById(id);

		const setClause = fields.map(field => `${field} = ?`).join(', ');
		await this.db.query(`UPDATE inventory_items SET ${setClause} WHERE id = ?`, [...values, id]);
		return this.findItemById(id);
	}

	async deleteItem(id: number): Promise<boolean> {
		const [result] = await this.db.query('DELETE FROM inventory_items WHERE id = ?', [id]);
		return (result as any).affectedRows > 0;
	}

	async findAvailableItemsForProduct(productId: number): Promise<InventoryItem[]> {
		const [rows] = await this.db.query<InventoryItem[] & RowDataPacket[]>(
			`SELECT * FROM inventory_items WHERE product_id = ? AND status = 'available'`,
			[productId]
		);
		return rows;
	}

	async markAsRented(itemId: number, userId: number, loanDate: string, returnDate: string): Promise<void> {
		await this.db.query(
			`UPDATE inventory_items SET status = 'rented', borrowed_by = ?, date_loan = ?, date_return = ? WHERE id = ?`,
			[userId, loanDate, returnDate, itemId]
		);
	}

	async markAsAvailable(itemId: number): Promise<void> {
		await this.db.query(
			`UPDATE inventory_items SET status = 'available', borrowed_by = NULL, date_loan = NULL, date_return = NULL WHERE id = ?`,
			[itemId]
		);
	}

	async findAvailableItems(productId: number, quantity: number): Promise<InventoryItem[]> {
		const [rows] = await this.db.query<InventoryItem[]>(
			`SELECT * FROM inventory_items WHERE product_id = ? AND status = 'available' LIMIT ?`,
			[productId, quantity]
		);
		return rows;
	}
}
