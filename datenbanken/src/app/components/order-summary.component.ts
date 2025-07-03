import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface CartItem {
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
		<div class="p-6 rounded-lg h-fit border border-neutral-700">
			<h3 class="text-xl font-bold mb-4">Order Summary</h3>

			<div class="space-y-4 mb-6 max-h-55 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
				<div *ngFor="let item of items" class="flex gap-4">
					<img [src]="item.image" alt="{{ item.name }}" class="w-16 h-16 rounded-md object-cover">
					<div>
						<p class="font-semibold">{{ item.name }}</p>
						<p class="text-sm text-gray-400">{{ item.quantity }}x • {{ item.rentalPeriod }}</p>
						<p class="font-semibold">{{ item.price | number:'1.2-2' }} €</p>
					</div>
				</div>
			</div>

			<div class="border-t border-gray-700 pt-4 space-y-2">
				<div class="flex justify-between text-gray-300 text-sm">
					<span>Subtotal:</span>
					<span>{{ subtotal | number:'1.2-2' }} €</span>
				</div>
				<div class="flex justify-between text-gray-300 text-sm">
					<span>VAT (19%):</span>
					<span>{{ vat | number:'1.2-2' }} €</span>
				</div>
				<div class="flex justify-between text-white font-bold text-lg">
					<span>Total:</span>
					<span>{{ total | number:'1.2-2' }} €</span>
				</div>
			</div>

			<div class="border-t border-gray-700 mt-6 pt-6 space-y-3">
				<div class="flex items-center gap-3 text-sm">
					<svg class="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
					<span>Free shipping & returns</span>
				</div>
				<div class="flex items-center gap-3 text-sm">
					<svg class="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
					<span>Full insurance included</span>
				</div>
				<div class="flex items-center gap-3 text-sm">
					<svg class="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
					<span>Flexible rental without minimum term</span>
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
