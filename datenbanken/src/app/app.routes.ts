import {Routes} from '@angular/router';
import {HomeComponent} from './pages/home/home.component';
import {CategoryComponent} from './pages/category/category.component';
import {ProductDetailComponent} from './pages/productDetail/product-detail.component';
import {HowToComponent} from './pages/howTo/how-to.component';
import {SignInComponent} from './pages/signIn/sign-in.component';
import {SignUpComponent} from './pages/signUp/sign-up.component';
import {CheckoutComponent} from './pages/checkout/checkout.component';
import {UserComponent} from './pages/profile/user.component';
import {AdminComponent} from './pages/profile/admin.component';

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
		path: "user",
		component: UserComponent,
		title: "DeviceDrop - User Profile",
	},
	{
		path: "admin",
		component: AdminComponent,
		title: "DeviceDrop - Admin Dashboard",
	}
];
