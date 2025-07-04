import { Component, Input } from '@angular/core';
import { AddToCartButtonComponent } from './add-to-cart-button.component';
import { NgIf } from '@angular/common';
import {RouterLink} from '@angular/router';

@Component({
	selector: 'app-product-card',
	standalone: true,
	imports: [
		AddToCartButtonComponent,
		NgIf,
		RouterLink,
	],
	template: `
		<div
			class="rounded-xl border border-neutral-700 text-white overflow-hidden shadow-md hover:shadow-xl transition-shadow items-start">
			<a routerLink="/productDetail" class="flex flex-col justify-between text-center items-center p-6">
				<div class="relative">
					<img src="/Product1.png" alt="Product"
							 class="w-40 h-auto object-cover overflow-hidden hover:scale-105 transition-transform duration-300"/>
				</div>
				<div>
					<div class="space-y-2 flex items-start flex-col text-start">
						<div class="text-xs border border-neutral-700 rounded-full px-4 py-1">
							Gaming
						</div>
						<h3 class="font-semibold line-clamp-2">Playstation 5</h3>
						<p class="text-sm text-muted-foreground line-clamp-2 text-gray-400">Launched in 2020, PlayStation 5
							introduced new
							innovations that have taken play to extraordinary new heights, including an ultra-fast SSD, Tempest 3D
							Audio
							technology, and a generation of games that harness the console's lightning speed and graphical
							capabilities
							to create incredible new experiences. (Vertical stand sold separately)</p>
						<div>
							<div class="flex items-start">
								<div>
									<p class="text-2xl font-bold">30€</p>
									<p class="text-sm text-muted-foreground">per month</p>
								</div>
							</div>
						</div>

						<div *ngIf="stock > 0; else outOfStock" class="flex items-center gap-2">
							<span class="text-xs text-gray-400">{{ stock }} in stock</span>
							<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-green-500" fill="none"
									 viewBox="0 0 24 24"
									 stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
											d="M5 13l4 4L19 7"/>
							</svg>
						</div>
						<ng-template #outOfStock>
							<div class="flex items-center gap-2">
								<span class="text-xs text-red-500">Out of stock</span>
								<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
									<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
								</svg>
							</div>
						</ng-template>
						<div class="w-full mt-4">
							<app-add-to-cart-button></app-add-to-cart-button>
						</div>
					</div>
				</div>
			</a>
		</div>`
})
export class ProductCardComponent {
	@Input() stock: number = 15;
}
