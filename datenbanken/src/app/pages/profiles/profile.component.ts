import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {CommonModule, CurrencyPipe, DatePipe} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {AuthService} from '../../servicesFE/authFE';
import {UserService} from '../../servicesFE/user.service';
import {User} from '../../../models/user.models';
import {InventoryService} from '../../servicesFE/inventory.service';
import {ProductService, ProductWithStock} from '../../servicesFE/product.service';
import {OrderService} from '../../servicesFE/order.service';
import { WebSocketService } from '../../servicesFE/websocket.service';
import { Subscription } from 'rxjs';

interface OrderItem {
	id: number;
	name: string;
	image_url: string;
	price: number;
	rental_start_date: string;
	rental_end_date: string;
}

interface Order {
	id: number;
	items: OrderItem[];
	total_amount: number;
	order_date: string;
}


@Component({
	selector: 'app-profile',
	standalone: true,
	imports: [CommonModule, FormsModule, CurrencyPipe, DatePipe],
	template: `
		<div class="bg-neutral-950 text-white min-h-screen">
			<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

				<header class="mb-8 mt-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
					<div class="flex items-center gap-4" *ngIf="currentUser">
						<div>
							<h1 class="text-2xl md:text-3xl font-bold">Welcome back, {{ fullName }}!</h1>
							<p class="text-neutral-400">Manage your profile</p>
						</div>
					</div>
				</header>

				<nav class="mb-8 flex items-center gap-2 sm:gap-4 border-b border-neutral-800 cursor-pointer">
					<button *ngFor="let tab of availableTabs"
									(click)="activeTab = tab.id"
									[ngClass]="{
                    'border-blue-500 text-white': activeTab === tab.id,
                    'border-transparent text-neutral-400 hover:text-white': activeTab !== tab.id
                  }"
									class="flex items-center gap-2 px-3 py-3 border-b-2 font-medium transition-colors duration-200">
						<span class="hidden sm:inline">{{ tab.label }}</span>
					</button>
				</nav>

				<main>
					<div [ngSwitch]="activeTab">
						<div *ngSwitchCase="'profile'">
							<div *ngIf="!currentUser" class="text-center p-8">Loading profile...</div>
							<div *ngIf="currentUser" class="grid grid-cols-1 md:grid-cols-2 gap-8">
								<div class="p-6 bg-neutral-950 rounded-lg card block border border-neutral-700 bg-neutral-900 hover:border-blue-500 transition-all duration-300 ease-in-out transform">
									<h3 class="text-xl font-bold mb-6">Personal Data</h3>
									<div class="space-y-4">
										<div class="flex items-center gap-4">
											<span class="p-2 bg-neutral-950 border border-neutral-700 rounded-md"><svg class="w-6 h-6 text-neutral-400" fill="none"
																																																 stroke="currentColor" viewBox="0 0 24 24"><path
												stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
												d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg></span>
											<div>
												<p class="text-sm text-neutral-400">Full Name</p>
												<p>{{ fullName }}</p>
											</div>
										</div>
										<div class="flex items-center gap-4">
											<span class="p-2 bg-neutral-950 border border-neutral-700 rounded-md"><svg class="w-6 h-6 text-neutral-400" fill="none"
																																																 stroke="currentColor" viewBox="0 0 24 24"><path
												stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
												d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z"></path></svg></span>
											<div>
												<p class="text-sm text-neutral-400">Username</p>
												<p>{{ currentUser.username }}</p>
											</div>
										</div>
										<div class="flex items-center gap-4">
											<span class="p-2 bg-neutral-950 border border-neutral-700 rounded-md"><svg class="w-6 h-6 text-neutral-400" fill="none"
																																																 stroke="currentColor" viewBox="0 0 24 24"><path
												stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
												d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg></span>
											<div>
												<p class="text-sm text-neutral-400">E-Mail</p>
												<p>{{ currentUser.email }}</p>
											</div>
										</div>
									</div>
									<div class="mt-6">
										<button (click)="logout()"
														class="w-full px-4 py-2 border border-neutral-700 hover:border-blue-500 transition-all duration-300 ease-in-out hover:bg-blue-500/5 rounded-full font-semibold transition-all duration-200 cursor-pointer">
											Log Out
										</button>
									</div>
								</div>
								<div class="p-6 bg-neutral-950 rounded-lg card block border border-neutral-700 bg-neutral-900 hover:border-blue-500 transition-all duration-300 ease-in-out transform">
									<h3 class="text-xl font-bold mb-6">Change Password</h3>
									<form (ngSubmit)="changePassword()" class="space-y-4">
										<div>
											<label class="block text-sm font-medium text-neutral-400 mb-1">Current Password</label>
											<input type="password" placeholder="Enter current password" [(ngModel)]="passwordForm.current" name="current"
														 class="w-full bg-neutral-950 border text-sm text-gray-400 border-neutral-700 border-neutral-700 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-500 transition-all duration-300 ease-in-out">
										</div>
										<div>
											<label class="block text-sm font-medium text-neutral-400 mb-1">New Password</label>
											<input type="password" placeholder="Enter new password (min 6 character)" [(ngModel)]="passwordForm.new" name="new"
														 class="w-full bg-neutral-950 border text-sm text-gray-400 border-neutral-700 border-neutral-700 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-500 transition-all duration-300 ease-in-out">
										</div>
										<div>
											<label class="block text-sm font-medium text-neutral-400 mb-1">Confirm New Password</label>
											<input type="password" placeholder="Enter new password (min 6 character)" [(ngModel)]="passwordForm.confirm" name="confirm"
														 class="w-full bg-neutral-950 text-sm text-gray-400 border border-neutral-700 border-neutral-700 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-500 transition-all duration-300 ease-in-out">
										</div>
										<button type="submit"
														class="w-full px-4 py-2 mt-2 bg-blue-600 hover:bg-blue-500 rounded-full font-semibold transition-all duration-200 cursor-pointer">
											Save Changes
										</button>
									</form>
								</div>
							</div>
						</div>

						<div *ngSwitchCase="'orders'">
							<h3 class="text-xl font-bold mb-6">Order History</h3>
							<div class="space-y-6">
								<div *ngIf="orders.length === 0" class="text-center py-12 bg-neutral-950 border border-neutral-700 rounded-lg">
									<p class="text-neutral-400">You have no orders yet.</p>
								</div>
								<div *ngFor="let order of orders"
										 class="p-4 sm:p-6 bg-neutral-950 border border-neutral-700 rounded-lg  transition-all duration-300 hover:border-blue-500/50">
									<div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
										<div>
											<p class="font-bold text-lg">Order #{{ order.id }}</p>
											<p class="text-sm text-neutral-400">Placed on {{ order.order_date | date:'mediumDate' }}</p>
										</div>
										<p class="font-bold text-xl mt-2 sm:mt-0">{{ order.total_amount | currency:'EUR' }}</p>
									</div>
									<div class="border-t border-neutral-800 pt-4 space-y-4">
										<div *ngFor="let item of order.items" class="flex items-center gap-4">
											<img [src]="item.image_url" alt="{{item.name}}" class="w-12 h-12 rounded-md object-cover">
											<div>
												<p class="font-semibold">{{ item.name }}</p>
												<p class="text-sm text-neutral-400">Rented from {{ item.rental_start_date | date:'dd.MM.yy' }} to {{ item.rental_end_date | date:'dd.MM.yy' }}</p>
											</div>
											<p class="ml-auto font-medium">{{ item.price | currency:'EUR' }} / month</p>
										</div>
									</div>
								</div>
							</div>
						</div>

						<div *ngSwitchCase="'admin-inventory'">
							<h3 class="text-xl font-bold mb-6">Admin Dashboard: Inventory</h3>
							<div class="rounded-lg bg-neutral-950 border border-neutral-700 overflow-hidden">
								<table class="w-full text-left">
									<thead class="bg-neutral-950">
										<tr>
											<th class="p-4 font-semibold">Product</th>
											<th class="p-4 font-semibold text-center">In Stock</th>
											<th class="p-4 font-semibold text-center">Actions</th>
										</tr>
									</thead>
									<tbody>
										<tr *ngFor="let item of inventory" class="bg-neutral-950 border border-neutral-700 last:border-b-0">
											<td class="p-4 flex items-center gap-4">
												<img [src]="item.image_url" alt="{{item.name}}" class="w-10 h-10 rounded-md object-cover">
												{{ item.name }}
											</td>
											<td class="p-4 text-center font-mono"
													[ngClass]="{'text-red-400': item.stock < 5, 'text-green-400': item.stock >= 5}">{{ item.stock }}
											</td>
											<td class="p-4 text-center">
												<div class="flex justify-center items-center gap-2">
													<button (click)="updateStock(item, -1)"
																	[disabled]="item.stock <= 0"
																	class="w-8 h-8 rounded-full bg-neutral-700 hover:bg-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">-
													</button>
													<button (click)="updateStock(item, 1)"
																	class="w-8 h-8 rounded-full bg-neutral-700 hover:bg-green-500 transition-colors">+
													</button>
												</div>
											</td>
										</tr>
									</tbody>
								</table>
							</div>
						</div>

						<div *ngSwitchCase="'admin-users'">
							<h3 class="text-xl font-bold mb-6">Admin Dashboard: User Management</h3>
							<div class="rounded-lg bg-neutral-950 border border-neutral-700 overflow-hidden">
								<table class="w-full text-left">
									<thead class="bg-neutral-950">
										<tr>
											<th class="p-4 font-semibold">User</th>
											<th class="p-4 font-semibold">Email</th>
											<th class="p-4 font-semibold text-center">Role</th>
										</tr>
									</thead>
									<tbody>
										<tr *ngFor="let user of allUsers" class="border-b border-neutral-700 last:border-b-0">
											<td class="p-4 flex items-center gap-4">
												{{ user.firstName }} {{ user.lastName }}
											</td>
											<td class="p-4 text-neutral-400">{{ user.email }}</td>
											<td class="p-4 text-center">
												<select [ngModel]="user.role" (ngModelChange)="changeUserRole(user, $event)"
																[disabled]="user.id === currentUser?.id"
																class="bg-neutral-950 border-neutral-700 rounded-md px-2 py-1 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed">
													<option value="user">User</option>
													<option value="admin">Admin</option>
												</select>
											</td>
										</tr>
									</tbody>
								</table>
							</div>
						</div>

					</div>
				</main>
			</div>
		</div>
	`
})
export class ProfileComponent implements OnInit, OnDestroy {
	activeTab: string = 'profile';
	private authService = inject(AuthService);
	private userService = inject(UserService);
	private inventoryService = inject(InventoryService);
	private productService = inject(ProductService);
	private orderService = inject(OrderService);
	private webSocketService = inject(WebSocketService);
	private roleUpdateSub: Subscription | undefined;

