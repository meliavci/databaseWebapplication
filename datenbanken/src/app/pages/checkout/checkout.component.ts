import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { HeaderComponent } from '../../components/header.component';
import { FooterComponent } from '../../components/footer.component';
import { CheckoutProgressComponent } from '../../components/checkout-progress.component';
import { OrderSummaryComponent, CartItem } from '../../components/order-summary.component';
import { StepPersonalDataComponent } from '../../components/step-personal-data.component';
import { StepDeliveryAddressComponent } from '../../components/step-delivery-address.component';
import { StepPaymentComponent } from '../../components/step-payment.component';
import { StepConfirmationComponent } from '../../components/step-confirmation.component';

@Component({
	selector: 'app-checkout',
	standalone: true,
	imports: [
		CommonModule,
		RouterLink,
		HeaderComponent,
		FooterComponent,
		CheckoutProgressComponent,
		OrderSummaryComponent,
		StepPersonalDataComponent,
		StepDeliveryAddressComponent,
		StepPaymentComponent,
		StepConfirmationComponent,
	],
	template: `
		<div class="bg-neutral-950 text-white min-h-screen">
			<app-header></app-header>
			<main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
				<div class="mb-8">
					<a routerLink="/cart"
						 class="text-white hover:text-primary-400 transition-colors duration-200 flex flex-row gap-2 items-center justify-start">
						<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M15 19l-7-7 7-7" stroke="currentColor" stroke-width="2" stroke-linecap="round"
										stroke-linejoin="round"/>
						</svg>
						<span>Back to Cart</span>
					</a>
					<h1
						class="text-4xl lg:text-5xl font-bold mt-4 block bg-gradient-to-r from-white to-blue-600 bg-clip-text text-transparent">
						Checkout</h1>
				</div>

				<div class="grid grid-cols-1 lg:grid-cols-3 gap-8 xl:gap-12">

					<div class="lg:col-span-2">
						<app-checkout-progress [currentStep]="currentCheckoutStep" class="mb-8"></app-checkout-progress>

						<div class="mt-8 p-8 rounded-lg text-white border border-neutral-700 flex flex-col">
							<div class="flex-1">
								<div [ngSwitch]="currentCheckoutStep">
									<app-step-personal-data *ngSwitchCase="1"></app-step-personal-data>
									<app-step-delivery-address *ngSwitchCase="2"></app-step-delivery-address>
									<app-step-payment *ngSwitchCase="3"></app-step-payment>
									<app-step-confirmation *ngSwitchCase="4"></app-step-confirmation>
								</div>
							</div>
						</div>

						<div class="mt-8 flex" [ngClass]="currentCheckoutStep > 1 ? 'justify-between' : 'justify-end'">
							<button *ngIf="currentCheckoutStep > 1" (click)="prevStep()" class="px-8 py-3 bg-neutral-700 text-white rounded-md hover:bg-neutral-600 transition-colors">
								Back
							</button>
							<button (click)="isLastStep() ? placeOrder() : nextStep()" class="px-8 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-500 transition-colors">
								{{ isLastStep() ? 'Place Order Now' : 'Next' }}
							</button>
						</div>
					</div>

					<div class="lg:col-span-1">
						<app-order-summary [items]="cartItems" [subtotal]="subtotal" [vat]="vat"
															 [total]="total"></app-order-summary>
					</div>
				</div>

			</main>
			<app-footer></app-footer>
		</div>
	`
})
export class CheckoutComponent {
	public currentCheckoutStep: number = 1;
	public cartItems: CartItem[] = [];
	public subtotal: number = 0;
	public vat: number = 0;
	public total: number = 0;

	constructor() {
		this.setupOrderSummary();
	}

	setupOrderSummary(): void {
		this.cartItems = [
			{ name: 'Apple AirPods Pro 2nd Gen', image: 'https://placehold.co/100x100/1a1a1a/FFF', quantity: 1, rentalPeriod: '1 Month', price: 19.00 },
			{ name: 'PlayStation 5', image: 'https://placehold.co/100x100/1a1a1a/FFF', quantity: 2, rentalPeriod: '1 Month', price: 90.00 },
			{ name: 'Samsung Galaxy S23 Ultra', image: 'https://placehold.co/100x100/1a1a1a/FFF', quantity: 1, rentalPeriod: '1 Month', price: 109.00 },
			{ name: 'Apple MacBook Pro 16" M2', image: 'https://placehold.co/100x100/1a1a1a/FFF', quantity: 1, rentalPeriod: '1 Month', price: 109.00 },
			{ name: 'Dell XPS 13', image: 'https://placehold.co/100x100/1a1a1a/FFF', quantity: 1, rentalPeriod: '1 Month', price: 109.00 },
			{ name: 'Google Pixel 7 Pro', image: 'https://placehold.co/100x100/1a1a1a/FFF', quantity: 1, rentalPeriod: '1 Month', price: 109.00 }
		];
		this.subtotal = 109.00;
		this.vat = 20.71;
		this.total = 129.71;
	}

	nextStep(): void {
		if (this.currentCheckoutStep < 4) {
			this.currentCheckoutStep++;
			console.log(this.currentCheckoutStep);
			window.scrollTo(0, 0);
		}
	}

	prevStep(): void {
		if (this.currentCheckoutStep > 1) {
			this.currentCheckoutStep--;
			window.scrollTo(0, 0);
		}
	}

	isLastStep(): boolean {
		return this.currentCheckoutStep === 4;
	}

	placeOrder(): void {
		alert('Order placed successfully! (This is a demo)');
	}
}
