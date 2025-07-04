import {Component, inject} from '@angular/core';
import {LogoComponent} from '../../components/logo.component';
import {FormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../servicesFE/authFE';

@Component({
	selector: "app-sign-in",
	standalone: true,
	imports: [
		LogoComponent,
		FormsModule,
		RouterLink
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
							<h2 class="text-2xl font-bold text-white">Sign In</h2>
							<p class="text-gray-400 mt-2">Welcome back!</p>
						</div>

						<form #authForm="ngForm" (ngSubmit)="onSubmit(authForm)">
							<div class="space-y-4">
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
									<label class="block text-sm font-medium text-white mb-2">Password</label>
									<input
										type="password"
										name="password"
										required
										minlength="6"
										ngModel
										class="w-full input border border-neutral-700 p-3 rounded-lg text-gray-400"
										placeholder="Enter your password"
									>
								</div>
								<button
									type="submit"
									class="w-full btn-primary font-semibold bg-white p-2 mt-3 rounded-full text-black disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
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
		</div>
	`
})
export class SignInComponent {
	private authService = inject(AuthService);
	private router = inject(Router);

	onSubmit(form: NgForm): void {
		if (form.invalid) {
			return;
		}

		console.log('Sende Login-Daten:', form.value);

		this.authService.login(form.value).subscribe({
			next: (response: any) => {
				console.log('Backend-Antwort (Login):', response);
				alert('Login erfolgreich!');
				this.router.navigate(['/']);
			},
			error: (err: { error: { error: any; }; }) => {
				console.error('Login fehlgeschlagen:', err);
				alert(`Fehler beim Login: ${err.error.error || 'Ungültige Anmeldedaten'}`);
			}
		});
	}
}
