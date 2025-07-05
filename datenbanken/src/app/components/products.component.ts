import { Component, Input } from '@angular/core';
import { ProductCardComponent } from './product-card.component';
import { Product } from '../../models/product.models';
import { NgForOf } from '@angular/common';

@Component({
	selector: 'app-products',
	standalone: true,
	imports: [
		ProductCardComponent,
		NgForOf
	],
	template: `
    <div class="max-w-7xl mx-auto justify-center px-4 sm:px-6 lg:px-8 py-10">
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 mb-12 sm:mb-20">
        <app-product-card *ngFor="let product of products" [product]="product"></app-product-card>
      </div>
    </div>`
})
export class ProductsComponent {
	@Input() products: Product[] = [];
}
