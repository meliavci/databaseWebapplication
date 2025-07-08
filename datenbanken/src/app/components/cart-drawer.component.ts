import {Component, OnDestroy, OnInit, inject} from '@angular/core';
import {CommonModule, DecimalPipe} from '@angular/common';
import {RouterLink} from '@angular/router';
import {Subscription} from 'rxjs';
import {CartService} from '../servicesFE/cart.service';
import {AuthService} from '../servicesFE/authFE';

@Component({
	selector: 'app-cart-drawer',
	standalone: true,
	imports: [CommonModule, RouterLink, DecimalPipe],
	template: `
		<!-- Backdrop -->
		<div *ngIf="isOpen" (click)="close()"
				 class="fixed inset-0 bg-black/50 backdrop-blur-sm z-55 transition-opacity"
				 [ngClass]="{'opacity-100': isOpen, 'opacity-0': !isOpen}">
		</div>

		<div
			class="fixed top-0 right-0 h-full w-full max-w-md bg-neutral-900 text-white shadow-2xl transform transition-transform duration-300 ease-in-out z-60"
			[ngClass]="{'translate-x-0': isOpen, 'translate-x-full': !isOpen}">

			<div class="flex flex-col h-full p-3">
				<!-- Header -->
				<div class="flex justify-between items-center p-4 border-b border-neutral-700">
					<h2 class="text-xl font-semibold">Your Cart</h2>
					<button (click)="close()" class="text-gray-400 hover:text-white">&times;</button>
				</div>

				<div class="flex-grow overflow-y-auto p-4">
					<div *ngIf="!isLoggedIn" class="text-center text-gray-400 py-10">
						<p>Please <a routerLink="/signIn" (click)="close()" class="text-blue-400 hover:underline">sign in</a> to view your cart.</p>
					</div>

					<div *ngIf="isLoggedIn && isLoading" class="text-center text-gray-400 py-10">
						<p>Loading cart...</p>
					</div>

					<div *ngIf="isLoggedIn && !isLoading && cartItems.length === 0" class="text-center text-gray-400 py-10">
						<p>Your cart is empty.</p>
					</div>

					<ul *ngIf="isLoggedIn && cartItems.length > 0" class="space-y-4">
						<li *ngFor="let item of cartItems" class="flex items-start space-x-4">
							<img [src]="item.image_url" alt="{{ item.name }}" class="w-16 h-16 object-cover rounded-md">
							<div class="flex-grow">
								<p class="font-semibold">{{ item.name }}</p>
								<p class="text-sm text-gray-400">
									{{ item.rental_start_date | date:'dd.MM.yy' }} - {{ item.rental_end_date | date:'dd.MM.yy' }}
								</p>
								<p class="text-sm font-medium">{{ item.monthly_price | number:'1.2-2' }}€ / month</p>
							</div>
							<div class="text-right">
								<p class="font-semibold">{{ calculateItemTotal(item) | number:'1.2-2' }}€</p>
								<button (click)="removeItem(item.id)"
												class="text-xs text-gray-400 hover:text-red-300 hover:underline mt-1">
									Remove
								</button>
							</div>
						</li>
					</ul>
				</div>

				<div *ngIf="isLoggedIn && cartItems.length > 0" class="p-4 border-t border-neutral-700">
					<div class="flex justify-between items-center mb-4">
						<span class="text-lg font-semibold">Total</span>
						<span class="text-xl font-bold">{{ total | number:'1.2-2' }}€</span>
					</div>
					<a routerLink="/checkout" (click)="close()"
						 class="w-full block text-center bg-white text-black font-semibold py-2 rounded-full hover:bg-gray-200 transition-colors">
						Checkout
					</a>
				</div>
			</div>
		</div>
	`
})
export class CartDrawerComponent implements OnInit, OnDestroy {
	isOpen = false;
	isLoading = false;
	isLoggedIn = false;
	cartItems: any[] = [];
	total = 0;

	private cartService = inject(CartService);
	private authService = inject(AuthService);
	private subscriptions = new Subscription();

	ngOnInit(): void {
		const authSub = this.authService.isLoggedIn$.subscribe(isLoggedIn => {
			this.isLoggedIn = isLoggedIn;
			if (isLoggedIn) {
				this.loadCart();
			} else {
				this.cartItems = [];
				this.calculateTotal();
			}
		});

		const openSub = this.cartService.openCart$.subscribe(() => this.open());
		const updateSub = this.cartService.cartUpdated$.subscribe(() => this.loadCart());

		this.subscriptions.add(authSub);
		this.subscriptions.add(openSub);
		this.subscriptions.add(updateSub);
	}

	ngOnDestroy(): void {
		this.subscriptions.unsubscribe();
	}

	open(): void {
		this.isOpen = true;
		if (this.isLoggedIn) {
			this.loadCart();
		}
	}

	close(): void {
		this.isOpen = false;
	}

	loadCart(): void {
		if (!this.isLoggedIn) return;

		this.isLoading = true;
		this.cartService.getCart().subscribe({
			next: (data) => {
				this.cartItems = data.items || [];
				this.calculateTotal();
				this.isLoading = false;
			},
			error: (err) => {
				console.error('Failed to load cart', err);
				this.cartItems = [];
				this.calculateTotal();
				this.isLoading = false;
			}
		});
	}

	removeItem(itemId: number): void {
		this.cartService.removeItemFromCart(itemId).subscribe({
			next: () => {
			},
			error: (err) => console.error('Failed to remove item', err)
		});
	}

	calculateItemTotal(item: any): number {
		const startDate = new Date(item.rental_start_date);
		const endDate = new Date(item.rental_end_date);
		let months = (endDate.getFullYear() - startDate.getFullYear()) * 12 + (endDate.getMonth() - startDate.getMonth());
		if (months === 0 && startDate < endDate) {
			months = 1;
		}
		if (months <= 0) {
			months = 1;
		}
		return (item.monthly_price * months) * item.quantity;
	}

	private calculateTotal(): void {
		this.total = this.cartItems.reduce((sum, item) => sum + this.calculateItemTotal(item), 0);
	}
}
