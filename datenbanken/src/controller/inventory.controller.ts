import express, { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';
import { ProductService } from '../services/product.service';
import { authMiddleware, AuthenticatedRequest } from '../middleware/auth.middleware';
import { InventoryService } from "../services/inventory.service";

export function createInventoryRouter(db: Pool) {
	const router = express.Router();
	const productService = new ProductService(db);
	const inventoryService = new InventoryService(db); // Initialize InventoryService

	// GET /api/inventory/stock/:productId -> Get available stock for a product
	router.get('/stock/:productId', async (req: Request, res: Response) => {
		try {
			const productId = parseInt(req.params.productId, 10);
			if (isNaN(productId)) {
				return res.status(400).json({ error: 'Invalid product ID' });
			}
			const stock = await inventoryService.getAvailableStock(productId);
			res.status(200).json({ stock });
		} catch (err) {
			console.error(`Failed to get stock for product ${req.params.productId}:`, err);
			res.status(500).json({ error: 'Failed to get stock' });
		}
	});

	// This route handles updating stock, used by the admin panel
	router.patch('/stock', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
		if (req.user?.role !== 'admin') {
			res.status(403).json({ error: 'Access denied' });
			return;
		}

		const { productId, amount } = req.body;

		if (typeof productId !== 'number' || typeof amount !== 'number') {
			res.status(400).json({ error: 'Invalid productId or amount' });
			return;
		}

		try {
			const updatedInventory = await productService.updateStock(productId, amount);
			res.status(200).json(updatedInventory);
		} catch (err: any) {
			console.error(`Failed to update stock for product ${productId}:`, err);
			res.status(500).json({ error: err.message || 'Failed to update stock' });
		}
	});

	return router;
}
