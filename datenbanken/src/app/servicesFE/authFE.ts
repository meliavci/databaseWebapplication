import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
	providedIn: 'root'
})
export class AuthService {
	private apiUrl = 'http://localhost:3000/auth';
	private http = inject(HttpClient);
	private router = inject(Router);

	private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasToken());

	public isLoggedIn$ = this.isLoggedInSubject.asObservable();

	private hasToken(): boolean {
		console.log("token check");
		return typeof window !== 'undefined' && !!window.localStorage.getItem('authToken');
	}
	register(userData: any): Observable<any> {
		return this.http.post(`${this.apiUrl}/register`, userData);
	}

	login(credentials: any): Observable<{ token: string }> {
		return this.http.post<{ token:string }>(`${this.apiUrl}/login`, credentials).pipe(
			tap(response => {
				if (response.token) {
					localStorage.setItem('authToken', response.token);
					this.isLoggedInSubject.next(true);
				}
			})
		);
	}

	logout(): void {
		localStorage.removeItem('authToken');
		this.isLoggedInSubject.next(false);
		this.router.navigate(['/signIn']);
	}

	isLoggedIn(): boolean {
		return this.isLoggedInSubject.value;
	}
}
