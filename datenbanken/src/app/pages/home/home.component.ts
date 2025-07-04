import {Component} from '@angular/core';
import {AppProductComponent} from '../../components/advantages.component';
import {HeroSectionComponent} from '../../components/hero-section.component';
import {ProductPreviewSectionComponent} from '../../components/product-preview-section.component';
import {ReviewSectionComponent} from '../../components/review-section.component';

@Component({
	selector: 'app-home',
	standalone: true,
	imports: [
		AppProductComponent,
		HeroSectionComponent,
		ProductPreviewSectionComponent,
		ReviewSectionComponent
	],
	template: `
		<app-hero-section></app-hero-section>
		<app-advantages></app-advantages>
		<app-product-preview-section></app-product-preview-section>
		<app-review-section></app-review-section>
  `
})
export class HomeComponent {}
