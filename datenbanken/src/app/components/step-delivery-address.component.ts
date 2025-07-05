import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CheckoutDataService } from '../servicesFE/checkout-data.service';
import { debounceTime, tap } from 'rxjs/operators';

@Component({
	selector: 'app-step-delivery-address',
	standalone: true,
	imports: [CommonModule, ReactiveFormsModule],
	template: `
		<h2 class="text-xl font-bold mb-6 flex items-center gap-3">
			<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
			Delivery Address
		</h2>
		<form [formGroup]="deliveryAddressForm" class="space-y-4">
			<div class="grid grid-cols-3 gap-4">
				<div class="col-span-2">
					<label for="street" class="block text-sm font-medium text-gray-300 mb-1">Street *</label>
					<input type="text" id="street" formControlName="street" class="w-full border border-neutral-700 rounded-md p-2 focus:ring-primary-500 focus:border-primary-500 text-gray-400 px-5" placeholder="Enter your street name">
				</div>
				<div>
					<label for="housenumber" class="block text-sm font-medium text-gray-300 mb-1">House Number *</label>
					<input type="text" id="housenumber" formControlName="houseNumber" class="w-full border border-neutral-700 rounded-md p-2 focus:ring-primary-500 focus:border-primary-500 text-gray-400 px-5" placeholder="Enter your house number">
				</div>
			</div>
			<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div>
					<label for="postalcode" class="block text-sm font-medium text-gray-300 mb-1">Postal Code *</label>
					<input type="text" id="postalcode" formControlName="postalCode" class="w-full border border-neutral-700 rounded-md p-2 focus:ring-primary-500 focus:border-primary-500 text-gray-400 px-5" placeholder="Enter your postal code">
				</div>
				<div>
					<label for="city" class="block text-sm font-medium text-gray-300 mb-1">City *</label>
					<input type="text" id="city" formControlName="city" class="w-full border border-neutral-700 rounded-md p-2 focus:ring-primary-500 focus:border-primary-500 text-gray-400 px-5" placeholder="Enter your city">
				</div>
			</div>

			<div class="pt-4">
				<label for="delivery" class="block text-sm font-medium text-gray-300 mb-1">Delivery Options</label>
				<select id="delivery" class="w-full border border-neutral-700 rounded-md p-2 text-gray-400">
					<option>Standard (2-3 workdays) - Free</option>
					<option>Express (1 workday) - Free</option>
				</select>
			</div>
		</form>
	`
})
export class StepDeliveryAddressComponent implements OnInit {
	@Output() validityChange = new EventEmitter<boolean>();
	deliveryAddressForm: FormGroup;
	private fb = inject(FormBuilder);
	private checkoutDataService = inject(CheckoutDataService);

	constructor() {
		this.deliveryAddressForm = this.fb.group({
			street: ['', Validators.required],
			houseNumber: ['', Validators.required],
			postalCode: ['', Validators.required],
			city: ['', Validators.required]
		});
	}

	ngOnInit(): void {
		this.deliveryAddressForm.statusChanges.subscribe(status => {
			this.validityChange.emit(status === 'VALID');
		});

		this.deliveryAddressForm.valueChanges.pipe(
			debounceTime(300),
			tap(value => {
				if (this.deliveryAddressForm.valid) {
					this.checkoutDataService.setDeliveryAddress(value);
				}
			})
		).subscribe();

		this.validityChange.emit(this.deliveryAddressForm.valid);
	}
}
