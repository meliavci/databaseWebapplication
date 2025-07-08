import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { createServer } from 'http';
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import dbPool from './database';
import { createAuthRouter } from './controller/auth.controller';
import { createCartRouter } from './controller/cart.controller';
import { createProductRouter } from './controller/product.controller';
import { createUserRouter } from './controller/user.controller';
import { createInventoryRouter } from './controller/inventory.controller';
import { createOrderRouter } from './controller/order.controller';


dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

const userSockets = new Map<number, string>();

async function startServer() {
	const app = express();
	const httpServer = createServer(app);
	const io = new Server(httpServer, {
		cors: {
			origin: "http://localhost:4200",
			methods: ["GET", "POST"]
		}
	});
	const port = process.env['PORT_BACKEND'] || 3000;

	console.log('Backend database connection pool is available.');

	app.use(cors());
	app.use(express.json());

	const apiRouter = express.Router();
	const socketManager = { io, userSockets };
	apiRouter.use('/auth', createAuthRouter(dbPool, socketManager));
	apiRouter.use('/cart', createCartRouter(dbPool));
	apiRouter.use('/products', createProductRouter(dbPool));
	apiRouter.use('/users', createUserRouter(dbPool, socketManager));
	apiRouter.use('/inventory', createInventoryRouter(dbPool, socketManager));
	apiRouter.use('/orders', createOrderRouter(dbPool));

	app.use('/api', apiRouter);

	io.on('connection', (socket) => {
		console.log(`Socket connected: ${socket.id}`);
		const token = socket.handshake.auth['token'];

		if (token && process.env['JWT_SECRET']) {
			try {
				const decoded = jwt.verify(token, process.env['JWT_SECRET']) as { id: number, role: string };
				const userId = decoded.id;
				userSockets.set(userId, socket.id);
				console.log(`User ${userId} registered with socket ${socket.id}`);

				if (decoded.role === 'admin') {
					socket.join('admin_room');
					console.log(`Admin user ${userId} joined 'admin_room'`);
				}

				socket.on('disconnect', () => {
					if (userSockets.get(userId) === socket.id) {
						userSockets.delete(userId);
						console.log(`User ${userId} disconnected and unregistered.`);
					}
				});
			} catch (error) {
				console.error('Socket authentication failed:', error);
				socket.disconnect();
			}
		} else {
			console.log('Socket connection without token.');
			socket.disconnect();
		}
	});

	httpServer.listen(port, () => {
		console.log(`Backend server with WebSocket listening on http://localhost:${port}`);
	});
}

startServer().catch(err => {
	console.error('Failed to start backend server:', err);
});
