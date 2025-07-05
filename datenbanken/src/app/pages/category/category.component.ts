import { Component, inject, OnInit } from '@angular/core';
import { ProductsComponent } from '../../components/products.component';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../servicesFE/product.service';
import { Product } from '../../../models/product.models';
import { combineLatest, Observable } from 'rxjs';
import { AsyncPipe, NgIf, TitleCasePipe } from '@angular/common';
import { switchMap, map, startWith, tap } from 'rxjs/operators';

@Component({
	selector: 'app-category',
	standalone: true,
	imports: [
		ProductsComponent,
		AsyncPipe,
		NgIf,
		TitleCasePipe
	],
	template: `
		<div class="bg-neutral-950 text-white">
			<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
				<div class="max-w-4xl mx-auto text-center">
					<h1 class="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
						<span class="block bg-gradient-to-r from-white to-blue-600 bg-clip-text text-transparent">
								{{ (categoryTitle$ | async) | titlecase }}
							</span>
					</h1>
					<p *ngIf="productCount !== null" class="text-lg text-muted-foreground text-gray-400">
						{{ productCount }} items found
					</p>
				</div>
			</div>
			<app-products [products]="(products$ | async) || []"></app-products>
		</div>
	`
})
export class CategoryComponent implements OnInit {
	private route = inject(ActivatedRoute);
	private productService = inject(ProductService);

	products$!: Observable<Product[]>;
	categoryTitle$!: Observable<string>;
	productCount: number | null = null;

	ngOnInit(): void {
		const params$ = combineLatest([
			this.route.paramMap,
			this.route.queryParamMap
		]);

		this.products$ = params$.pipe(
			switchMap(([pathParams, queryParams]) => {
				const category = pathParams.get('categoryName') || undefined;
				const search = queryParams.get('search') || undefined;
				return this.productService.getProducts(category, search);
			}),
			tap(products => {
				this.productCount = products.length;
			})
		);

		this.categoryTitle$ = params$.pipe(
			map(([pathParams, queryParams]) => {
				const search = queryParams.get('search');
				if (search) {
					return `Search results for "${search}"`;
				}
				return pathParams.get('categoryName') || 'All Products';
			}),
			startWith('All Products')
		);
	}
}
