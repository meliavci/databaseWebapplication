import {Component} from '@angular/core';

@Component({
	selector: 'app-hero-section',
	standalone: true,
	imports: [
	],
	template: `
		<div class="text-white bg-neutral-950">
			<section class="relative">
				<div class="container mx-auto px-4 relative items-center pt-30 pb-40">
					<div class="max-w-4xl mx-auto text-center space-y-8">
						<h1 class="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
							Premium Technology
							<span class="block bg-gradient-to-r from-white to-blue-600 bg-clip-text text-transparent">
								without obligation to buy
							</span>
						</h1>
					</div>
					<p class="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed text-center mt-5">
						No deposit, no commitment, maximum flexibility.
					</p>
					<div class="flex flex-col sm:flex-row items-center gap-4 justify-center mt-15">
						<button size="large" class="flex items-center gap-2 text-md px-5 py-1 rounded-full bg-white text-black">
							Discover now
							<svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M6 12H18M18 12L13 7M18 12L13 17" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
							</svg>
						</button>
						<button size="large" class="flex items-center gap-2 text-md px-5 py-1 rounded-full bg-neutral-950 border border-neutral-700">
							This is how it works
							<svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M6 12H18M18 12L13 7M18 12L13 17" stroke="#FFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
							</svg>
						</button>
					</div>
				</div>

			</section>
		</div>
	`
})
export class HeroSectionComponent {}
