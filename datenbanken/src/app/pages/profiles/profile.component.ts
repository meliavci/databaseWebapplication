import {Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {animate, style, transition, trigger} from '@angular/animations';
import {AuthService} from '../../servicesFE/authFE';

interface User {
	id: number;
	username: string;
	fullName: string;
	email: string;
	role: 'user' | 'admin';
}

interface OrderItem {
	id: number;
	name: string;
	imageUrl: string;
	quantity: number;
	rentalPeriod: string;
	price: number;
}

interface Order {
	id: string;
	items: OrderItem[];
	total: number;
	date: string;
}

interface InventoryItem {
	id: number;
	name: string;
	imageUrl: string;
	stock: number;
}

@Component({
	selector: 'app-profile',
	standalone: true,
	imports: [CommonModule, FormsModule],
	animations: [
		trigger('fadeInOut', [
			transition(':enter', [
				style({opacity: 0, transform: 'translateY(10px)'}),
				animate('300ms ease-out', style({opacity: 1, transform: 'translateY(0)'})),
			]),
			transition(':leave', [
				animate('300ms ease-in', style({opacity: 0, transform: 'translateY(10px)'}))
			])
		])
	],
	template: `
		<div class="bg-neutral-950 text-white">
			<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

				<header class="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
					<div class="flex items-center gap-4">
						<div>
							<h1 class="text-2xl md:text-3xl font-bold">Welcome back, {{ currentUser.fullName }}!</h1>
							<p class="text-neutral-400">Manage your profile.</p>
						</div>
					</div>
					<button (click)="toggleView()"
									class="px-4 py-2 bg-neutral-700 hover:bg-neutral-600 rounded-md text-sm transition-transform duration-200 hover:scale-105">
						Switch to {{ currentUser.role === 'user' ? 'Admin' : 'User' }} View
					</button>
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
						<div *ngSwitchCase="'profile'" @fadeInOut>
							<div class="grid grid-cols-1 md:grid-cols-2 gap-8">
								<div class="p-6 bg-neutral-950 rounded-lg border border-neutral-700">
									<h3 class="text-xl font-bold mb-6">Personal Data</h3>
									<div class="space-y-4">
										<div class="flex items-center gap-4">
											<span class="p-2 bg-neutral-950 border border-neutral-700 rounded-md"><svg class="w-6 h-6 text-neutral-400" fill="none"
																																			 stroke="currentColor" viewBox="0 0 24 24"><path
												stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
												d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg></span>
											<div>
												<p class="text-sm text-neutral-400">Full Name</p>
												<p>{{ currentUser.fullName }}</p>
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
														class="w-full px-4 py-2 border border-neutral-700 hover:bg-blue-500/5 rounded-full font-semibold transition-all duration-200 cursor-pointer">
											Log Out
										</button>
									</div>
								</div>
								<div class="p-6 bg-neutral-950 rounded-lg border border-neutral-700">
									<h3 class="text-xl font-bold mb-6">Change Password</h3>
									<form (ngSubmit)="changePassword()" class="space-y-4">
										<div>
											<label class="block text-sm font-medium text-neutral-400 mb-1">Current Password</label>
											<input type="password" [(ngModel)]="passwordForm.current" name="current"
														 class="w-full bg-neutral-950 border border-neutral-700 border-neutral-700 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500">
										</div>
										<div>
											<label class="block text-sm font-medium text-neutral-400 mb-1">New Password</label>
											<input type="password" [(ngModel)]="passwordForm.new" name="new"
														 class="w-full bg-neutral-950 border border-neutral-700 border-neutral-700 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500">
										</div>
										<div>
											<label class="block text-sm font-medium text-neutral-400 mb-1">Confirm New Password</label>
											<input type="password" [(ngModel)]="passwordForm.confirm" name="confirm"
														 class="w-full bg-neutral-950 border border-neutral-700 border-neutral-700 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500">
										</div>
										<button type="submit"
														class="w-full px-4 py-2 mt-2 bg-blue-600 hover:bg-blue-500 rounded-full font-semibold transition-all duration-200 cursor-pointer">
											Save Changes
										</button>
									</form>
								</div>
							</div>
						</div>

						<div *ngSwitchCase="'orders'" @fadeInOut>
							<h3 class="text-xl font-bold mb-6">Order History</h3>
							<div class="space-y-6">
								<div *ngIf="orders.length === 0" class="text-center py-12bg-neutral-950 border border-neutral-700 rounded-lg">
									<p class="text-neutral-400">You have no orders yet.</p>
								</div>
								<div *ngFor="let order of orders"
										 class="p-4 sm:p-6 bg-neutral-950 border border-neutral-700 rounded-lg  transition-all duration-300 hover:border-blue-500/50">
									<div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
										<div>
											<p class="font-bold text-lg">Order #{{ order.id }}</p>
											<p class="text-sm text-neutral-400">Placed on {{ order.date }}</p>
										</div>
										<p class="font-bold text-xl mt-2 sm:mt-0">{{ order.total | currency:'EUR' }}</p>
									</div>
									<div class="border-t border-neutral-800 pt-4 space-y-4">
										<div *ngFor="let item of order.items" class="flex items-center gap-4">
											<img [src]="item.imageUrl" alt="{{item.name}}" class="w-12 h-12 rounded-md object-cover">
											<div>
												<p class="font-semibold">{{ item.name }}</p>
												<p class="text-sm text-neutral-400">Rented for {{ item.rentalPeriod }}</p>
											</div>
											<p class="ml-auto font-medium">{{ item.price | currency:'EUR' }}</p>
										</div>
									</div>
								</div>
							</div>
						</div>

						<div *ngSwitchCase="'admin-inventory'" @fadeInOut>
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
												<img [src]="item.imageUrl" alt="{{item.name}}" class="w-10 h-10 rounded-md object-cover">
												{{ item.name }}
											</td>
											<td class="p-4 text-center font-mono"
													[ngClass]="{'text-red-400': item.stock < 5, 'text-green-400': item.stock >= 5}">{{ item.stock }}
											</td>
											<td class="p-4 text-center">
												<div class="flex justify-center items-center gap-2">
													<button (click)="updateStock(item, -1)"
																	class="w-8 h-8 rounded-full bg-neutral-700 hover:bg-red-500 transition-colors">-
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

						<div *ngSwitchCase="'admin-users'" @fadeInOut>
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
												{{ user.fullName }}
											</td>
											<td class="p-4 text-neutral-400">{{ user.email }}</td>
											<td class="p-4 text-center">
												<select [ngModel]="user.role" (ngModelChange)="changeUserRole(user, $event)"
																[disabled]="user.id === currentUser.id"
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
export class ProfileComponent {
	activeTab: string = 'profile';
	private authService = inject(AuthService);

	normalUser: User = {id: 1, username: 'john_doe', fullName: 'John Doe', email: "john.doe@example.com", role: 'user'};
	adminUser: User = {id: 2, username: 'admin_user', fullName: 'Admin User', email: "admin@example.com", role: 'admin'};

	currentUser: User = this.normalUser;

	orders: Order[] = [];
	inventory: InventoryItem[] = [];
	allUsers: User[] = [];

	passwordForm = {
		current: '',
		new: '',
		confirm: ''
	};

	baseTabs = [
		{
			id: 'profile',
			label: 'Profile & Security',
			icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>'
		},
		{
			id: 'orders',
			label: 'Order History',
			icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path>'
		}
	];
	adminTabs = [
		{
			id: 'admin-inventory',
			label: 'Inventory',
			icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />'
		},
		{
			id: 'admin-users',
			label: 'Users',
			icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />'
		},
	];
	availableTabs = this.baseTabs;

	ngOnInit(): void {
		this.loadMockData();
		this.availableTabs = this.currentUser.role === 'admin' ? [...this.baseTabs, ...this.adminTabs] : this.baseTabs;
		if (this.currentUser.role === "user" && this.activeTab.startsWith("admin")) {
			this.activeTab = "profile";
		}
	}

	updateTabs(): void {
		this.availableTabs = this.currentUser.role === 'admin'
			? [...this.baseTabs, ...this.adminTabs]
			: this.baseTabs;
		if (this.currentUser.role === 'user' && this.activeTab.startsWith('admin')) {
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
		console.log('Changing password...', this.passwordForm);
		alert('Password change request sent! (Demo)');
		this.passwordForm = {current: '', new: '', confirm: ''};
	}

	updateStock(item: InventoryItem, amount: number): void {
		const newStock = item.stock + amount;
		if (newStock >= 0) {
			item.stock = newStock;
			console.log(`Updated stock for ${item.name} to ${item.stock}`);
		}
	}

	changeUserRole(user: User, newRole: 'user' | 'admin'): void {
		if (user.id === this.currentUser.id) {
			alert('You cannot change your own role.');
			return;
		}
		user.role = newRole;
		console.log(`Changed role for ${user.username} to ${newRole}`);
		alert(`User role updated to ${newRole}.`);
	}

	toggleView() {
		this.currentUser = this.currentUser.role === 'user' ? this.adminUser : this.normalUser;
		this.updateTabs();
	}

	logout(): void {
		this.authService.logout();
	}

	loadMockData(): void {
		this.orders = [
			{ id: 'A3F8D', date: '2023-10-25', total: 119.00, items: [
					{ id: 101, name: 'Apple MacBook Pro 14"', rentalPeriod: '1 Month', price: 99.00, imageUrl: 'https://placehold.co/100x100/1e293b/FFF?text=MBP', quantity: 1 },
					{ id: 102, name: 'Magic Mouse', rentalPeriod: '1 Month', price: 20.00, imageUrl: 'https://placehold.co/100x100/1e293b/FFF?text=Mouse', quantity: 1 }
				]},
			{ id: 'B1C7E', date: '2023-09-12', total: 45.00, items: [
					{ id: 201, name: 'Sony WH-1000XM5 Headphones', rentalPeriod: '3 Months', price: 45.00, imageUrl: 'https://placehold.co/100x100/1e293b/FFF?text=Sony', quantity: 1 }
				]}
		];
		this.inventory = [
			{ id: 101, name: 'Apple MacBook Pro 14"', stock: 12, imageUrl: 'https://placehold.co/100x100/1e293b/FFF?text=MBP' },
			{ id: 102, name: 'Magic Mouse', stock: 35, imageUrl: 'https://placehold.co/100x100/1e293b/FFF?text=Mouse' },
			{ id: 201, name: 'Sony WH-1000XM5 Headphones', stock: 4, imageUrl: 'https://placehold.co/100x100/1e293b/FFF?text=Sony' },
			{ id: 301, name: 'PlayStation 5', stock: 8, imageUrl: 'https://placehold.co/100x100/1e293b/FFF?text=PS5' },
		];
		this.allUsers = [ this.normalUser, this.adminUser,
			{ id: 3, username: 'test.user', fullName: 'Test User', email: 'test@example.com', role: 'user' }
		];
	}
}

