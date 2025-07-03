import {Routes} from '@angular/router';
import {HomeComponent} from './pages/home/home.component';
import {CategoryComponent} from './pages/category/category.component';
import {ProductDetailComponent} from './pages/productDetail/product-detail.component';
import {HowToComponent} from './pages/howTo/how-to.component';

export const routes: Routes = [
	{
		path: "",
		component: HomeComponent
	},
	{
		path: "home",
		component: HomeComponent,
		title: "DeviceDrop - Home"
	},
	{
		path: "category",
		component: CategoryComponent,
		title: "DeviceDrop - Category",
	},
	{
		path: "productDetail",
		component: ProductDetailComponent,
		title: "DeviceDrop - Product",
	},
	{
		path: "howTo",
		component: HowToComponent,
		title: "DeviceDrop - How To",
	}
];
