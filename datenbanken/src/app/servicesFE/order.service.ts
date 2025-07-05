import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class OrderService {
	private http = inject(HttpClient);
	private apiUrl = 'http://localhost:3000/api/orders';

	createOrder(payload: any): Observable<any> {
		return this.http.post(this.apiUrl, payload);
	}

	getMyOrders(): Observable<any[]> {
		return this.http.get<any[]>(this.apiUrl);
	}
}
