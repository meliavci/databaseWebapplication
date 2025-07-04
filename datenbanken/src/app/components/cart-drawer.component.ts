import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { CartService } from '../servicesFE/cart.service';
import { Subscription } from 'rxjs';

interface CartItem {
	id: number;
	name: string;
	image: string;
	rentalPeriod: string;
	price: number;
}

@Component({
	selector: 'app-cart-drawer',
	standalone: true,
	imports: [CommonModule, RouterLink],
	template: `
		<div *ngIf="isOpen" (click)="close()" class="fixed inset-0 bg-black/30 backdrop-blur-sm z-55"></div>
		<div
			[@slideInOut]="isOpen ? 'in' : 'out'"
			class="fixed top-0 right-0 w-full max-w-md h-full bg-neutral-950 text-white shadow-lg z-60 flex flex-col"
		>
			<header class="flex items-center justify-between px-8 py-8 border-b border-neutral-700">
				<h2 class="text-xl font-semibold">Your Cart</h2>
				<button (click)="close()" class="text-gray-400 hover:text-white">
					<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
					</svg>
				</button>
			</header>

			<div class="flex-1 overflow-y-auto p-4">
				<div *ngIf="cartItems.length === 0" class="text-center text-gray-400 py-10">
					<p>Your cart is empty.</p>
				</div>

				<div *ngFor="let item of cartItems" class="flex items-center gap-4 mb-4 p-2 rounded-lg hover:bg-neutral-800">
					<img [src]="item.image" alt="{{ item.name }}" class="w-16 h-16 rounded-md object-cover">
					<div class="flex-1">
						<p class="font-semibold">{{ item.name }}</p>
						<p class="text-sm text-gray-400">{{ item.rentalPeriod }}</p>
					</div>
					<div class="text-right">
						<p class="font-semibold">{{ item.price | currency:'EUR':'symbol':'1.2-2':'de-DE' }}</p>
						<button (click)="removeItem(item.id)" class="text-xs text-gray-400 hover:text-red-300">Remove</button>
					</div>
				</div>
			</div>

			<footer *ngIf="cartItems.length > 0" class="p-4 border-t border-neutral-700">
				<div class="flex justify-between items-center mb-4">
					<span class="text-gray-400">Total</span>
					<span class="font-semibold">{{ subtotal | currency:'EUR':'symbol':'1.2-2':'de-DE' }}</span>
				</div>
				<a routerLink="/checkout" (click)="close()"
					 class="w-full block text-center bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 rounded-full">
					Checkout
				</a>
			</footer>
		</div>
	`,
	styles: [`
		:host {
			display: block;
		}
	`],
	animations: [
		trigger('slideInOut', [
			state('out', style({ transform: 'translateX(100%)' })),
			state('in', style({ transform: 'translateX(0)' })),
			transition('out => in', animate('300ms ease-in-out')),
			transition('in => out', animate('300ms ease-in-out'))
		])
	]
})
export class CartDrawerComponent implements OnInit, OnDestroy {
	isOpen = false;
	cartItems: CartItem[] = [];
	subtotal = 0;

	private cartSubscription: Subscription;

	constructor(private cartService: CartService) {
		this.cartSubscription = this.cartService.openCart$.subscribe(() => {
			this.open();
		});
	}

	ngOnInit(): void {
		this.loadCartItems();
	}

	ngOnDestroy(): void {
		this.cartSubscription.unsubscribe();
	}

	open(): void {
		this.isOpen = true;
	}

	close(): void {
		this.isOpen = false;
	}

	loadCartItems(): void {
		this.cartItems = [
			{ id: 1, name: 'Apple AirPods Pro 2nd Gen', image: 'https://placehold.co/100x100/1a1a1a/FFF', rentalPeriod: '1 Month', price: 19.00 },
			{ id: 2, name: 'PlayStation 5', image: 'https://placehold.co/100x100/1a1a1a/FFF', rentalPeriod: '1 Month', price: 45.00 },
			{ id: 3, name: 'Canon EOS R6', image: 'https://placehold.co/100x100/1a1a1a/FFF', rentalPeriod: '1 Month', price: 35.00 },
			{ id: 4, name: 'Samsung Galaxy S21', image: 'https://placehold.co/100x100/1a1a1a/FFF', rentalPeriod: '1 Month', price: 30.00 },
			{ id: 5, name: 'Dell XPS 13', image: 'https://placehold.co/100x100/1a1a1a/FFF', rentalPeriod: '1 Month', price: 50.00 },
			{ id: 6, name: 'Bose QuietComfort 35 II', image: 'https://placehold.co/100x100/1a1a1a/FFF', rentalPeriod: '1 Month', price: 25.00 },
			{ id: 7, name: 'Nintendo Switch', image: 'https://placehold.co/100x100/1a1a1a/FFF', rentalPeriod: '1 Month', price: 40.00 },
			{ id: 8, name: 'Fitbit Charge 5', image: 'https://placehold.co/100x100/1a1a1a/FFF', rentalPeriod: '1 Month', price: 20.00 },
			{ id: 9, name: 'GoPro HERO10', image: 'https://placehold.co/100x100/1a1a1a/FFF', rentalPeriod: '1 Month', price: 30.00 },
			{ id: 10, name: 'Apple Watch Series 7', image: 'https://placehold.co/100x100/1a1a1a/FFF', rentalPeriod: '1 Month', price: 35.00 }
		];
		this.calculateSubtotal();
	}

	removeItem(itemId: number): void {
		this.cartItems = this.cartItems.filter(item => item.id !== itemId);
		this.calculateSubtotal();
	}

	calculateSubtotal(): void {
		this.subtotal = this.cartItems.reduce((acc, item) => acc + item.price, 0);
	}
}
