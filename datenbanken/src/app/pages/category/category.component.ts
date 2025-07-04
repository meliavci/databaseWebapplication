import {Component} from '@angular/core';
import {AppProductCard} from '../../components/products.component';

@Component({
	selector: 'app-category',
	standalone: true,
	imports: [
		AppProductCard
	],
	template: `
		<div class="bg-neutral-950 text-white">
			<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
				<div class="max-w-4xl mx-auto text-center">
					<h1 class="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
						<span class="block bg-gradient-to-r from-white to-blue-600 bg-clip-text text-transparent">
								Alle Produkte
							</span>
					</h1>
					<p class="text-lg text-muted-foreground text-gray-400">
						9 items found
					</p>
				</div>
			</div>
			<app-products></app-products>
		</div>
  `
})
export class CategoryComponent {}