	inventory: ProductWithStock[] = [];

	currentUser: User | null = null;
	allUsers: User[] = [];
	viewRole: 'user' | 'admin' = 'user';
	isAdmin: boolean = false;

	orders: Order[] = [];

	passwordForm = {
		current: '',
		new: '',
		confirm: ''
	};

	baseTabs = [
		{id: 'profile', label: 'Profile & Security'},
		{id: 'orders', label: 'Order History'}
	];
	adminTabs = [
		{id: 'admin-inventory', label: 'Inventory'},
		{id: 'admin-users', label: 'Users'},
	];
	availableTabs = this.baseTabs;

	ngOnInit(): void {
		this.webSocketService.connect();
		this.loadUserProfile();
		this.loadOrders();

		this.roleUpdateSub = this.webSocketService.roleUpdate$.subscribe(() => {
			console.log('Role update detected, reloading profile...');
			this.loadUserProfile();
		});
	}

	ngOnDestroy(): void {
		this.webSocketService.disconnect();
		this.roleUpdateSub?.unsubscribe();
	}

	get fullName(): string {
		if (!this.currentUser) return '';
		return `${this.currentUser.firstName || ''} ${this.currentUser.lastName || ''}`.trim();
	}

	loadUserProfile(): void {
		this.userService.getProfile().subscribe({
			next: (user) => {
				this.currentUser = user;
				this.viewRole = user.role;
				this.isAdmin = user.role === 'admin';
				this.updateTabs();
				if (this.viewRole === 'admin') {
					this.loadAllUsers();
					this.loadInventory();
				}
			},
			error: (err) => {
				console.error('Failed to load user profile', err);
				this.authService.logout();
			}
		});
	}

