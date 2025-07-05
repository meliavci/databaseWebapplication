import {Component, inject} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {LogoComponent} from '../../components/logo.component';
import {RouterLink} from '@angular/router';
import{ AuthService } from '../../servicesFE/authFE';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';

@Component({
	selector: "app-sign-up",
	standalone: true,
	imports: [
		FormsModule,
		LogoComponent,
		RouterLink,
		NgIf
	],
	template: `
		<div class="bg-neutral-900 text-white">
			<div class="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
				<div class="max-w-md w-full">
					<div class="card border border-neutral-700 rounded-3xl p-8 bg-neutral-950 shadow-xl">
						<div class="text-center mb-6">
							<div class="w-14 h-14 border border-neutral-700 rounded-lg flex items-center justify-center mx-auto mb-4">
								<app-logo class="w-7 h-8"></app-logo>
							</div>
							<h2 class="text-2xl font-bold text-white">Create Account</h2>
							<p class="text-gray-400 mt-2">Start your tech rental journey!</p>
						</div>

						<form #authForm="ngForm" (ngSubmit)="onSubmit(authForm)">
							<div class="space-y-4">
								<div>
									<label class="block text-sm font-medium text-white mb-2">Full Name</label>
									<input
										type="text"
										name="name"
										required
										ngModel
										class="w-full input border border-neutral-700 p-3 rounded-lg text-gray-400"
										placeholder="Enter your full name"
									>
								</div>
								<div>
									<label class="block text-sm font-medium text-white mb-2">Username</label>
									<input
										type="text"
										name="username"
										required
										ngModel
										class="w-full input border border-neutral-700 p-3 rounded-lg text-gray-400"
										placeholder="Enter your username"
									>
								</div>
								<div>
									<label class="block text-sm font-medium text-white mb-2">Email Address</label>
									<input
										type="email"
										name="email"
										required
										ngModel
										class="w-full input border border-neutral-700 p-3 rounded-lg text-gray-400"
										placeholder="Enter your email"
									>
								</div>
								<div>
									<label class="block text-sm font-medium text-white mb-2">Password</label>
									<input
										type="password"
										name="password"
										required
										ngModel
										minlength="6"
										class="w-full input border border-neutral-700 p-3 rounded-lg text-gray-400"
										placeholder="Enter your password (min 6 characters)"
									>
								</div>
								<button
									type="submit"
									[disabled]="!authForm.valid"
									class="w-full btn-primary font-semibold bg-white p-2 mt-3 rounded-full text-black disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
									<span *ngIf="isLoading" class="loading-spinner mr-2"></span>
									Create Account
								</button>
							</div>
						</form>

						<div class="mt-6 text-center border-t border-neutral-700 pt-4">
							<p class="text-gray-400 text-sm">
								Already have an account?
								<a routerLink="/signIn"
									 class="text-white font-medium ml-1">
									Sign in
								</a>
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	`
})
export class SignUpComponent {
	private authService = inject(AuthService);
	private router = inject(Router);

	isLoading = false;
	errorMessage: string | null = null;

	onSubmit(form: NgForm): void {
		if (!form.valid) {
			console.log("Formular ist ungültig.");
			return;
		}

		this.isLoading = true;
		this.errorMessage = null;

		const { name, username, email, password } = form.value;

		this.authService.register({ name, username, email, password }).subscribe({
			next: (response) => {
				console.log('Registrierung erfolgreich!', response);
				this.isLoading = false;

				alert('Dein Account wurde erfolgreich erstellt! Bitte logge dich nun ein.');

				this.router.navigate(['/signIn']);
			},
			error: (err) => {
				console.error('Registrierung fehlgeschlagen!', err);
				this.errorMessage = err.error?.message || 'Registrierung fehlgeschlagen. Bitte versuche es später erneut.';
				this.isLoading = false;
			}
		});
	}
}
