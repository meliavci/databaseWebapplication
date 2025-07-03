import {Component} from '@angular/core';
import {HeaderComponent} from '../../components/header.component';
import {FooterComponent} from '../../components/footer.component';
import {LogoComponent} from '../../components/logo.component';
import {FormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';

@Component({
	selector: "app-sign-in",
	standalone: true,
	imports: [
		HeaderComponent,
		FooterComponent,
		LogoComponent,
		FormsModule,
		RouterLink
	],
	template: `
		<div class="bg-neutral-900 text-white">
			<app-header></app-header>
			<div class="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
				<div class="max-w-md w-full">
					<div class="card border border-neutral-700 rounded-3xl p-8 bg-neutral-950 shadow-xl">
						<div class="text-center mb-6">
							<div class="w-14 h-14 border border-neutral-700 rounded-lg flex items-center justify-center mx-auto mb-4">
								<app-logo class="w-7 h-8"></app-logo>
							</div>
							<h2 class="text-2xl font-bold text-white">Sign In</h2>
							<p class="text-gray-400 mt-2">Welcome back!</p>
						</div>

						<form #authForm="ngForm">
							<div class="space-y-4">
								<div>
									<label class="block text-sm font-medium text-white mb-2">Username</label>
									<input
										type="text"
										name="username"
										required
										class="w-full input border border-neutral-700 p-3 rounded-lg text-gray-400"
										placeholder="Enter your username"
									>
								</div>

								<div>
									<label class="block text-sm font-medium text-white mb-2">Password</label>
									<input
										type="password"
										name="password"
										required
										minlength="6"
										class="w-full input border border-neutral-700 p-3 rounded-lg text-gray-400"
										placeholder="Enter your password"
									>
								</div>
								<button
									type="submit"
									class="w-full btn-primary font-semibold bg-white p-2 mt-3 rounded-lg text-black disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
									<span class="loading-spinner mr-2"></span>
									Log In
								</button>
							</div>
						</form>

						<div class="mt-6 text-center border-t border-neutral-700 pt-4">
							<p class="text-gray-400 text-sm">
								Don't have an account?
								<a routerLink="/signUp"
									 class="text-white font-medium ml-1 cursor-pointer">
									Sign up
								</a>
							</p>
						</div>
					</div>
				</div>
			</div>
			<app-footer></app-footer>
		</div>
  `
})
export class SignInComponent {}
