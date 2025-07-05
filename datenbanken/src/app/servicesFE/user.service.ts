import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../../models/user.models';

@Injectable({
	providedIn: 'root'
})
export class UserService {
	private http = inject(HttpClient);
	private apiUrl = 'http://localhost:3000/api/users';

	getProfile(): Observable<User> {
		return this.http.get<User>(`${this.apiUrl}/me`);
	}

	getAllUsers(): Observable<User[]> {
		return this.http.get<User[]>(this.apiUrl);
	}

	updateUserRole(id: number, role: 'user' | 'admin'): Observable<User> {
		return this.http.patch<User>(`${this.apiUrl}/${id}/role`, { role });
	}

	changePassword(passwords: { current: string, new: string }): Observable<any> {
		return this.http.patch(`${this.apiUrl}/me/password`, {
			oldPassword: passwords.current,
			newPassword: passwords.new
		});
	}
}
