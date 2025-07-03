// backend/server.ts
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import pool from './database';
import { createAuthRouter } from './controller/auth.controller';
import { createCartRouter } from './controller/cart.controller';
import { createItemRouter } from './controller/item.controller';

dotenv.config();

const app = express();
const port = process.env['PORT'] || 3000;

app.use(cors());
app.use(express.json());

app.use('/auth', createAuthRouter(pool));
app.use('/cart', createCartRouter(pool));
app.use('/item', createItemRouter(pool));

app.listen(port, () => {
	console.log(` Server läuft auf Port ${port}`);
});
