import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CheckoutDataService } from '../servicesFE/checkout-data.service';
import { tap } from 'rxjs/operators';

@Component({
	selector: 'app-step-payment',
	standalone: true,
	imports: [CommonModule, ReactiveFormsModule],
	template: `
		<h2 class="text-xl font-bold mb-6 flex items-center gap-3">
			<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>
			Payment
		</h2>

		<div>
			<label class="block text-sm font-medium text-gray-300 mb-2">Payment Method</label>
			<div class="grid grid-cols-3 gap-4 mb-6">
				<div (click)="selectPayment('card')" class="cursor-pointer p-2 rounded-lg text-center border-2" [ngClass]="{'border-white': selectedMethod === 'card', 'border-neutral-700 hover:bg-neutral-700': selectedMethod !== 'card'}">Credit Card</div>
				<div (click)="selectPayment('paypal')" class="cursor-pointer p-2 rounded-lg text-center border-2" [ngClass]="{'border-white': selectedMethod === 'paypal', 'border-neutral-700 hover:bg-neutral-700': selectedMethod !== 'paypal'}">PayPal</div>
				<div (click)="selectPayment('klarna')" class="cursor-pointer p-2 rounded-lg text-center border-2" [ngClass]="{'border-white': selectedMethod === 'klarna', 'border-neutral-700 hover:bg-neutral-700': selectedMethod !== 'klarna'}">Klarna</div>
			</div>
		</div>

		<form [formGroup]="paymentForm">
			<div *ngIf="selectedMethod === 'card'" class="space-y-4">
				<div>
					<label for="cardholder" class="block text-sm font-medium text-gray-300 mb-1">Cardholder Name *</label>
					<input type="text" id="cardholder" formControlName="cardholder" class="w-full border border-neutral-700 rounded-md p-2 focus:ring-primary-500 focus:border-primary-500 text-gray-400 px-5" placeholder="Enter cardholder name">
				</div>
				<div>
					<label for="cardnumber" class="block text-sm font-medium text-gray-300 mb-1">Card Number *</label>
					<input type="text" id="cardnumber" formControlName="cardnumber" class="w-full border border-neutral-700 rounded-md p-2 focus:ring-primary-500 focus:border-primary-500 text-gray-400 px-5" placeholder="Enter card number" maxlength="19">
				</div>
				<div class="grid grid-cols-2 gap-4">
					<div>
						<label for="expiry" class="block text-sm font-medium text-gray-300 mb-1">Expiration Date *</label>
						<input type="text" id="expiry" formControlName="expiry" class="w-full border border-neutral-700 rounded-md p-2 focus:ring-primary-500 focus:border-primary-500 text-gray-400 px-5" placeholder="MM/YY" maxlength="7">
					</div>
					<div>
						<label for="cvv" class="block text-sm font-medium text-gray-300 mb-1">CVV *</label>
						<input type="text" id="cvv" formControlName="cvv" class="w-full border border-neutral-700 rounded-md p-2 focus:ring-primary-500 focus:border-primary-500 text-gray-400 px-5" placeholder="Enter CVV" maxlength="4">
					</div>
				</div>
			</div>
		</form>

		<div *ngIf="selectedMethod === 'paypal'" class="text-center p-8 border border-neutral-700 rounded-lg">
			You will be redirected to PayPal to complete your payment.
		</div>

		<div *ngIf="selectedMethod === 'klarna'" class="text-center p-8 border border-neutral-700 rounded-lg">
			You will be redirected to Klarna to complete your payment.
		</div>
	`
})
export class StepPaymentComponent implements OnInit {
	@Output() validityChange = new EventEmitter<boolean>();
	selectedMethod: "card" | "paypal" | "klarna" = 'card';
	paymentForm: FormGroup;
	private fb = inject(FormBuilder);
	private checkoutDataService = inject(CheckoutDataService);

	constructor() {
		this.paymentForm = this.fb.group({
			cardholder: ['', Validators.required],
			cardnumber: ['', Validators.required],
			expiry: ['', Validators.required],
			cvv: ['', Validators.required]
		});
	}

	ngOnInit(): void {
		this.paymentForm.statusChanges.subscribe(status => {
			this.validityChange.emit(status === 'VALID');
		});

		this.paymentForm.valueChanges.pipe(
			tap(value => {
				if (this.paymentForm.valid) {
					this.updatePaymentData();
				}
			})
		).subscribe();

		this.updatePaymentData();
		this.validityChange.emit(this.paymentForm.valid);
	}

	selectPayment(method: 'card' | 'paypal' | 'klarna'): void {
		this.selectedMethod = method;
		const cardControls = ['cardholder', 'cardnumber', 'expiry', 'cvv'];

		if (method === 'card') {
			cardControls.forEach(controlName => {
				this.paymentForm.get(controlName)?.setValidators(Validators.required);
			});
		} else {
			cardControls.forEach(controlName => {
				this.paymentForm.get(controlName)?.clearValidators();
			});
		}

		cardControls.forEach(controlName => {
			this.paymentForm.get(controlName)?.updateValueAndValidity();
		});

		this.updatePaymentData();
		this.validityChange.emit(this.paymentForm.valid);
	}

	private updatePaymentData(): void {
		const data = {
			selectedMethod: this.selectedMethod,
			cardholder: this.paymentForm.get('cardholder')?.value
		};
		this.checkoutDataService.setPaymentData(data);
	}
}
