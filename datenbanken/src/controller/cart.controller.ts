import express, { Response } from "express";
import { Pool } from "mysql2/promise";
import { authMiddleware, AuthenticatedRequest } from '../middleware/auth.middleware';
import { ShoppingCartService } from '../services/shopping_cart.service';
import { CartItemService } from '../services/cart_item.service';

export function createCartRouter(db: Pool) {
	const router = express.Router();
	const shoppingCartService = new ShoppingCartService(db);
	const cartItemService = new CartItemService(db);

	router.use(authMiddleware);

	// Get the current user's active cart
	router.get('/', async (req: AuthenticatedRequest, res: Response) => {
		try {
			const userId = req.user!.id!;
			const cart = await shoppingCartService.getOrCreateActiveCart(userId);
			const items = await cartItemService.getCartItems(cart.id);
			res.status(200).json({ ...cart, items });
		} catch (err) {
			console.error('Error getting cart:', err);
			res.status(500).json({ error: "Fehler beim Abrufen des Warenkorbs" });
		}
	});

	// Add an item to the cart
	// @ts-ignore
	router.post('/items', async (req: AuthenticatedRequest, res: Response) => {
		try {
			const userId = req.user!.id!;
			const { productId, quantity, monthly_price, rental_start_date, rental_end_date } = req.body;

			if (!productId || !quantity || monthly_price === undefined) {
				return res.status(400).json({ error: "Fehlende Artikeldetails" });
			}

			const cart = await shoppingCartService.getOrCreateActiveCart(userId);

			const newItem = await cartItemService.addItem(
				cart.id,
				productId,
				quantity,
				monthly_price,
				rental_start_date,
				rental_end_date
			);

			res.status(201).json(newItem);
		} catch (err) {
			console.error('Error adding item to cart:', err);
			res.status(500).json({ error: "Fehler beim Hinzufügen des Artikels zum Warenkorb" });
		}
	});

	// Remove an item from the cart
	router.delete('/items/:itemId', async (req: AuthenticatedRequest, res: Response) => {
		try {
			const itemId = parseInt(req.params["itemId"], 10);
			const success = await cartItemService.removeItem(itemId);
			if (success) {
				res.status(204).send();
			} else {
				res.status(404).json({ error: "Artikel nicht im Warenkorb gefunden" });
			}
		} catch (err) {
			console.error('Error removing item from cart:', err);
			res.status(500).json({ error: "Fehler beim Entfernen des Artikels" });
		}
	});

	return router;
}
