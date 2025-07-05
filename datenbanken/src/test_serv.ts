import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import dbPool from './database'; // Importieren Sie den Pool direkt
import { createAuthRouter } from './controller/auth.controller';
import { createCartRouter } from './controller/cart.controller';
import { createProductRouter } from './controller/product.controller';
import { createUserRouter } from './controller/user.controller';
import { createInventoryRouter } from './controller/inventory.controller';
import {createOrderRouter} from './controller/order.controller';

// Lädt Umgebungsvariablen aus der .env-Datei im Stammverzeichnis
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

async function startServer() {
	const app = express();
	const port = process.env['PORT_BACKEND'] || 3000; // Port für das Backend

	// 1. Datenbankverbindung ist bereits durch den Import initialisiert
	console.log('Backend database connection pool is available.');

	// 2. Middleware anwenden
	app.use(cors()); // Erlaubt Anfragen von Ihrem Frontend (Cross-Origin Resource Sharing)
	app.use(express.json()); // Ermöglicht das Parsen von JSON-Request-Bodies

	// 3. API-Routen definieren und bündeln
	const apiRouter = express.Router();
	// Verwenden Sie den importierten dbPool direkt
	apiRouter.use('/auth', createAuthRouter(dbPool));
	apiRouter.use('/cart', createCartRouter(dbPool));
	apiRouter.use('/products', createProductRouter(dbPool));
	apiRouter.use('/users', createUserRouter(dbPool));
	apiRouter.use('/inventory', createInventoryRouter(dbPool));
	apiRouter.use('/orders', createOrderRouter(dbPool));


	// 4. Haupt-API-Router unter dem Präfix /api einbinden
	app.use('/api', apiRouter);

	// 5. Server starten
	app.listen(port, () => {
		console.log(`Backend server listening on http://localhost:${port}`);
	});
}

startServer().catch(err => {
	console.error('Failed to start backend server:', err);
});
