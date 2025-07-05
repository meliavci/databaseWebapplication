import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../../models/product.models';

export interface ProductWithStock extends Product {
	stock: number;
}

@Injectable({
	providedIn: 'root'
})
export class ProductService {
	private http = inject(HttpClient);
	private apiUrl = 'http://localhost:3000/api/products';
	private inventoryApiUrl = 'http://localhost:3000/api/inventory';

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
		return this.http.get<ProductWithStock>(`${this.apiUrl}/${id}`);
	}

	getProductsWithStock(): Observable<ProductWithStock[]> {
		// Assuming an endpoint that returns products with stock information
		return this.http.get<ProductWithStock[]>(`${this.apiUrl}/with-stock`);
	}

	updateStock(productId: number, amount: number): Observable<any> {
		return this.http.patch(`${this.inventoryApiUrl}/stock`, { productId, amount });
	}
}
