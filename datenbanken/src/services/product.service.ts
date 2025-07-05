import { Pool, RowDataPacket } from "mysql2/promise";
import { Product } from "../models/product.models";
import { InventoryService } from "./inventory.service";

// Interface for combining product with stock information
export interface ProductWithStock extends Product {
	stock: number;
}

export class ProductService {
	private inventoryService: InventoryService;

	constructor(private db: Pool) {
		this.inventoryService = new InventoryService(db);
	}

	/**
	 * Finds all products, optionally filtering by category or a search term.
	 * @param category The category to filter by.
	 * @param search The search term to filter by name or description.
	 * @returns A list of products.
	 */
	async findAll(category?: string, search?: string): Promise<Product[]> {
		let query = 'SELECT * FROM products';
		const params: string[] = [];
		const conditions: string[] = [];

		if (category) {
			conditions.push('category = ?');
			params.push(category);
		}

		if (search) {
			conditions.push('(name LIKE ? OR description LIKE ?)');
			params.push(`%${search}%`, `%${search}%`);
		}

		if (conditions.length > 0) {
			query += ' WHERE ' + conditions.join(' AND ');
		}

		const [rows] = await this.db.query<RowDataPacket[]>(query, params);
		return rows as Product[];
	}

	/**
	 * Finds a single product by its ID and joins it with its current stock count.
	 * @param id The ID of the product to find.
	 * @returns The product with its available stock, or null if not found.
	 */
	async findProductByIdWithStock(id: number): Promise<ProductWithStock | null> {
		const [rows] = await this.db.query<RowDataPacket[]>(`
			SELECT p.*, COUNT(i.id) as stock
			FROM products p
						 LEFT JOIN inventory_items i ON p.id = i.product_id AND i.status = 'available'
			WHERE p.id = ?
			GROUP BY p.id
		`, [id]);

		if (rows.length === 0) {
			return null;
		}
		// If product exists but has no stock, the query returns it with stock 0.
		// If product does not exist, rows is empty.
		return rows[0] as ProductWithStock;
	}

	/**
	 * Finds all products and joins them with their current stock count.
	 * @returns A list of products with their available stock.
	 */
	async findAllWithStock(): Promise<ProductWithStock[]> {
		const [rows] = await this.db.query<RowDataPacket[]>(`
			SELECT p.*, COUNT(i.id) as stock
			FROM products p
						 LEFT JOIN inventory_items i ON p.id = i.product_id AND i.status = 'available'
			GROUP BY p.id
		`);
		return rows as ProductWithStock[];
	}

	/**
	 * Updates the stock for a given product by a certain amount.
	 * @param productId The ID of the product to update.
	 * @param amount The amount to change the stock by (positive to add, negative to remove).
	 * @returns The updated list of all products with their stock.
	 */
	async updateStock(productId: number, amount: number): Promise<ProductWithStock[]> {
		if (amount > 0) {
			await this.inventoryService.addStockForProduct(productId, amount);
		} else if (amount < 0) {
			await this.inventoryService.removeStockForProduct(productId, Math.abs(amount));
		}
		return this.findAllWithStock();
	}
}
