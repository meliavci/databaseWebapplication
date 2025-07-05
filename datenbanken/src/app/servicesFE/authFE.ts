import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

export interface User {
	id: number;
	username: string;
	email: string;
}

@Injectable({
	providedIn: 'root'
})
export class AuthService {
	private http = inject(HttpClient);
	private router = inject(Router);
	private platformId = inject(PLATFORM_ID);
	private apiUrl = 'http://localhost:3000/api/auth';

	private isLoggedIn = new BehaviorSubject<boolean>(this.hasToken());
	isLoggedIn$ = this.isLoggedIn.asObservable();

	private currentUser = new BehaviorSubject<User | null>(null);
	currentUser$ = this.currentUser.asObservable();

	constructor() {
		if (this.isBrowser()) {
			this.loadCurrentUser();
		}
	}

	private isBrowser(): boolean {
		return isPlatformBrowser(this.platformId);
	}

	private hasToken(): boolean {
		if (this.isBrowser()) {
			return !!localStorage.getItem('auth_token');
		}
		return false;
	}

	private loadCurrentUser(): void {
		const token = this.getToken();
		if (token) {
			this.getCurrentUser().subscribe();
		}
	}

	getToken(): string | null {
		if (this.isBrowser()) {
			return localStorage.getItem('auth_token');
		}
		return null;
	}

	register(userData: any): Observable<any> {
		return this.http.post(`${this.apiUrl}/register`, userData);
	}

	login(credentials: any): Observable<any> {
		return this.http.post<{ token: string }>(`${this.apiUrl}/login`, credentials).pipe(
			tap(response => {
				if (this.isBrowser()) {
					localStorage.setItem('auth_token', response.token);
					this.isLoggedIn.next(true);
					this.loadCurrentUser();
				}
			})
		);
	}

	logout(): void {
		if (this.isBrowser()) {
			localStorage.removeItem('auth_token');
			this.isLoggedIn.next(false);
			this.currentUser.next(null);
			this.router.navigate(['/signIn']);
		}
	}

	getCurrentUser(): Observable<User | null> {
		if (!this.isBrowser() || !this.hasToken()) {
			return of(null);
		}
		return this.http.get<User>(`${this.apiUrl}/me`).pipe(
			tap(user => this.currentUser.next(user))
		);
	}
}
