import { Component } from '@angular/core';
import { NgForOf } from '@angular/common';
import { ReviewComponent } from './review.component';

@Component({
	selector: 'app-review-section',
	standalone: true,
	imports: [
		NgForOf,
		ReviewComponent
	],
	template: `
		<div class="bg-neutral-900 text-white py-12 sm:py-20">
			<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div class="text-center mb-12">
					<h2 class="text-3xl sm:text-4xl font-bold tracking-tight">What Our Customers Say</h2>
					<p class="mt-4 text-lg text-gray-400">Real stories from satisfied tech renters.</p>
				</div>
				<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
					<app-review *ngFor="let review of reviews"
											[name]="review.name"
											[text]="review.text"
											[avatarUrl]="review.avatarUrl">
					</app-review>
				</div>
			</div>
		</div>
	`
})
export class ReviewSectionComponent {
	reviews = [
		{
			name: 'Melisa Avci',
			text: 'Renting a MacBook for my project was a breeze. The device was in perfect condition and the process was incredibly simple. Highly recommend!',
			avatarUrl: 'https://i.pravatar.cc/48?u=1'
		},
		{
			name: 'Lukas Mikhail',
			text: 'The iPhone I rented was top-notch. It helped me a lot during my business trip. Customer service was also very responsive and helpful.',
			avatarUrl: 'https://i.pravatar.cc/48?u=2'
		},
		{
			name: 'Samed Tosun',
			text: 'I needed a specific camera lens for a photoshoot, and DeviceDrop had it. The rental price was fair, and the quality was excellent. A fantastic service!',
			avatarUrl: 'https://i.pravatar.cc/48?u=3'
		},
		{
			name: 'Reynald Oleskow',
			text: 'As a student, buying new tech is expensive. Renting a tablet for my semester was the perfect solution. Affordable, easy, and hassle-free.',
			avatarUrl: 'https://i.pravatar.cc/48?u=4'
		},
		{
			name: 'Andree Reisch',
			text: 'The variety of products is amazing. I rented a high-end gaming PC for a week and it was an awesome experience. Will definitely use this service again.',
			avatarUrl: 'https://i.pravatar.cc/48?u=5'
		},
		{
			name: 'Vincent Duwald',
			text: 'From ordering to return, everything was smooth. The packaging was secure and the instructions were clear. A very professional and reliable company.',
			avatarUrl: 'https://i.pravatar.cc/48?u=6'
		}
	];
}
