import {Component} from '@angular/core';
import {ReviewComponent} from './review.component';

@Component({
	selector: "app-review-section",
	standalone: true,
	imports: [
		ReviewComponent
	],
	template: `
		<div class="bg-neutral-900">
			<div class="max-w-7xl mx-auto containerPadding rounded-xl items-center pt-30 pb-40">
				<div class="px-4 sm:px-6 lg:px-8 flex flex-col items-center w-full text-white">
					<div class="text-center mb-15">
						<h2 class="text-3xl md:text-4xl font-bold mb-4">
							Reviews
						</h2>
						<p class="text-xl text-muted-foreground">
							Hear the opinions of our customers
						</p>
					</div>
					<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full gap-8 justify-between">
						<app-review></app-review>
						<app-review></app-review>
						<app-review></app-review>
					</div>
				</div>
			</div>
		</div>
	`
})
export class ReviewSectionComponent {}
