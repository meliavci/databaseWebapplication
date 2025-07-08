import express, { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';
import { InventoryService } from '../services/inventory.service';
import { authMiddleware, AuthenticatedRequest } from '../middleware/auth.middleware';
import { Server } from 'socket.io';

export interface SocketManager {
	io: Server;
	userSockets: Map<number, string>;
}

export function createInventoryRouter(db: Pool, socketManager: SocketManager) {
	const router = express.Router();
	const inventoryService = new InventoryService(db);

	router.use(authMiddleware);

	// @ts-ignore
	router.get('/stock/:productId', async (req: Request, res: Response) => {
		try {
			const productId = parseInt(req.params['productId'], 10);
			if (isNaN(productId)) {
				return res.status(400).json({ error: 'Invalid product ID' });
			}
			const stock = await inventoryService.getAvailableStock(productId);
			res.status(200).json({ stock });
		} catch (err) {
			console.error('Failed to get stock:', err);
			res.status(500).json({ error: 'Failed to get stock' });
		}
	});

	// @ts-ignore
	router.patch('/stock', async (req: AuthenticatedRequest, res: Response) => {
		if (req.user?.role !== 'admin') {
			return res.status(403).json({ error: 'Access denied' });
		}
		try {
			const { productId, amount } = req.body;
			if (typeof productId !== 'number' || typeof amount !== 'number') {
				return res.status(400).json({ error: 'Invalid payload. productId and amount must be numbers.' });
			}

			if (amount > 0) {
				await inventoryService.addStockForProduct(productId, amount);
			} else if (amount < 0) {
				await inventoryService.removeStockForProduct(productId, Math.abs(amount));
			}

			const newStock = await inventoryService.getAvailableStock(productId);

			socketManager.io.emit('stock_updated', { productId, stock: newStock });
			console.log(`Emitted stock_updated for productId ${productId}: ${newStock}`);

			res.status(200).json({ productId, stock: newStock });
		} catch (err: any) {
			console.error('Failed to update stock:', err);
			res.status(500).json({ error: err.message || 'Failed to update stock' });
		}
	});

	return router;
}
