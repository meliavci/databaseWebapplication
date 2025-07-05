import express, { Request, Response } from "express";
import { Pool } from "mysql2/promise";
import { InventoryService } from '../services/inventory.service';
import { authMiddleware, AuthenticatedRequest } from '../middleware/auth.middleware';

// Define a type for request parameters that include an 'id'
interface RequestWithIdParams extends Request {
	params: {
		id: string;
	}
}

export function createItemRouter(db: Pool) {
	const router = express.Router();
	const inventoryService = new InventoryService(db);

	router.use(express.json());

	// GET /items -> Alle Inventargegenstände abrufen
	router.get('/', async (req: Request, res: Response) => {
		try {
			const items = await inventoryService.findAllItems();
			res.status(200).json(items);
		} catch (err) {
			console.error(err);
			res.status(500).json({ error: "Fehler beim Abrufen der Inventargegenstände" });
		}
	});

	// POST /items -> Neuen Inventargegenstand erstellen
	router.post('/', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
		try {
			const newItem = await inventoryService.createItem(req.body);
			res.status(201).json(newItem);
		} catch (err: any) {
			console.error(err);
			res.status(400).json({ error: err.message || "Fehler beim Erstellen des Inventargegenstands" });
		}
	});

	// GET /items/:id -> Einen spezifischen Inventargegenstand abrufen
	router.get('/:id', async (req: RequestWithIdParams, res: Response) => {
		try {
			const item = await inventoryService.findItemById(Number(req.params.id));
			if (!item) {
				res.status(404).json({ error: "Inventargegenstand nicht gefunden" });
				return;
			}
			res.status(200).json(item);
		} catch (err) {
			console.error(err);
			res.status(500).json({ error: "Fehler beim Suchen des Inventargegenstands" });
		}
	});

	// PATCH /items/:id -> Einen Inventargegenstand aktualisieren
	router.patch('/:id', authMiddleware, async (req: AuthenticatedRequest & RequestWithIdParams, res: Response) => {
		try {
			const updatedItem = await inventoryService.updateItem(Number(req.params.id), req.body);
			if (!updatedItem) {
				res.status(404).json({ error: "Inventargegenstand nicht gefunden" });
				return;
			}
			res.status(200).json(updatedItem);
		} catch(err: any) {
			console.error(err);
			res.status(400).json({ error: err.message || "Fehler beim Aktualisieren des Inventargegenstands" });
		}
	});

	// DELETE /items/:id -> Einen Inventargegenstand löschen
	router.delete('/:id', authMiddleware, async (req: AuthenticatedRequest & RequestWithIdParams, res: Response) => {
		try {
			const success = await inventoryService.deleteItem(Number(req.params.id));
			if (!success) {
				res.status(404).json({ error: "Inventargegenstand zum Löschen nicht gefunden" });
				return;
			}
			res.status(204).send(); // 204 No Content für erfolgreiches Löschen
		} catch (err) {
			console.error(err);
			res.status(500).json({ error: "Fehler beim Löschen des Inventargegenstands" });
		}
	});

	return router;
}
