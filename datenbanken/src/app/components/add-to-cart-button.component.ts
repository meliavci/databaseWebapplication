import { Component, inject, Input } from '@angular/core';
import { CartService } from '../servicesFE/cart.service';

@Component({
	selector: 'app-add-to-cart-button',
	standalone: true,
	template: `
		<button (click)="addItemToCart()"
						class="w-full bg-white text-black font-semibold py-2 rounded-full hover:bg-gray-200 transition-colors duration-300 cursor-pointer">
			Add to Cart
		</button>
	`
})
export class AddToCartButtonComponent {
	@Input() productId!: number;
	@Input() quantity: number = 1;
	@Input() monthlyPrice!: number;
	@Input() rentalStartDate!: string;
	@Input() rentalEndDate!: string;

	private cartService = inject(CartService);

	addItemToCart(): void {
		if (!this.productId || this.monthlyPrice === undefined || !this.rentalStartDate || !this.rentalEndDate) {
			console.error('Product details are missing for AddToCartButtonComponent');
			return;
		}

		const item = {
			productId: this.productId,
			quantity: this.quantity,
			monthly_price: this.monthlyPrice,
			rental_start_date: this.rentalStartDate,
			rental_end_date: this.rentalEndDate,
		};

		this.cartService.addToCart(item).subscribe({
			next: (response) => {
				console.log('Item added to cart successfully', response);
			},
			error: (err) => {
				console.error('Failed to add item to cart', err);
			}
		});
	}
}
