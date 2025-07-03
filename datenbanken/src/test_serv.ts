import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createAuthRouter } from './controller/auth.controller';
import { createCartRouter } from './controller/cart.controller';
import { createItemRouter } from './controller/item.controller';
import pool from './database';

dotenv.config();

const app = express();
const port = process.env['PORT'] || 3000;

const authRouter = createAuthRouter(pool);
const cartRouter = createCartRouter(pool);
const itemRouter = createItemRouter(pool);

app.use(express.json());
app.use(cors());

app.use('/auth', authRouter);
app.use('/cart', cartRouter);
app.use('/item', itemRouter);

app.listen(port, () => {
	console.log(`Express server läuft auf Port ${port}`);
});
