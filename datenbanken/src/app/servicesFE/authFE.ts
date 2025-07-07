import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {BehaviorSubject, Observable, tap} from 'rxjs';
import {Router} from '@angular/router';

@Injectable({
	providedIn: 'root'
})
export class AuthService {
	private http = inject(HttpClient);
	private router = inject(Router);
	private apiUrl = 'http://localhost:3000/api/auth';

	private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasToken());
	public isLoggedIn$ = this.isLoggedInSubject.asObservable();

	private hasToken(): boolean {
		if (typeof window !== 'undefined') {
			return !!localStorage.getItem('auth_token');
		}
		return false;
	}

	getToken(): string | null {
		if (typeof window !== 'undefined') {
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
				if (typeof window !== 'undefined') {
					localStorage.setItem('auth_token', response.token);
					this.isLoggedInSubject.next(true);
					console.log('Login successful, token stored.');
				}
			})
		);
	}

	logout(): void {
		if (typeof window !== 'undefined') {
			localStorage.removeItem('auth_token');
			this.isLoggedInSubject.next(false);
			this.router.navigate(['/signIn']);
			console.log('User logged out, token removed.');
		}
	}

	updateToken(token: string): void {
		if (typeof window !== 'undefined') {
			localStorage.setItem('auth_token', token);
			this.isLoggedInSubject.next(true); // Ensure logged-in state is still true
			console.log('Auth token updated.');
		}
	}

	getAuthHeaders(): HttpHeaders {
		const token = this.getToken();
		return new HttpHeaders({
			'Authorization': `Bearer ${token}`
		});
	}
}
