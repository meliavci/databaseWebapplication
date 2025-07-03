import {Component} from '@angular/core';
import {FooterComponent} from './footer.component';
import {HeaderComponent} from './header.component';

@Component({
	selector: 'app-user',
	standalone: true,
	imports: [
		FooterComponent,
		HeaderComponent,
	],
	template: `
		<div class="bg-neutral-950 text-white">
			<app-header></app-header>
			<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
				hallo
			</div>
			<app-footer></app-footer>
		</div>
  `
})
export class UserComponent {}
