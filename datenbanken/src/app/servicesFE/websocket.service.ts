import { inject, Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { AuthService } from './authFE';
import { Subject } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class WebSocketService {
	private socket: Socket | undefined;
	private authService = inject(AuthService);

	public roleUpdate$ = new Subject<void>();

	public connect(): void {
		const token = this.authService.getToken();
		if (token && !this.socket?.connected) {
			this.socket = io('http://localhost:3000', {
				auth: { token }
			});

			this.socket.on('connect', () => {
				console.log('WebSocket connected successfully.');
			});

			this.socket.on('disconnect', () => {
				console.log('WebSocket disconnected.');
			});

			// Listen for role update events from the server
			this.socket.on('role_updated', (data: { newRole: string }) => {
				console.log(`Received role update. New role: ${data.newRole}`);
				this.roleUpdate$.next();
			});
		}
	}

	public disconnect(): void {
		if (this.socket) {
			this.socket.disconnect();
			this.socket = undefined;
		}
	}
}
