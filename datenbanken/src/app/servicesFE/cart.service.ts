import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class CartService {
	private openCartSource = new Subject<void>();
	openCart$ = this.openCartSource.asObservable();

	openCart() {
		this.openCartSource.next();
	}

	addToCart(item: any) {
		console.log('Item added to cart:', item);
		this.openCart();
	}
}
