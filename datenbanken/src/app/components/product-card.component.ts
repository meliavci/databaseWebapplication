import {Component, inject, Input, OnDestroy, OnInit} from '@angular/core';
import { AddToCartButtonComponent } from './add-to-cart-button.component';
import {RouterLink} from '@angular/router';
import { Product } from '../../models/product.models';
import {CommonModule, NgIf} from '@angular/common';
import {ProductService, ProductWithStock} from '../servicesFE/product.service';
import {filter, Subscription} from 'rxjs';
import {WebSocketService} from '../servicesFE/websocket.service';
import {AuthService} from '../servicesFE/authFE';

@Component({
	selector: 'app-product-card',
	standalone: true,
	imports: [
		AddToCartButtonComponent,
		RouterLink,
		NgIf,
		CommonModule
	],
	template: `
		<div *ngIf="product"
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
						[rentalEndDate]="nextMonth"
						[product]="product">
					</app-add-to-cart-button>
				</div>
			</div>
		</div>
	`
})
export class ProductCardComponent implements OnInit, OnDestroy {
	@Input() product: ProductWithStock | Product | null = null;

	private productService = inject(ProductService);
	private webSocketService = inject(WebSocketService);
	private authService = inject(AuthService);
	private stockUpdateSubscription: Subscription | undefined;

	ngOnInit(): void {
		const token = this.authService.getToken();
		if (token) {
			this.webSocketService.connect(token);
		}

		if (this.product) {
			if (!('stock' in this.product)) {
				(this.product as ProductWithStock).stock = 0;
				this.productService.getProduct(this.product.id).subscribe(p => {
					if (this.product) {
						(this.product as ProductWithStock).stock = p.stock;
					}
				});
			}
			this.listenForStockUpdates(this.product.id);
		}
	}

	ngOnDestroy(): void {
		if (this.stockUpdateSubscription) {
			this.stockUpdateSubscription.unsubscribe();
		}
	}

	listenForStockUpdates(productId: number): void {
		this.stockUpdateSubscription = this.webSocketService.stockUpdate$
			.pipe(
				filter(update => update.productId === productId)
			)
			.subscribe(update => {
				if (this.product) {
					(this.product as ProductWithStock).stock = update.stock;
					console.log(`Real-time stock update for product ${productId}: ${update.stock}`);
				}
			});
	}

	get today(): string {
		return new Date().toISOString().split('T')[0];
	}

	get nextMonth(): string {
		const date = new Date();
		date.setMonth(date.getMonth() + 1);
		return date.toISOString().split('T')[0];
	}
}
