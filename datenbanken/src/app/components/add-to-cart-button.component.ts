import { Component, inject } from '@angular/core';
import { CartService } from '../servicesFE/cart.service';

@Component({
	selector: 'app-add-to-cart-button',
	standalone: true,
	template: `
    <button (click)="addItemToCart()"
            class="w-full bg-white text-black font-semibold py-1 rounded-full hover:bg-gray-200 transition-colors duration-300">
      Add to Cart
    </button>
  `
})
export class AddToCartButtonComponent {
	private cartService = inject(CartService);

	addItemToCart(): void {
		this.cartService.addToCart({ product: 'Example Product' });
	}
}
