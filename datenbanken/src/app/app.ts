import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import dotenv from 'dotenv';
import { authMiddleware } from '../middleware/auth.middleware';
import { createAuthRouter } from '../controller/auth.controller';
import { createCartRouter } from '../controller/cart.controller';
import { createItemRouter } from '../controller/item.controller';
import pool from './database';
import express from 'express'

dotenv.config(); // Lädt die Variablen aus .env in process.env


@Component({
  selector: 'app-root',
	imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'DeviceDrop';
}

const app = express();
const port = process.env['PORT'] || 3000;

const authRouter = createAuthRouter(pool);
const itemRouter = createCartRouter(pool);
const cartRouter = createItemRouter(pool);

app.use(express.json());

app.use('/auth', authRouter);
app.use('/cart', cartRouter);
app.use('/item', itemRouter);
