import { Component, Input } from '@angular/core';
import { AddToCartButtonComponent } from './add-to-cart-button.component';
import { RouterLink } from '@angular/router';
import { Product } from '../../models/product.models';
import { CommonModule } from '@angular/common';

@Component({
	selector: 'app-product-card',
	standalone: true,
	imports: [
		AddToCartButtonComponent,
		RouterLink,
		CommonModule
	],
	template: `
		<div
			 class="card block border border-neutral-700 rounded-3xl p-4 bg-neutral-900 hover:border-blue-500 transition-all duration-300 ease-in-out transform hover:-translate-y-1 cursor-pointer h-full flex flex-col">
			<div class="flex flex-col">
				<a [routerLink]="['/product', product.id]" class="flex flex-col">
					<div class="relative w-full h-48 mb-2">
						<img [src]="product.image_url || '/placeholder.png'" [alt]="product.name"
								 class="w-full h-full object-contain rounded-lg p-4">
					</div>
					<div class="flex-grow items-start">
						<p class="inline-block text-sm text-gray-300 mb-5 border-blue-500 rounded-full px-2 border">{{ product.category }}</p>
						<h3 class="font-semibold line-clamp-2 text-white">{{ product.name }}</h3>
						<p class="text-sm text-gray-400 mt-2 mb-5">
							From <span class="font-bold text-white">{{ product.price_per_month }}€</span> / month
						</p>
					</div>
				</a>
				<div class="w-full mt-4" (click)="$event.stopPropagation()">
					<app-add-to-cart-button
						(click)="$event.stopPropagation()"
						[productId]="product.id"
						[monthlyPrice]="product.price_per_month"
						[rentalStartDate]="today"
						[rentalEndDate]="nextMonth">
					</app-add-to-cart-button>
				</div>
			</div>
		</div>
	`
})
export class ProductCardComponent {
	@Input() product!: Product;

	get today(): string {
		return new Date().toISOString().split('T')[0];
	}

	get nextMonth(): string {
		const date = new Date();
		date.setMonth(date.getMonth() + 1);
		return date.toISOString().split('T')[0];
	}
}
