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

@Component({
  selector: 'app-root',
	imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'datenbanken';
}
