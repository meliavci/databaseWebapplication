import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import dotenv from 'dotenv';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'datenbanken';
}

dotenv.config(); // Lädt die Variablen aus .env in process.env


import { authMiddleware } from '../middleware/auth.middleware';
import { createAuthRouter } from '../controller/auth.controller';
import { createCartRouter } from '../controller/cart.controller';
import { createItemRouter } from '../controller/item.controller';
