import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
	providedIn: 'root'
})
export class AuthService {
	// Die URL deines Node.js-Backends. Passe sie an, falls dein Port anders ist.
	private apiUrl = 'http://localhost:3000/auth';

	// Wir holen uns die Werkzeuge, die wir brauchen: HttpClient zum Senden, Router zum Navigieren.
	private http = inject(HttpClient);
	private router = inject(Router);

	/**
	 * Sendet Registrierungsdaten an das Backend.
	 */
	register(userData: any): Observable<any> {
		return this.http.post(`${this.apiUrl}/register`, userData);
	}

	/**
	 * Sendet Login-Daten an das Backend und speichert den Token bei Erfolg.
	 */
	login(credentials: any): Observable<{ token: string }> {
		return this.http.post<{ token: string }>(`${this.apiUrl}/login`, credentials).pipe(
			tap(response => {
				// Wenn das Backend einen Token zurückgibt, speichern wir ihn im Browser.
				if (response.token) {
					localStorage.setItem('authToken', response.token);
				}
			})
		);
	}

	/**
	 * Meldet den Benutzer ab, indem der Token entfernt wird.
	 */
	logout(): void {
		localStorage.removeItem('authToken');
		// Optional: Nach dem Logout zur Login-Seite navigieren.
		this.router.navigate(['/signIn']);
	}

	/**
	 * Prüft, ob ein Token vorhanden ist (ob der Benutzer eingeloggt ist).
	 */
	isLoggedIn(): boolean {
		return !!localStorage.getItem('authToken');
	}
}
