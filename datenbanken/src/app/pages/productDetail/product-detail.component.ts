import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {AddToCartButtonComponent} from '../../components/add-to-cart-button.component';
import {FormsModule} from '@angular/forms';
import {DecimalPipe, NgClass, NgForOf, NgIf} from '@angular/common';
import {ActivatedRoute} from '@angular/router';
import {ProductService, ProductWithStock} from '../../servicesFE/product.service';
import {WebSocketService} from '../../servicesFE/websocket.service';
import {filter, Subscription} from 'rxjs';
import {AuthService} from "../../servicesFE/authFE";


@Component({
	selector: "app-product-detail",
	standalone: true,
	imports: [
		AddToCartButtonComponent,
		FormsModule,
		NgIf,
		NgForOf,
		NgClass,
		DecimalPipe
	],
	template: `
		<div *ngIf="product" class="bg-neutral-950 text-white min-h-screen">
			<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
				<div class="grid grid-cols-1 md:grid-cols-2 gap-12">
					<!-- Image Column -->
					<div class="flex justify-center items-start">
						<div class="bg-neutral-900 rounded-xl p-18">
							<img [src]="product.image_url || '/Product1.png'" [alt]="product.name"
									 class="max-w-full h-auto object-contain rounded-lg">
						</div>
					</div>

					<div>
						<div
							class="inline-block text-sm text-gray-300 mb-2 border-blue-500 rounded-full px-2 border">{{ product.category }}
						</div>
						<h1 class="text-4xl font-bold mb-4">{{ product.name }}</h1>
						<p class="text-gray-300 text-md mb-6">{{ product.description }}</p>

						<div class="bg-neutral-900 rounded-xl p-6 mb-6">
							<h2 class="text-xl font-semibold mb-4">Choose your rental plan</h2>
							<div class="space-y-3">
								<div *ngFor="let option of rentalOptions"
										 (click)="selectedOption = option"
										 [ngClass]="{'border-blue-500 bg-neutral-800': selectedOption === option, 'border-neutral-700': selectedOption !== option}"
										 class="flex justify-between items-center py-2 px-4 border rounded-lg cursor-pointer transition-all">
									<div>
										<span class="font-medium">{{ option.label }}</span>
										<span *ngIf="option.discount > 0"
													class="ml-2 text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full">
                      Save {{ option.discount * 100 }}%
                    </span>
									</div>
									<div class="text-right">
										<p class="font-semibold">{{ (basePrice * (1 - option.discount)) | number:'1.2-2' }}€ / month</p>
										<p *ngIf="option.months > 1" class="text-sm text-gray-400">
											Total {{ (basePrice * (1 - option.discount) * option.months) | number:'1.2-2' }}€
										</p>
									</div>
								</div>
							</div>
						</div>

						<div class="flex items-center justify-between mb-6">
							<div class="text-3xl font-bold">
								{{ totalPrice | number:'1.2-2' }}€
								<span class="text-base font-normal text-gray-400">total price</span>
							</div>
							<div class="text-sm mb-6"
									 [ngClass]="{'text-green-400': product.stock > 0, 'text-red-400': product.stock === 0}">
								<ng-container *ngIf="product.stock > 0; else outOfStock">
									In Stock: {{ product.stock }} items
								</ng-container>
								<ng-template #outOfStock>
									Out of Stock
								</ng-template>
							</div>
						</div>

						<app-add-to-cart-button
							[productId]="product.id"
							[monthlyPrice]="discountedMonthlyPrice"
							[rentalStartDate]="getRentalStartDate()"
							[rentalEndDate]="getRentalEndDate()"
							[product]="product">
						</app-add-to-cart-button>
					</div>
				</div>
			</div>
		</div>
	`
})
export class ProductDetailComponent implements OnInit, OnDestroy {
	product: ProductWithStock | null = null;
	basePrice: number = 0;

	private route = inject(ActivatedRoute);
	private productService = inject(ProductService);
	private webSocketService = inject(WebSocketService);
	private authService = inject(AuthService);
	private stockUpdateSubscription: Subscription | undefined;

	rentalOptions = [
		{value: '1 month', label: '1 Month', months: 1, discount: 0},
		{value: '3 months', label: '3 Months', months: 3, discount: 0.05},
		{value: '6 months', label: '6 Months', months: 6, discount: 0.10},
		{value: '12 months', label: '12 Months', months: 12, discount: 0.15}
	];
	selectedOption = this.rentalOptions[0];

	ngOnInit(): void {
		const token = this.authService.getToken();
		if (token) {
			this.webSocketService.connect(token);
		}

		const productId = this.route.snapshot.paramMap.get('id');
		if (productId) {
			this.productService.getProduct(+productId).subscribe({
				next: (product: ProductWithStock) => {
					this.product = product;
					this.basePrice = product.price_per_month;
					this.listenForStockUpdates(+productId);
				},
				error: (err) => {
					console.error('Failed to load product', err);
					this.product = null;
				}
			});
		}
	}

	ngOnDestroy(): void {
		if (this.stockUpdateSubscription) {
			this.stockUpdateSubscription.unsubscribe();
		}
		this.webSocketService.disconnect();
	}

	listenForStockUpdates(productId: number): void {
		this.stockUpdateSubscription = this.webSocketService.stockUpdate$
			.pipe(
				filter(update => update.productId === productId)
			)
			.subscribe(update => {
				if (this.product) {
					this.product.stock = update.stock;
					console.log(`Real-time stock update for product ${productId}: ${update.stock}`);
				}
			});
	}

	get discountedMonthlyPrice(): number {
		if (!this.product) return 0;
		return this.basePrice * (1 - this.selectedOption.discount);
	}

	get totalPrice(): number {
		return this.discountedMonthlyPrice * this.selectedOption.months;
	}

	private formatDate(date: Date): string {
		return date.toISOString().split('T')[0];
	}

	getRentalStartDate(): string {
		return this.formatDate(new Date());
	}

	getRentalEndDate(): string {
		const startDate = new Date();
		const endDate = new Date(startDate.setMonth(startDate.getMonth() + this.selectedOption.months));
		return this.formatDate(endDate);
	}
}
