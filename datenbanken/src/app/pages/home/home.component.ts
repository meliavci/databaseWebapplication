import {Component} from '@angular/core';
import {AppProductComponent} from '../../components/advantages.component';
import {FooterComponent} from '../../components/footer.component';
import {HeaderComponent} from '../../components/header.component';
import {HeroSectionComponent} from '../../components/hero-section.component';
import {ProductPreviewSectionComponent} from '../../components/product-preview-section.component';
import {ReviewSectionComponent} from '../../components/review-section.component';

@Component({
	selector: 'app-home',
	standalone: true,
	imports: [
		AppProductComponent,
		FooterComponent,
		HeaderComponent,
		HeroSectionComponent,
		ProductPreviewSectionComponent,
		ReviewSectionComponent
	],
	template: `
		<app-header></app-header>
		<app-hero-section></app-hero-section>
		<app-advantages></app-advantages>
		<app-product-preview-section></app-product-preview-section>
		<app-review-section></app-review-section>
		<app-footer></app-footer>
  `
})
export class HomeComponent {}
