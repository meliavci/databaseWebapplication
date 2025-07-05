import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CheckoutDataService } from '../servicesFE/checkout-data.service';
import { debounceTime, tap } from 'rxjs/operators';

@Component({
	selector: 'app-step-personal-data',
	standalone: true,
	imports: [CommonModule, ReactiveFormsModule],
	template: `
    <h2 class="text-xl font-bold mb-6 flex items-center gap-3">
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
      Personal Data
    </h2>
    <form [formGroup]="personalDataForm" class="space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label for="firstname" class="block text-sm font-medium text-gray-300 mb-1">First Name *</label>
					<input type="text" id="firstname" formControlName="firstName" class="w-full border border-neutral-700 rounded-md p-2 focus:ring-primary-500 focus:border-primary-500 text-gray-400 px-5" placeholder="Enter your first name">
				</div>
        <div>
          <label for="lastname" class="block text-sm font-medium text-gray-300 mb-1">Last Name *</label>
          <input type="text" id="lastname" formControlName="lastName" class="w-full border border-neutral-700 rounded-md p-2 focus:ring-primary-500 focus:border-primary-500 text-gray-400 px-5" placeholder="Enter your last name">
				</div>
      </div>
      <div>
        <label for="email" class="block text-sm font-medium text-gray-300 mb-1">Email Address *</label>
        <input type="email" id="email" formControlName="email" class="w-full border border-neutral-700 rounded-md p-2 focus:ring-primary-500 focus:border-primary-500 text-gray-400 px-5" placeholder="Enter your email address">
			</div>
      <div>
        <label for="phone" class="block text-sm font-medium text-gray-300 mb-1">Phone Number</label>
        <input type="tel" id="phone" formControlName="phone" class="w-full border border-neutral-700 rounded-md p-2 focus:ring-primary-500 focus:border-primary-500 text-gray-400 px-5" placeholder="Enter your phone number">
			</div>
    </form>
  `
})
export class StepPersonalDataComponent implements OnInit {
	@Output() validityChange = new EventEmitter<boolean>();
	personalDataForm: FormGroup;
	private fb = inject(FormBuilder);
	private checkoutDataService = inject(CheckoutDataService);

	constructor() {
		this.personalDataForm = this.fb.group({
			firstName: ['', Validators.required],
			lastName: ['', Validators.required],
			email: ['', [Validators.required, Validators.email]],
			phone: ['']
		});
	}

	ngOnInit(): void {
		this.personalDataForm.statusChanges.subscribe(status => {
			this.validityChange.emit(status === 'VALID');
		});

		this.personalDataForm.valueChanges.pipe(
			debounceTime(300),
			tap(value => {
				if (this.personalDataForm.valid) {
					this.checkoutDataService.setPersonalData(value);
				}
			})
		).subscribe();

		this.validityChange.emit(this.personalDataForm.valid);
	}
}
