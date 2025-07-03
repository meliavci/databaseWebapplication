import { Component } from '@angular/core';

@Component({
	selector: 'app-step-confirmation',
	standalone: true,
	template: `
		<div class="text-center">
			<div class="mx-auto bg-green-500 rounded-full w-16 h-16 flex items-center justify-center mb-4">
				<svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
			</div>
			<h2 class="text-2xl font-bold mb-2">Confirm your Order</h2>
			<p class="text-gray-400 mb-8">Please review your information before final confirmation.</p>
		</div>

		<div class="space-y-6">
			<div>
				<h3 class="font-bold text-md mb-2">Personal Data</h3>
				<div class="p-4 border border-neutral-700 rounded-lg text-gray-300">
					<p>Max Mustermann</p>
					<p>max.mustermannemail.com</p>
					<p>+49 123 4567890</p>
				</div>
			</div>
			<div>
				<h3 class="font-bold text-md mb-2">Delivery Address</h3>
				<div class="p-4 border border-neutral-700 rounded-lg text-gray-300">
					<p>Musterstraße 12</p>
					<p>12345 Musterstadt, Germany</p>
				</div>
			</div>
			<div>
				<h3 class="font-bold text-md mb-2">Payment Method</h3>
				<div class="p-4 border border-neutral-700 rounded-lg text-gray-300">
					<p>Credit Card</p>
				</div>
			</div>
		</div>
	`
})
export class StepConfirmationComponent {}
