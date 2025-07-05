import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { CheckoutDataService, DeliveryAddress, PaymentData, PersonalData } from '../servicesFE/checkout-data.service';

@Component({
	selector: 'app-step-confirmation',
	standalone: true,
	imports: [CommonModule],
	template: `
		<div class="text-center">
			<div class="mx-auto bg-green-500 rounded-full w-16 h-16 flex items-center justify-center mb-4">
				<svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
			</div>
			<h2 class="text-2xl font-bold mb-2">Confirm your Order</h2>
			<p class="text-gray-400 mb-8">Please review your information before final confirmation.</p>
		</div>

		<div class="space-y-6">
			<div *ngIf="personalData$ | async as personalData">
				<h3 class="font-bold text-md mb-2">Personal Data</h3>
				<div class="p-4 border border-neutral-700 rounded-lg text-gray-300">
					<p>{{ personalData.firstName }} {{ personalData.lastName }}</p>
					<p>{{ personalData.email }}</p>
					<p *ngIf="personalData.phone">{{ personalData.phone }}</p>
				</div>
			</div>
			<div *ngIf="deliveryAddress$ | async as deliveryAddress">
				<h3 class="font-bold text-md mb-2">Delivery Address</h3>
				<div class="p-4 border border-neutral-700 rounded-lg text-gray-300">
					<p>{{ deliveryAddress.street }} {{ deliveryAddress.houseNumber }}</p>
					<p>{{ deliveryAddress.postalCode }} {{ deliveryAddress.city }}</p>
				</div>
			</div>
			<div *ngIf="paymentData$ | async as paymentData">
				<h3 class="font-bold text-md mb-2">Payment Method</h3>
				<div class="p-4 border border-neutral-700 rounded-lg text-gray-300">
					<p class="capitalize">{{ paymentData.selectedMethod }}</p>
					<p *ngIf="paymentData.selectedMethod === 'card' && paymentData.cardholder">
						Cardholder: {{ paymentData.cardholder }}
					</p>
				</div>
			</div>
		</div>
	`
})
export class StepConfirmationComponent implements OnInit {
	private checkoutDataService = inject(CheckoutDataService);

	personalData$!: Observable<PersonalData | null>;
	deliveryAddress$!: Observable<DeliveryAddress | null>;
	paymentData$!: Observable<PaymentData | null>;

	ngOnInit(): void {
		this.personalData$ = this.checkoutDataService.personalData$;
		this.deliveryAddress$ = this.checkoutDataService.deliveryAddress$;
		this.paymentData$ = this.checkoutDataService.paymentData$;
	}
}
