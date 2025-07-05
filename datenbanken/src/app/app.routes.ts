import {Routes} from '@angular/router';
import {HomeComponent} from './pages/home/home.component';
import {CategoryComponent} from './pages/category/category.component';
import {ProductDetailComponent} from './pages/productDetail/product-detail.component';
import {HowToComponent} from './pages/howTo/how-to.component';
import {SignInComponent} from './pages/signIn/sign-in.component';
import {SignUpComponent} from './pages/signUp/sign-up.component';
import {CheckoutComponent} from './pages/checkout/checkout.component';
import {ProfileComponent} from './pages/profiles/profile.component';

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
		path: "category/:categoryName", // Add this route
		component: CategoryComponent,
		title: "DeviceDrop - Category",
	},
	{
		path: 'product/:id',
		component: ProductDetailComponent,
		title: "DeviceDrop - Product Detail",
	},
	{
		path: "howTo",
		component: HowToComponent,
		title: "DeviceDrop - How To",
	},
	{
		path: "signIn",
		component: SignInComponent,
		title: "DeviceDrop - Sign In",
	},
	{
		path: "signUp",
		component: SignUpComponent,
		title: "DeviceDrop - Sign Up",
	},
	{
		path: "checkout",
		component: CheckoutComponent,
		title: "DeviceDrop - Checkout",
	},
	{
		path: "profile",
		component: ProfileComponent,
		title: "DeviceDrop - Profile",
	}
];
