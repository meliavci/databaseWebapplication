import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductService } from '../servicesFE/product.service';
import { Product } from '../../models/product.models';
import { NgForOf, NgIf } from '@angular/common';
import { ProductCardComponent } from './product-card.component';

@Component({
	selector: 'app-product-preview-section',
	standalone: true,
	imports: [
		RouterLink,
		NgForOf,
		NgIf,
		ProductCardComponent
	],
	template: `
		<div class="bg-neutral-950 text-white">
			<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
				<div class="text-center mb-12">
					<h2 class="text-3xl sm:text-4xl font-bold tracking-tight">Featured Products</h2>
					<p class="mt-4 text-lg text-gray-400">Discover our most popular tech for rent.</p>
				</div>
				<div *ngIf="displayedProducts.length > 0"
						 class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
					<app-product-card *ngFor="let product of displayedProducts" [product]="product"></app-product-card>
				</div>
				<div class="mt-12 text-center">
					<a routerLink="/category"
						 class="inline-block bg-white text-black font-semibold px-6 py-3 rounded-full hover:bg-gray-200 transition-colors">
						View All Products
					</a>
				</div>
			</div>
		</div>
	`
})
export class ProductPreviewSectionComponent implements OnInit {
	private productService = inject(ProductService);
	displayedProducts: Product[] = [];

	ngOnInit(): void {
		this.productService.getProducts().subscribe(products => {
			this.displayedProducts = this.shuffleArray(products).slice(0, 4);
		});
	}

	private shuffleArray(array: any[]): any[] {
		for (let i = array.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[array[i], array[j]] = [array[j], array[i]];
		}
		return array;
	}
}
