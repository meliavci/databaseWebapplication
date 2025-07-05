import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
	selector: 'app-searchbar',
	standalone: true,
	imports: [
		FormsModule
	],
	template: `
		<div class="flex-1 max-w-3xl border border-neutral-700 rounded-full shadow-md px-3">
			<div class="relative">
				<input
					type="text"
					[(ngModel)]="searchQuery"
					(keyup.enter)="onSearch()"
					placeholder="Search products..."
					class="w-full bg-transparent pl-10 pr-4 py-1 rounded-full focus:outline-none"
				/>
				<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
					<svg class="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
						<path fill-rule="evenodd"
									d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
									clip-rule="evenodd"></path>
					</svg>
				</div>
			</div>
		</div>
	`
})
export class SearchbarComponent {
	searchQuery: string = '';
	private router = inject(Router);

	onSearch(): void {
		if (this.searchQuery.trim()) {
			this.router.navigate(['/category'], { queryParams: { search: this.searchQuery.trim() } });
		}
	}
}
