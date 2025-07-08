import express, { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';
import { authMiddleware, AuthenticatedRequest } from '../middleware/auth.middleware';
import { OrderService } from '../services/order.service';

export function createOrderRouter(db: Pool) {
	const router = express.Router();
	const orderService = new OrderService(db);

	// Create a new order
	// @ts-ignore
	router.post('/', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
		try {
			const userId = req.user!.id!;
			const { cart, deliveryAddress, personalData, paymentData, total } = req.body;

			if (!cart || !deliveryAddress || !total) {
				return res.status(400).json({ error: 'Missing required order data' });
			}

			const orderPayload = {
				userId,
				cart,
				deliveryAddress,
				total
			};

			const result = await orderService.createOrder(orderPayload);
			res.status(201).json(result);
		} catch (err: any) {
			console.error('Order creation failed:', err);
			res.status(500).json({ error: err.message || 'Failed to create order' });
		}
	});

	// Get user's orders
	router.get('/', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
		try {
			const userId = req.user!.id!;
			const orders = await orderService.getUserOrders(userId);
			res.status(200).json(orders);
		} catch (err) {
			console.error('Failed to fetch orders:', err);
			res.status(500).json({ error: 'Failed to fetch orders' });
		}
	});

	// Get specific order
	// @ts-ignore
	router.get('/:id', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
		try {
			const orderId = parseInt(req.params['id'], 10);
			if (isNaN(orderId)) {
				return res.status(400).json({ error: 'Invalid order ID' });
			}

			const order = await orderService.getOrderById(orderId);
			if (!order) {
				return res.status(404).json({ error: 'Order not found' });
			}

			if (order.user_id !== req.user!.id) {
				return res.status(403).json({ error: 'Access denied' });
			}

			res.status(200).json(order);
		} catch (err) {
			console.error('Failed to fetch order:', err);
			res.status(500).json({ error: 'Failed to fetch order' });
		}
	});

	return router;
}
