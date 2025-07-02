import {Component} from '@angular/core';
import {ProductCardComponent} from './product-card.component';

@Component({
	selector: 'app-products',
	imports: [
		ProductCardComponent
	],
	template: `
		<div class="max-w-7xl mx-auto justify-center px-4 sm:px-6 lg:px-8 py-10">
			<div class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-12 sm:mb-20">
				<app-product-card></app-product-card>
				<app-product-card></app-product-card>
				<app-product-card></app-product-card>
				<app-product-card></app-product-card>
				<app-product-card></app-product-card>
				<app-product-card></app-product-card>
				<app-product-card></app-product-card>
				<app-product-card></app-product-card>
				<app-product-card></app-product-card>
				<app-product-card></app-product-card>
			</div>
		</div>`
})
export class AppProductCard {}
