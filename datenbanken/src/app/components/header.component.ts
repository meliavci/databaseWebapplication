import {RouterLink, RouterLinkActive} from '@angular/router';
import {Component} from '@angular/core';
import { LogoComponent } from './logo.component';
import {SearchbarComponent} from './searchbar.component';

@Component ({
  selector: "app-header",
  standalone: true,
	imports: [RouterLink, RouterLinkActive, LogoComponent, SearchbarComponent],
  template: `
		<header class="bg-neutral-950 text-white border-b border-neutral-700 sticky top-0 z-50 drop-shadow-xl">
			<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col">
				<div class="flex items-center justify-between h-16">
					<div class="flex flex-row items-center justify-start gap-12">
						<div class="flex flex-row items-center justify-start gap-2">
							<a routerLink="/home" class="flex items-center space-x-2">
								<app-logo class="w-7 h-8"></app-logo>
								<span class="text-white font-bold text-lg">eviceDrop</span>
							</a>
						</div>
						<app-searchbar></app-searchbar>
					</div>
					<nav class="hidden md:flex items-center space-x-8">
						<a routerLink="/howTo" routerLinkActive="text-primary-400"
							 class="text-neutral-200 text-bold hover:text-white transition-colors duration-200">How To</a>
						<a routerLink="/signIn" routerLinkActive="text-primary-400"
							 class="text-neutral-200 hover:text-white transition-colors duration-200">
							<svg class="w-5 h-5" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
								<path d="M344,144c-3.92,52.87-44,96-88,96s-84.15-43.12-88-96c-4-55,35-96,88-96S348,90,344,144Z"
											style="fill:none;stroke:#FFFF;stroke-linecap:round;stroke-linejoin:round;stroke-width:32px"/>
								<path
									d="M256,304c-87,0-175.3,48-191.64,138.6C62.39,453.52,68.57,464,80,464H432c11.44,0,17.62-10.48,15.65-21.4C431.3,352,343,304,256,304Z"
									style="fill:none;stroke:#FFFF;stroke-miterlimit:10;stroke-width:32px"/>
							</svg>
						</a>
						<a routerLink="/cart" routerLinkActive="text-primary-400"
							 class="text-neutral-200 hover:text-white transition-colors duration-200">
							<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M2 3L2.26491 3.0883C3.58495 3.52832 4.24497 3.74832 4.62248 4.2721C5 4.79587 5 5.49159 5 6.88304V9.5C5 12.3284 5 13.7426 5.87868 14.6213C6.75736 15.5 8.17157 15.5 11 15.5H19" stroke="#FFFF" stroke-width="1.5" stroke-linecap="round"/>
								<path d="M7.5 18C8.32843 18 9 18.6716 9 19.5C9 20.3284 8.32843 21 7.5 21C6.67157 21 6 20.3284 6 19.5C6 18.6716 6.67157 18 7.5 18Z" stroke="#FFFF" stroke-width="1.5"/>
								<path d="M16.5 18.0001C17.3284 18.0001 18 18.6716 18 19.5001C18 20.3285 17.3284 21.0001 16.5 21.0001C15.6716 21.0001 15 20.3285 15 19.5001C15 18.6716 15.6716 18.0001 16.5 18.0001Z" stroke="#FFFF" stroke-width="1.5"/>
								<path d="M5 6H16.4504C18.5054 6 19.5328 6 19.9775 6.67426C20.4221 7.34853 20.0173 8.29294 19.2078 10.1818L18.7792 11.1818C18.4013 12.0636 18.2123 12.5045 17.8366 12.7523C17.4609 13 16.9812 13 16.0218 13H5" stroke="#FFFF" stroke-width="1.5"/>
							</svg>
						</a>
					</nav>
				</div>
			</div>
			<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-start mt-2 py-3">
				<div class="flex flex-row items-center justify-between gap-10 text-sm">
					<a routerLink="/category" routerLinkActive="text-primary-400"
						 class="text-neutral-200 hover:text-white transition-colors duration-200">All categories</a>
					<a routerLink="/user" routerLinkActive="text-primary-400"
						 class="text-neutral-200 hover:text-white transition-colors duration-200">Gaming</a>
					<a routerLink="/admin" routerLinkActive="text-primary-400"
						 class="text-neutral-200 hover:text-white transition-colors duration-200">Camera</a>
					<a routerLink="/checkout" routerLinkActive="text-primary-400"
						 class="text-neutral-200 hover:text-white transition-colors duration-200">Smartphones</a>
					<a routerLink="/cart" routerLinkActive="text-primary-400"
						 class="text-neutral-200 hover:text-white transition-colors duration-200">Wearables</a>
					<a routerLink="/cart" routerLinkActive="text-primary-400"
						 class="text-neutral-200 hover:text-white transition-colors duration-200">Audio</a>
				</div>
			</div>
		</header>
  `,
})
export class HeaderComponent {

}
