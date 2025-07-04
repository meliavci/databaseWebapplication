import {Component} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {Router} from '@angular/router';

@Component({
	selector: "app-searchbar",
	standalone: true,
	imports: [
		FormsModule
	],
	template: `
		<div class="flex-1 max-w-3xl border border-neutral-700 rounded-full shadow-md p-2">
			<div class="relative">
				<input
					type="text"
					[(ngModel)]="searchQuery"
					(keyup.enter)="onSearch()"
					placeholder="Search products..."
					class="w-full pl-10 border-0 outline-0 text-white text-sm"
				>
				<div class="absolute inset-y-0 left-0 pl-3 flex items-center">
					<svg class="h-4 w-4 text-dark-400" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
					</svg>
				</div>
			</div>
		</div>
	`,
})
export class SearchbarComponent {
	searchQuery = '';
	showMobileMenu = false;

	constructor(
		private router: Router,
	) {}

	onSearch() {
		if (this.searchQuery.trim()) {
			this.router.navigate(['/products'], { queryParams: { search: this.searchQuery } });
		}
	}
}
