import express, { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';
import { ProductService } from '../services/product.service';
import { authMiddleware, AuthenticatedRequest } from '../middleware/auth.middleware';

export function createProductRouter(db: Pool) {
	const router = express.Router();
	const productService = new ProductService(db);

	// Get all products, optionally filtered by category or search
	router.get('/', async (req: Request, res: Response) => {
		try {
			const category = req.query['category'] as string | undefined;
			const search = req.query['search'] as string | undefined;
			const products = await productService.findAll(category, search);
			res.status(200).json(products);
		} catch (err) {
			console.error('Failed to fetch products:', err);
			res.status(500).json({ error: 'Failed to fetch products' });
		}
	});

	// Get all products with their stock count
	// @ts-ignore
	router.get('/with-stock', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
		if (req.user?.role !== 'admin') {
			return res.status(403).json({ error: 'Access denied' });
		}
		try {
			const products = await productService.findAllWithStock();
			res.status(200).json(products);
		} catch (err) {
			console.error('Failed to fetch products with stock:', err);
			res.status(500).json({ error: 'Failed to fetch products with stock' });
		}
	});

	// Get a single product by ID with stock
	// @ts-ignore
	router.get('/:id', async (req: Request, res: Response) => {
		try {
			const id = parseInt(req.params['id'], 10);
			if (isNaN(id)) {
				return res.status(400).json({ error: 'Invalid product ID' });
			}
			const product = await productService.findProductByIdWithStock(id);
			if (product) {
				res.status(200).json(product);
			} else {
				res.status(404).json({ error: 'Product not found' });
			}
		} catch (err) {
			console.error(`Failed to fetch product ${req.params['id']}:`, err);
			res.status(500).json({ error: 'Failed to fetch product' });
		}
	});

	return router;
}