	loadOrders(): void {
		this.orderService.getMyOrders().subscribe({
			next: (orders) => {
				this.orders = orders;
			},
			error: (err) => {
				console.error('Failed to load orders', err);
			}
		});
	}

	loadAllUsers(): void {
		this.userService.getAllUsers().subscribe({
			next: (users) => {
				this.allUsers = users;
			},
			error: (err) => console.error('Failed to load all users', err)
		});
	}

	updateTabs(): void {
		this.availableTabs = this.viewRole === 'admin'
			? [...this.baseTabs, ...this.adminTabs]
			: this.baseTabs;

		if (this.viewRole === 'user' && this.activeTab.startsWith('admin')) {
			this.activeTab = 'profile';
		}
	}

	changePassword() {
		if (this.passwordForm.new !== this.passwordForm.confirm) {
			alert('New password and confirmation do not match.');
			return;
		}
		if (!this.passwordForm.current || !this.passwordForm.new) {
			alert('Please fill in all fields.');
			return;
		}

		this.userService.changePassword(this.passwordForm).subscribe({
			next: () => {
				alert('Password changed successfully!');
				this.passwordForm = {current: '', new: '', confirm: ''};
			},
			error: (err) => {
				console.error('Password change failed', err);
				alert(`Error: ${err.error?.error || 'Could not change password.'}`);
			}
		});
	}

