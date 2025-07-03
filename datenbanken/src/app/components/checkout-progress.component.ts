import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Step {
	number: number;
	title: string;
	icon: string;
}

@Component({
	selector: 'app-checkout-progress',
	standalone: true,
	imports: [CommonModule],
	template: `
		<div class="flex items-center justify-between">
			<ng-container *ngFor="let step of steps; let i = index; let isLast = last">
				<div class="flex items-center">
					<div class="flex flex-col items-center text-center w-24">
						<div class="w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300"
								 [ngClass]="{
                   'bg-white border-white text-neutral-900': currentStep === step.number,
                   'bg-neutral-800 border-neutral-600': currentStep < step.number,
                   'border-green-500 bg-neutral-950': currentStep > step.number
                 }">
							<ng-container *ngIf="currentStep > step.number; else stepIcon">
								<svg class="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
								</svg>
							</ng-container>
							<ng-template #stepIcon>
								<ng-container [ngSwitch]="step.icon">
									<svg *ngSwitchCase="'user'" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
									<svg *ngSwitchCase="'location'" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
									<svg *ngSwitchCase="'payment'" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>
									<svg *ngSwitchCase="'check-circle'" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
								</ng-container>
							</ng-template>
						</div>
						<div class="mt-2 text-sm font-medium transition-colors" [ngClass]="{'text-white': currentStep >= step.number, 'text-gray-500': currentStep < step.number}">
							{{ step.title }}
						</div>
					</div>
				</div>
				<div *ngIf="!isLast" class="flex-grow h-0.5 mt-[-1rem]" [ngClass]="{'bg-green-500': currentStep > step.number, 'bg-neutral-700': currentStep <= step.number}"></div>
			</ng-container>
		</div>
	`
})
export class CheckoutProgressComponent {
	@Input() currentStep: number = 1;

	steps: Step[] = [
		{ number: 1, title: 'Personal Data', icon: 'user' },
		{ number: 2, title: 'Delivery Address', icon: 'location' },
		{ number: 3, title: 'Payment', icon: 'payment' },
		{ number: 4, title: 'Confirmation', icon: 'check-circle' },
	];
}
