import {Component} from '@angular/core';
import {FooterComponent} from '../../components/footer.component';
import {HeaderComponent} from '../../components/header.component';
import {AppProductCard} from '../../components/products.component';

@Component({
	selector: 'app-home',
	standalone: true,
	imports: [
		FooterComponent,
		HeaderComponent,
		AppProductCard
	],
	template: `
		<div class="bg-neutral-950">
			<app-header></app-header>
			<app-products></app-products>
			<app-footer></app-footer>
		</div>
  `
})
export class CategoryComponent {}