	loadInventory() {
		this.productService.getProductsWithStock().subscribe({
			next: (data) => {
				this.inventory = data;
			},
			error: (err) => {
				console.error('Failed to load inventory', err);
			}
		});
	}

	changeUserRole(user: User, newRole: 'user' | 'admin'): void {
		if (!user.id || user.id === this.currentUser?.id) {
			alert('You cannot change your own role.');
			return;
		}
		this.userService.updateUserRole(user.id, newRole).subscribe({
			next: (updatedUser) => {
				const index = this.allUsers.findIndex(u => u.id === updatedUser.id);
				if (index !== -1) {
					this.allUsers[index] = updatedUser;
				}
				alert(`User ${user.username}'s role updated to ${newRole}.`);
			},
			error: (err) => {
				console.error('Failed to update user role', err);
				alert('Failed to update user role. See console for details.');
				this.loadAllUsers();
			}
		});
	}

	updateStock(item: ProductWithStock, amount: number): void {
		const newStock = item.stock + amount;
		if (newStock < 0) {
			console.warn("Cannot reduce stock below zero.");
			return;
		}

		this.productService.updateStock(item.id, amount).subscribe({
			next: (updatedInventory) => {
				this.inventory = updatedInventory;
			},
			error: (err) => {
				console.error(`Failed to update stock for ${item.name}`, err);
				this.loadInventory();
			}
		});
	}

	logout(): void {
		this.authService.logout();
	}
}
