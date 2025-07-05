import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface CartItem {
	id?: number;
	name: string;
	image: string;
	quantity: number;
	rentalPeriod: string;
	price: number;
}

@Component({
	selector: 'app-order-summary',
	standalone: true,
	imports: [CommonModule],
	template: `
		<div class="p-6 rounded-lg border border-neutral-700">
			<h2 class="text-xl font-bold mb-4">Order Summary</h2>
			<div class="space-y-4 max-h-80 overflow-y-auto pr-2">
				<div *ngFor="let item of items" class="flex items-center space-x-4">
					<img [src]="item.image" alt="{{ item.name }}" class="w-16 h-16 object-cover rounded-md">
					<div class="flex-grow">
						<p class="font-semibold">{{ item.name }}</p>
						<p class="text-sm text-gray-400">Qty: {{ item.quantity }}</p>
						<p class="text-sm text-gray-400">{{ item.rentalPeriod }}</p>
					</div>
					<p class="font-semibold">{{ item.price * item.quantity | currency:'EUR' }}</p>
				</div>
			</div>
			<div class="mt-6 pt-4 border-t border-neutral-700 space-y-2">
				<div class="flex justify-between">
					<span>Subtotal</span>
					<span>{{ subtotal | currency:'EUR' }}</span>
				</div>
				<div class="flex justify-between">
					<span>VAT (19%)</span>
					<span>{{ vat | currency:'EUR' }}</span>
				</div>
				<div class="flex justify-between font-bold text-lg">
					<span>Total</span>
					<span>{{ total | currency:'EUR' }}</span>
				</div>
			</div>
		</div>
	`
})
export class OrderSummaryComponent {
	@Input() items: CartItem[] = [];
	@Input() subtotal: number = 0;
	@Input() vat: number = 0;
	@Input() total: number = 0;
}
