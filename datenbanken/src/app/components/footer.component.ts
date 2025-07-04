import {Component, inject, Input} from '@angular/core';
import {RouterLink} from '@angular/router';
import {LogoComponent} from './logo.component';
import {CartDrawerComponent} from './cart-drawer.component';
import {AuthService} from '../servicesFE/authFE';
import {CommonModule} from '@angular/common';

@Component({
	selector: "app-footer",
	standalone: true,
	imports: [
		RouterLink,
		LogoComponent,
		CommonModule
	],
	template: `
		<footer class="bg-neutral-950 border-t border-neutral-700 text-white drop-shadow-xl">
			<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
				<div class="grid grid-cols-1 md:grid-cols-4 gap-8">
					<div class="col-span-1 md:col-span-2">
						<div class="flex items-center space-x-2 mb-4">
							<div class="flex items-center justify-center">
								<app-logo class="w-7 h-8"></app-logo>
							</div>
							<span class="text-xl font-bold text-white">eviceDrop</span>
						</div>
						<p class="text-gray-400 mb-4 max-w-md">
							Rent tech products with ease. Explore our wide range of products and enjoy a seamless rental experience.
						</p>
					</div>
					<div>
						<h3 class="text-white font-semibold mb-4">Quick Links</h3>
						<ul class="space-y-2">
							<li><a routerLink="/howTo" class="flex items-center space-x-2 text-gray-400 text-sm">HowTo</a></li>
							<li><a routerLink="/category" class="flex items-center space-x-2 text-gray-400 text-sm">Products</a></li>
							<ng-container *ngIf="authService.isLoggedIn$ | async as isLoggedIn">
								<li><a [routerLink]="isLoggedIn ? '/profile' : '/signIn'"
											 class="flex items-center space-x-2 text-gray-400 text-sm">Account</a></li>
							</ng-container>
							<li><a (click)="openCart(); $event.preventDefault()"
										 href="#" class="flex items-center space-x-2 text-gray-400 text-sm">Cart</a></li>
						</ul>
					</div>
				</div>
				<div class="border-t border-neutral-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
					<p class="text-gray-400 text-sm">Datenbankbasierte Webanwendungen SoSe 25</p>
					<div class="flex items-center space-x-6 mt-4 md:mt-0">
						<span class="text-gray-400 text-sm"></span>
					</div>
				</div>
			</div>
		</footer>`
})
export class FooterComponent {
	public authService = inject(AuthService);

	@Input() cartDrawer?: CartDrawerComponent;

	openCart(): void {
		this.cartDrawer?.open();
	}
}
