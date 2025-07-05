import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Router, RouterLink} from '@angular/router';
import { CheckoutProgressComponent } from '../../components/checkout-progress.component';
import { OrderSummaryComponent, CartItem } from '../../components/order-summary.component';
import { StepPersonalDataComponent } from '../../components/step-personal-data.component';
import { StepDeliveryAddressComponent } from '../../components/step-delivery-address.component';
import { StepPaymentComponent } from '../../components/step-payment.component';
import { StepConfirmationComponent } from '../../components/step-confirmation.component';
import { CartService } from '../../servicesFE/cart.service';
import { CheckoutDataService, DeliveryAddress, PersonalData, PaymentData } from '../../servicesFE/checkout-data.service';
import {OrderService} from '../../servicesFE/order.service';

@Component({
	selector: 'app-checkout',
	standalone: true,
	imports: [
		CommonModule,
		RouterLink,
		CheckoutProgressComponent,
		OrderSummaryComponent,
		StepPersonalDataComponent,
		StepDeliveryAddressComponent,
		StepPaymentComponent,
		StepConfirmationComponent,
	],
	template: `
		<div class="bg-neutral-950 text-white min-h-screen">
			<main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
				<div class="mb-8">
					<a routerLink="/category"
						 class="text-white hover:text-primary-400 transition-colors duration-200 flex flex-row gap-2 items-center justify-start">
						<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M15 19l-7-7 7-7" stroke="currentColor" stroke-width="2" stroke-linecap="round"
										stroke-linejoin="round"/>
						</svg>
						<span>Continue shopping</span>
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
									<app-step-personal-data *ngSwitchCase="1" (validityChange)="onStepValidityChange($event)"></app-step-personal-data>
									<app-step-delivery-address *ngSwitchCase="2" (validityChange)="onStepValidityChange($event)"></app-step-delivery-address>
									<app-step-payment *ngSwitchCase="3" (validityChange)="onStepValidityChange($event)"></app-step-payment>
									<app-step-confirmation *ngSwitchCase="4"></app-step-confirmation>
								</div>
							</div>
						</div>

						<div class="mt-8 flex" [ngClass]="currentCheckoutStep > 1 ? 'justify-between' : 'justify-end'">
							<button *ngIf="currentCheckoutStep > 1" (click)="prevStep()" class="px-8 py-3 bg-neutral-700 text-white rounded-md hover:bg-neutral-600 transition-colors cursor-pointer">
								Back
							</button>
							<button (click)="isLastStep() ? placeOrder() : nextStep()"
											[disabled]="!isCurrentStepValid"
											class="px-8 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-500 transition-colors disabled:bg-neutral-500 disabled:cursor-not-allowed cursor-pointer">
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
		</div>
	`
})
export class CheckoutComponent implements OnInit {
	public currentCheckoutStep: number = 1;
	public cartItems: CartItem[] = [];
	public subtotal: number = 0;
	public vat: number = 0;
	public total: number = 0;
	public isCurrentStepValid: boolean = false;

	private cartService = inject(CartService);

	private checkoutDataService = inject(CheckoutDataService);
	private orderService = inject(OrderService);
	private router = inject(Router);

	private cartData: any = null;
	private personalData: PersonalData | null = null;
	private deliveryAddress: DeliveryAddress | null = null;
	private paymentData: PaymentData | null = null;

	ngOnInit(): void {
		this.loadCart();
		this.checkoutDataService.personalData$.subscribe(data => this.personalData = data);
		this.checkoutDataService.deliveryAddress$.subscribe(data => this.deliveryAddress = data);
		this.checkoutDataService.paymentData$.subscribe(data => this.paymentData = data);
	}

	placeOrder(): void {
		if (!this.cartData || !this.deliveryAddress || !this.personalData || !this.paymentData) {
			alert("Please complete all checkout steps.");
			return;
		}

		const orderPayload = {
			cart: this.cartData,
			deliveryAddress: this.deliveryAddress,
			personalData: this.personalData,
			paymentData: this.paymentData,
			total: this.total
		};

		this.orderService.createOrder(orderPayload).subscribe({
			next: (response) => {
				alert(`Order placed successfully! Order ID: ${response.orderId}`);
				this.cartService.notifyCartUpdate();
				this.router.navigate(['/']);
			},
			error: (err) => {
				console.error("Failed to place order", err);
				alert(`Error: ${err.error.error || 'Could not place order.'}`);
			}
		});
	}

	onStepValidityChange(isValid: boolean): void {
		this.isCurrentStepValid = isValid;
	}

	loadCart(): void {
		this.cartService.getCart().subscribe(cart => {
			this.cartData = cart;
			this.cartItems = cart.items.map((item: any) => ({
				id: item.id,
				name: item.name,
				image: item.image_url,
				quantity: item.quantity,
				rentalPeriod: this.calculateRentalPeriod(item.rental_start_date, item.rental_end_date),
				price: item.monthly_price
			}));
			this.calculateTotals();
		});
	}

	calculateRentalPeriod(start: string, end: string): string {
		if (!start || !end) return '1 Month';
		const startDate = new Date(start);
		const endDate = new Date(end);
		let months = (endDate.getFullYear() - startDate.getFullYear()) * 12;
		months -= startDate.getMonth();
		months += endDate.getMonth();
		if (months <= 0) {
			return '1 Month';
		}
		return `${months} Month${months > 1 ? 's' : ''}`;
	}

	calculateTotals(): void {
		this.subtotal = this.cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
		this.vat = this.subtotal * 0.19; // 19% VAT
		this.total = this.subtotal + this.vat;
	}

	nextStep(): void {
		if (this.currentCheckoutStep < 4 && this.isCurrentStepValid) {
			this.currentCheckoutStep++;
			const stepsWithForms = [1, 2, 3];
			this.isCurrentStepValid = !stepsWithForms.includes(this.currentCheckoutStep);
			window.scrollTo(0, 0);
		}
	}

	prevStep(): void {
		if (this.currentCheckoutStep > 1) {
			this.currentCheckoutStep--;
			this.isCurrentStepValid = true;
			window.scrollTo(0, 0);
		}
	}

	isLastStep(): boolean {
		return this.currentCheckoutStep === 4;
	}
}
