import {Component} from '@angular/core';
import {RouterLink} from '@angular/router';

@Component({
	selector: 'app-product-preview-section',
	standalone: true,
	imports: [
		RouterLink
	],
	template: `
		<div class="bg-neutral-950 text-white">
			<div class="mx-auto px-4 pt-30 pb-20 max-w-7xl sm:px-6 lg:px-8 py-12">
				<div class="text-center mb-12">
					<div class="text-center mb-20">
						<h2 class="text-3xl md:text-4xl font-bold mb-4">
							Most popular
						</h2>
						<p class="text-xl text-muted-foreground">
							The currently most sought-after products
						</p>
					</div>
					<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
						<a routerLink="/productDetail">
							<div
								class="group cursor-pointer transition-all duration-300 transform hover:-translate-y-2 overflow-hidden rounded-xl border border-neutral-700 p-6 items-start text-start">
								<div class="relative aspect-square p-6">
									<img src="/Product1.png" alt="Product"
											 class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
									/>
									<div
										class="absolute top-1 left-1 border border-neutral-700 px-5 py-1 rounded-full text-sm text-white">
										Gaming
									</div>
								</div>
								<div class="p-4">
									<h3 class="font-semibold mb-2 text-md font-bold text-primary text-gray-400">Playstation 5</h3>
									<p class="text-lg font-bold text-primary text-white">30€/month</p>
								</div>
							</div>
						</a>
						<a routerLink="/productDetail">
							<div
								class="group cursor-pointer transition-all duration-300 transform hover:-translate-y-2 overflow-hidden rounded-xl border border-neutral-700 p-6 items-start text-start">
								<div class="relative aspect-square overflow-hidden">
									<img src="/Product1.png" alt="Product"
											 class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
									/>
									<div
										class="absolute top-1 left-1 border border-neutral-700 px-5 py-1 rounded-full text-sm text-white">
										Gaming
									</div>
								</div>
								<div class="p-4">
									<h3 class="font-semibold mb-2 text-md font-bold text-primary text-gray-400">Playstation 5</h3>
									<p class="text-lg font-bold text-primary text-white">30€/month</p>
								</div>
							</div>
						</a>
						<a routerLink="/productDetail">
							<div
								class="group cursor-pointer transition-all duration-300 transform hover:-translate-y-2 overflow-hidden rounded-xl border border-neutral-700 p-6 items-start text-start">
								<div class="relative aspect-square overflow-hidden">
									<img src="/Product1.png" alt="Product"
											 class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
									/>
									<div
										class="absolute top-1 left-1 border border-neutral-700 px-5 py-1 rounded-full text-sm text-white">
										Gaming
									</div>
								</div>
								<div class="p-4">
									<h3 class="font-semibold mb-2 text-md font-bold text-primary text-gray-400">Playstation 5</h3>
									<p class="text-lg font-bold text-primary text-white">30€/month</p>
								</div>
							</div>
						</a>
						<a routerLink="/productDetail">
							<div
								class="group cursor-pointer transition-all duration-300 transform hover:-translate-y-2 overflow-hidden rounded-xl border border-neutral-700 p-6 items-start text-start">
								<div class="relative aspect-square overflow-hidden">
									<img src="/Product1.png" alt="Product"
											 class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
									/>
									<div
										class="absolute top-1 left-1 border border-neutral-700 px-5 py-1 rounded-full text-sm text-white">
										Gaming
									</div>
								</div>
								<div class="p-4">
									<h3 class="font-semibold mb-2 text-md font-bold text-primary text-gray-400">Playstation 5</h3>
									<p class="text-lg font-bold text-primary text-white">30€/month</p>
								</div>
							</div>
						</a>
					</div>
					<div class="text-center mt-12 flex items-center justify-center">
						<a routerLink="/category" size="large"
										class="flex items-center gap-2 text-md px-5 py-1 rounded-full bg-neutral-950 border border-neutral-700 hover:scale-105 delay-100">
							Show all products
							<svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M6 12H18M18 12L13 7M18 12L13 17" stroke="#FFFF" stroke-width="2" stroke-linecap="round"
											stroke-linejoin="round"/>
							</svg>
						</a>
					</div>
				</div>
			</div>
		</div>
	`
})
export class ProductPreviewSectionComponent {}
