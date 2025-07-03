import express, { RequestHandler } from "express";
import { Pool } from "mysql2/promise";
import { ItemService } from '../services/item.service';
import {authMiddleware} from '../middleware/auth.middleware';

export function createItemRouter(db: Pool) {
  const router = express.Router();
  const itemService = new ItemService(db);

	router.use(express.json());


  // GET /api/items -> Alle Items abrufen
  router.get('/', async (req, res) => {
    try {
      const items = await itemService.findAllItems();
      res.status(200).json(items);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Fehler beim Abrufen der Items" });
    }
  });

  // POST /api/items -> Neues Item erstellen
  router.post('/', authMiddleware, async (req, res) => {
    try {
      const newItem = await itemService.createItem(req.body);
      res.status(201).json(newItem);
    } catch (err) {
      console.error(err);
      res.status(400).json({ error: "Fehler beim Erstellen des Items" });
    }
  });

  // GET /api/items/:id -> Ein spezifisches Item abrufen
  router.get('/:id', async (req, res) => {
    try {
      const item = await itemService.findItemById(Number(req.params.id));
      if (!item) {
        res.status(404).json({ error: "Item nicht gefunden" });
        return
      }
      res.status(200).json(item);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Fehler beim Suchen des Items" });
    }
  });

  // PATCH /api/items/:id -> Ein Item aktualisieren
  router.patch('/:id', authMiddleware, async (req, res) => {
    try {
      const updatedItem = await itemService.updateItem(Number(req.params["id"]), req.body);
      if (!updatedItem) {
        res.status(404).json({ error: "Item nicht gefunden" });
        return
      }
      res.status(200).json(updatedItem);
    } catch(err) {
      console.error(err);
      res.status(400).json({ error: "Fehler beim Aktualisieren des Items" });
    }
  });

  // Korrekt mit dem Pfad '/:id'
  router.delete('/:id', authMiddleware, async (req, res) => {
    try {
      const success = await itemService.deleteItem(Number(req.params["id"]));
      if (!success) {
        res.status(404).json({ error: "Item zum Löschen nicht gefunden" });
        return
      }
      res.status(204).send(); // 204 No Content ist eine gute Antwort für erfolgreiches Löschen
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Fehler beim Löschen des Items" });
    }
  });  return router;
}
