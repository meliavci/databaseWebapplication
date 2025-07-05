import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class InventoryService {
	private http = inject(HttpClient);
	private apiUrl = 'http://localhost:3000/api/inventory';

	getInventory(): Observable<any[]> {
		return this.http.get<any[]>(this.apiUrl);
	}

	getStockForProduct(productId: number): Observable<{ stock: number }> {
		return this.http.get<{ stock: number }>(`${this.apiUrl}/stock/${productId}`);
	}

	async addStockForProduct(productId: number, amount: number) {
		return this.http.post(`${this.apiUrl}/add-stock`, { productId, amount }).toPromise();
	}

	async removeStockForProduct(productId: number, number: number) {
		return this.http.post(`${this.apiUrl}/remove-stock`, { productId, number }).toPromise();
	}
}
