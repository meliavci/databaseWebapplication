import { Component, Input } from '@angular/core';
import { NgForOf } from '@angular/common';

@Component({
	selector: 'app-review',
	standalone: true,
	imports: [
		NgForOf
	],
	template: `
		<div class="card block border border-neutral-700 rounded-3xl p-6 bg-neutral-900 hover:border-blue-500 transition-all duration-300 ease-in-out p-6 rounded-lg h-full flex flex-col">
			<div class="flex items-center mb-4">
				<div class="flex items-center mr-4">
					<span *ngFor="let i of [1,2,3,4,5]" class="text-blue-500">★</span>
				</div>
				<p class="font-semibold text-white">{{ name }}</p>
			</div>
			<p class="text-gray-400 flex-grow italic">"{{ text }}"</p>
		</div>
	`
})
export class ReviewComponent {
	@Input() name: string = 'Anonymous';
	@Input() text: string = 'No comment provided.';
	@Input() avatarUrl: string = 'https://i.pravatar.cc/48';
}
