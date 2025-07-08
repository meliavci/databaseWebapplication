import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Product } from '../../models/product.models';
import { WebSocketService } from './websocket.service';
import {switchMap} from 'rxjs/operators';

export interface ProductWithStock extends Product {
	stock: number;
}

@Injectable({
	providedIn: 'root'
})
export class ProductService {
	private http = inject(HttpClient);
	private webSocketService = inject(WebSocketService);
	private apiUrl = 'http://localhost:3000/api/products';
	private inventoryApiUrl = 'http://localhost:3000/api/inventory';

	private productStockSubjects = new Map<number, BehaviorSubject<number>>();

	constructor() {
		this.webSocketService.stockUpdate$.subscribe(({ productId, stock }) => {
			if (this.productStockSubjects.has(productId)) {
				this.productStockSubjects.get(productId)!.next(stock);
			}
		});
	}

	private getStockObservable(productId: number, initialStock: number): Observable<number> {
		if (!this.productStockSubjects.has(productId)) {
			this.productStockSubjects.set(productId, new BehaviorSubject(initialStock));
		}
		return this.productStockSubjects.get(productId)!.asObservable();
	}

	getProducts(category?: string, search?: string): Observable<Product[]> {
		let params = new HttpParams();
		if (category) {
			params = params.set('category', category);
		}
		if (search) {
			params = params.set('search', search);
		}
		return this.http.get<Product[]>(this.apiUrl, { params });
	}

	getProduct(id: number): Observable<ProductWithStock> {
		return this.http.get<ProductWithStock>(`${this.apiUrl}/${id}`).pipe(
			tap(product => {
				if (!this.productStockSubjects.has(product.id)) {
					this.productStockSubjects.set(product.id, new BehaviorSubject(product.stock));
				} else {
					this.productStockSubjects.get(product.id)!.next(product.stock);
				}
			})
		);
	}

	getProductStock(productId: number): Observable<number> {
		const subject = this.productStockSubjects.get(productId);
		if (subject) {
			return subject.asObservable();
		}
		return this.http.get<{ stock: number }>(`${this.inventoryApiUrl}/stock/${productId}`).pipe(
			tap(response => {
				this.getStockObservable(productId, response.stock);
			}),
			switchMap(() => this.getStockObservable(productId, 0)) // should have been created
		);
	}

	getProductsWithStock(): Observable<ProductWithStock[]> {
		return this.http.get<ProductWithStock[]>(`${this.apiUrl}/with-stock`);
	}

	updateStock(productId: number, amount: number): Observable<any> {
		return this.http.patch(`${this.inventoryApiUrl}/stock`, { productId, amount });
	}
}
