import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Subject } from 'rxjs';
import { User } from '../../models/user.models';

@Injectable({
	providedIn: 'root'
})
export class WebSocketService {
	private socket: Socket | undefined;
	private readonly url = 'http://localhost:3000';

	private roleUpdateSource = new Subject<{ newRole: 'user' | 'admin', token: string }>();
	roleUpdate$ = this.roleUpdateSource.asObservable();

	private userCreatedSource = new Subject<User>();
	userCreated$ = this.userCreatedSource.asObservable();

	private stockUpdateSource = new Subject<{ productId: number, stock: number }>();
	stockUpdate$ = this.stockUpdateSource.asObservable();

	connect(token: string): void {
		if (this.socket && this.socket.connected) {
			return;
		}
		this.socket = io(this.url, {
			auth: { token }
		});

		this.socket.on('connect', () => {
			console.log('WebSocket connected successfully.');
		});

		this.socket.on('role_updated', (data: { newRole: 'user' | 'admin', token: string }) => {
			this.roleUpdateSource.next(data);
		});

		this.socket.on('user_created', (newUser: User) => {
			console.log('Received user_created event:', newUser);
			this.userCreatedSource.next(newUser);
		});

		// Listen for the new event
		this.socket.on('stock_updated', (data: { productId: number, stock: number }) => {
			console.log('Received stock_updated event:', data);
			this.stockUpdateSource.next(data);
		});

		this.socket.on('disconnect', (reason) => {
			console.log(`WebSocket disconnected: ${reason}`);
		});
	}

	disconnect(): void {
		if (this.socket) {
			this.socket.disconnect();
			this.socket = undefined;
		}
	}
}
