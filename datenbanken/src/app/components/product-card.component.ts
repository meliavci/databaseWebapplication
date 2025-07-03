import {Component} from '@angular/core';
import {AddToCartButtonComponent} from './add-to-cart-button.component';

@Component({
	selector: 'app-product-card',
	standalone: true,
	imports: [
		AddToCartButtonComponent,
	],
	template: `
		<div
			class="rounded-xl border border-neutral-700 text-white overflow-hidden shadow-md hover:shadow-xl transition-shadow items-start">
			<div class="flex flex-col justify-between text-center items-center p-6">
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
						<div class="w-full">
							<app-add-to-cart-button></app-add-to-cart-button>
						</div>
					</div>
				</div>
			</div>
		</div>`
})
export class ProductCardComponent {}
