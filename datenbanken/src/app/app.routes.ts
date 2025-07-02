import {Routes} from '@angular/router';
import {HomeComponent} from './pages/home/home.component';
import {CategoryComponent} from './pages/category/category.component';

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
	}
];
