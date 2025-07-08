import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, tap } from 'rxjs';

interface CartItemPayload {
	productId: number;
	quantity: number;
	monthly_price: number;
	rental_start_date: string;
	rental_end_date: string;
}

@Injectable({
	providedIn: 'root'
})
export class CartService {
	private http = inject(HttpClient);
	private apiUrl = 'http://localhost:3000/api/cart';

	private openCartSource = new Subject<void>();
	openCart$ = this.openCartSource.asObservable();

	private cartUpdateSource = new Subject<void>();
	cartUpdated$ = this.cartUpdateSource.asObservable();

	openCart() {
		this.openCartSource.next();
	}

	notifyCartUpdate() {
		this.cartUpdateSource.next();
	}

	addToCart(item: CartItemPayload): Observable<any> {
		return this.http.post(`${this.apiUrl}/items`, item).pipe(
			tap(() => {
				this.cartUpdateSource.next();
				this.openCart();
			})
		);
	}

	getCart(): Observable<any> {
		return this.http.get(this.apiUrl);
	}

	removeItemFromCart(itemId: number): Observable<any> {
		return this.http.delete(`${this.apiUrl}/items/${itemId}`).pipe(
			tap(() => {
				this.cartUpdateSource.next();
			})
		);
	}
}
