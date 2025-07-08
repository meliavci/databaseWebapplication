import { Component, inject, Input, OnInit } from '@angular/core';
import {CommonModule, NgClass, NgIf} from '@angular/common';
import { CartService } from '../servicesFE/cart.service';
import { AuthService } from '../servicesFE/authFE';
import { Product } from '../../models/product.models';
import { Router } from '@angular/router';
import {ProductService, ProductWithStock} from '../servicesFE/product.service';

@Component({
	selector: 'app-add-to-cart-button',
	standalone: true,
	imports: [
		NgIf,
		NgClass
	],
	template: `
		<button (click)="addItemToCart()"
						[disabled]="isOutOfStock || !isLoggedIn"
						class="w-full px-6 py-2 text-md rounded-full transition-all duration-300 ease-in-out flex items-center justify-center"
						[ngClass]="{
              'bg-blue-600 hover:bg-blue-500 text-white': !isOutOfStock && isLoggedIn,
              'bg-neutral-700 text-neutral-400 cursor-not-allowed': isOutOfStock || !isLoggedIn
            }">
			<span *ngIf="!isOutOfStock">Add to Cart</span>
			<span *ngIf="isOutOfStock">Out of Stock</span>
		</button>
	`
})
export class AddToCartButtonComponent implements OnInit {
	@Input() productId!: number;
	@Input() monthlyPrice!: number;
	@Input() rentalStartDate!: string;
	@Input() rentalEndDate!: string;
	@Input({ required: true }) product!: Product;
	@Input() quantity: number = 1;

	private cartService = inject(CartService);
	private authService = inject(AuthService);
	private router = inject(Router);
	private productService = inject(ProductService);

	isLoggedIn: boolean = false;
	isOutOfStock: boolean = false;

	ngOnInit(): void {
		this.isLoggedIn = this.authService.isLoggedIn();
		this.checkStock();
	}

	checkStock(): void {
		if (this.product && 'stock' in this.product) {
			this.isOutOfStock = (this.product as ProductWithStock).stock <= 0;
		} else {
			// Fallback to fetch stock if not provided
			this.productService.getProduct(this.productId).subscribe({
				next: (productWithStock: ProductWithStock) => {
					this.isOutOfStock = productWithStock.stock <= 0;
				},
				error: (err: any) => {
					console.error('Failed to check product stock', err);
					this.isOutOfStock = true; // Assume out of stock on error
				}
			});
		}
	}

	addItemToCart(): void {
		if (!this.isLoggedIn) {
			this.router.navigate(['/login']);
			return;
		}

		if (!this.productId || this.monthlyPrice === undefined || !this.rentalStartDate || !this.rentalEndDate) {
			console.error('Product details are missing for AddToCartButtonComponent');
			return;
		}

		const item = {
			productId: this.productId,
			quantity: this.quantity,
			monthly_price: this.monthlyPrice,
			rental_start_date: this.rentalStartDate,
			rental_end_date: this.rentalEndDate,
		};

		this.cartService.addToCart(item).subscribe({
			next: (response) => {
				console.log('Item added to cart successfully', response);
			},
			error: (err) => {
				console.error('Failed to add item to cart', err);
			}
		});
	}
}
