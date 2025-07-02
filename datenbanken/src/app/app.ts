import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {HeaderComponent} from './components/header.component';
import {FooterComponent} from './components/footer.component';
import {ProductCardComponent} from './components/product-card.component';
import {AppProductCard} from './components/products.component';
import {HeroSectionComponent} from './components/hero-section.component';
import {AppProductComponent} from './components/advantages.component';
import {ProductPreviewSectionComponent} from './components/product-preview-section.component';
import {ReviewSectionComponent} from './components/review-section.component';
import {HomeComponent} from './pages/home/home.component';
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
  protected title = 'datenbanken';
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
