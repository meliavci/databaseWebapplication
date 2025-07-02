import express, { Request, Response } from "express";
import { Pool } from "mysql2/promise";
import { ShoppingCartService } from "../services/shopping_cart.service";
import { CartItemService } from "../services/cart_item.service";
// import { authMiddleware } from "../middleware/auth.middleware"; // WICHTIG!

// Definiere eine benutzerdefinierte Request-Typ, um `user` einzuschließen
interface AuthenticatedRequest extends Request {
  user?: { id: number }; // Annahme: Middleware fügt user-Objekt mit id hinzu
}

export function createCartRouter(db: Pool) {
  const router = express.Router();

  // Services instanziieren
  const shoppingCartService = new ShoppingCartService(db);
  const cartItemService = new CartItemService(db);

  // Alle Routen hier sollten geschützt sein, daher die Middleware am Anfang
  // router.use(authMiddleware); // Hier würde deine Auth-Middleware platziert

  /**
   * GET /cart
   * Holt den gesamten aktuellen Warenkorb (inkl. Artikel) des angemeldeten Benutzers.
   */
  router.get('/', async (req: AuthenticatedRequest, res: Response) => {
    try {
      // Annahme: Middleware hat req.user.id gesetzt
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ error: "Nicht autorisiert." });
        return
      }
      // 1. Hole den Warenkorb des Benutzers (oder erstelle einen neuen)
      const cart = await shoppingCartService.getOrCreateActiveCart(userId);

      // 2. Hole alle Artikel für diesen Warenkorb
      const items = await cartItemService.getCartItems(cart.id);

      // 3. Kombiniere und sende die Antwort
      res.status(200).json({ ...cart, items });

    } catch (err) {
      console.error("Fehler beim Abrufen des Warenkorbs:", err);
      res.status(500).json({ error: "Interner Serverfehler" });
    }
  });

  /**
   * POST /cart/items
   * Fügt einen Artikel zum Warenkorb hinzu oder aktualisiert seine Menge.
   * Body: { "itemId": number, "quantity": number }
   */
  router.post('/items', express.json(), async (req: AuthenticatedRequest, res: Response) => {
    const { itemId, quantity } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ error: "Nicht autorisiert." });
      return
    }
    if (!itemId || typeof quantity !== 'number') {
      res.status(400).json({ error: "itemId und quantity sind erforderlich." });
      return
    }

    try {
      // 1. Hole den Warenkorb des Benutzers
      const cart = await shoppingCartService.getOrCreateActiveCart(userId);

      // 2. Übergebe die Aufgabe, den Artikel hinzuzufügen/zu aktualisieren, an den Item-Service
      await cartItemService.addOrUpdateItem(cart.id, itemId, quantity);

      // 3. Gib den kompletten, aktualisierten Warenkorb zurück (gut für das Frontend)
      const updatedItems = await cartItemService.getCartItems(cart.id);
      res.status(200).json({ ...cart, items: updatedItems });

    } catch (err) {
      console.error("Fehler beim Hinzufügen zum Warenkorb:", err);
      res.status(500).json({ error: "Interner Serverfehler" });
    }
  });
  return router;
}
