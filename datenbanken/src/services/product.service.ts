import { Pool, RowDataPacket } from "mysql2/promise";
import { Product } from "../models/product.models";
import { InventoryService } from "./inventory.service";

export interface ProductWithStock extends Product {
	stock: number;
}

export class ProductService {
	private inventoryService: InventoryService;

	constructor(private db: Pool) {
		this.inventoryService = new InventoryService(db);
	}

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
		return rows[0] as ProductWithStock;
	}

	async findAllWithStock(): Promise<ProductWithStock[]> {
		const [rows] = await this.db.query<RowDataPacket[]>(`
			SELECT p.*, COUNT(i.id) as stock
			FROM products p
						 LEFT JOIN inventory_items i ON p.id = i.product_id AND i.status = 'available'
			GROUP BY p.id
		`);
		return rows as ProductWithStock[];
	}

	async updateStock(productId: number, amount: number): Promise<ProductWithStock[]> {
		if (amount > 0) {
			await this.inventoryService.addStockForProduct(productId, amount);
		} else if (amount < 0) {
			await this.inventoryService.removeStockForProduct(productId, Math.abs(amount));
		}
		return this.findAllWithStock();
	}
}
