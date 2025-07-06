import {Component} from '@angular/core';

@Component({
	selector: 'app-how-to',
	imports: [
	],
	standalone: true,
	template: `
		<div class="bg-neutral-950 text-white min-h-screen">
			<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
				<div class="max-w-4xl mx-auto text-center space-y-8">
					<h1 class="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
						How to use
						<span class="block bg-gradient-to-r from-white to-blue-600 bg-clip-text text-transparent">
							DeviceDrop
						</span>
					</h1>
				</div>
				<section class="py-20 px-6">
					<div class="max-w-7xl mx-auto">
						<div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
							<div class="animate-fade-in-left delay-200 border border-neutral-700 rounded-3xl p-6">
								<div class="glass-morphism-strong rounded-3xl p-12 neon-glow-hover transition-all duration-700 group hover:scale-105">
									<div class="flex items-center mb-8">
										<div class="w-10 h-10 rounded-full flex border border-neutral-700 p-10 items-center justify-center text-4xl font-black shadow-2xl mr-6 group-hover:rotate-12 transition-transform duration-500">
											01
										</div>
										<div class="h-px flex-1 bg-gradient-to-r from-accent-500/50 to-transparent"></div>
									</div>
									<h3 class="text-4xl font-bold mb-6 text-gradient">Choose Your Products</h3>
									<p class="text-md text-gray-300 leading-relaxed mb-8">
										Browse through our extensive catalog of cutting-edge tech products. Select the items you want to rent and choose your preferred rental duration. Add everything to your cart - from smartphones to gaming consoles.
									</p>
									<div class="flex flex-wrap gap-3">
										<span class="px-3 py-2 bg-accent-500/20 rounded-full text-xs font-medium border border-neutral-700">Smartphones</span>
										<span class="px-3 py-2 bg-neon-blue/20 rounded-full text-xs font-medium border border-neutral-700">Camera</span>
										<span class="px-3 py-2 bg-neon-purple/20 rounded-full text-xs font-medium border border-neutral-700">Gaming</span>
										<span class="px-3 py-2 bg-neon-purple/20 rounded-full text-xs font-medium border border-neutral-700">Audio</span>
										<span class="px-3 py-2 bg-neon-purple/20 rounded-full text-xs font-medium border border-neutral-700">Wearables</span>
									</div>
								</div>
							</div>
							<div class="animate-fade-in-right delay-300 border border-neutral-700 rounded-3xl p-6">
								<div class="glass-morphism-strong rounded-3xl p-12 neon-glow-hover transition-all duration-700 group hover:scale-105">
									<div class="flex items-center mb-8">
										<div class="w-10 h-10 rounded-full flex border border-neutral-700 p-10 items-center justify-center text-4xl font-black shadow-2xl mr-6 group-hover:rotate-12 transition-transform duration-500">
											02
										</div>
										<div class="h-px flex-1 bg-gradient-to-r from-neon-purple/50 to-transparent"></div>
									</div>
									<h3 class="text-4xl font-bold mb-6 text-gradient-2">Complete Your Order</h3>
									<p class="text-md text-gray-300 leading-relaxed mb-8">
										Enter your delivery address and payment details. We'll run a quick eligibility check to verify your information. Choose your preferred delivery date and confirm your order.
									</p>
									<ul class="space-y-3 lis0t-none text-gray-30">
										<li class="flex items-center">
											<div class="w-3 h-3 bg-white rounded-sm mr-4"></div>
											<span>Instant eligibility check</span>
										</li>
										<li class="flex items-center">
											<div class="w-3 h-3 bg-white rounded-sm mr-4"></div>
											<span>Flexible delivery scheduling</span>
										</li>
										<li class="flex items-center">
											<div class="w-3 h-3 bg-white rounded-sm mr-4"></div>
											<span>Secure payment processing</span>
										</li>
									</ul>
								</div>
							</div>
						</div>
						<div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
							<div class="animate-fade-in-left delay-500 border border-neutral-700 rounded-3xl p-6">
								<div class="glass-morphism-strong rounded-3xl p-12 neon-glow-hover transition-all duration-700 group hover:scale-105">
									<div class="flex items-center mb-8">
										<div class="w-10 h-10 rounded-full flex border border-neutral-700 p-10 items-center justify-center text-4xl font-black shadow-2xl mr-6 group-hover:rotate-12 transition-transform duration-500">
											03
										</div>
										<div class="h-px flex-1 bg-gradient-to-r from-neon-green/50 to-transparent"></div>
									</div>
									<h3 class="text-4xl font-bold mb-6 text-gradient">Enjoy Your Products</h3>
									<p class="text-md text-gray-300 leading-relaxed mb-8">
										Receive your items at your doorstep, carefully packaged and ready to use. Make the most of your rented products during your rental period. Our products are thoroughly checked and cleaned before shipping.
									</p>
									<div class="grid grid-cols-2 gap-4">
										<div class="glass-morphism flex flex-col gap-2 rounded-xl p-4 text-center border border-neutral-700 items-center">
											<svg class="w-6 h-6" viewBox="0 0 17 17" version="1.1"
													 xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
												<path
													d="M8.517-0.035l-8.517 3.221v10.693l8.5 3.188 8.5-3.188v-10.692l-8.483-3.222zM15.084 3.528l-2.586 0.97-6.557-2.489 2.575-0.974 6.568 2.493zM8.5 5.997l-6.581-2.468 2.609-0.986 6.551 2.487-2.579 0.967zM1 4.253l7 2.625v8.932l-7-2.625v-8.932zM9 15.81v-8.932l7-2.625v8.932l-7 2.625z"
													fill="#FFFF"/>
											</svg>
											<div class="text-sm text-gray-400">Premium Packaging</div>
										</div>
										<div class="glass-morphism flex flex-col gap-2 rounded-xl p-4 text-center border border-neutral-700 items-center">
											<svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
												<path fill-rule="evenodd" clip-rule="evenodd" d="M21.5821 5.54289C21.9726 5.93342 21.9726 6.56658 21.5821 6.95711L10.2526 18.2867C9.86452 18.6747 9.23627 18.6775 8.84475 18.293L2.29929 11.8644C1.90527 11.4774 1.89956 10.8443 2.28655 10.4503C2.67354 10.0562 3.30668 10.0505 3.70071 10.4375L9.53911 16.1717L20.1679 5.54289C20.5584 5.15237 21.1916 5.15237 21.5821 5.54289Z" fill="#FFFF"/>
											</svg>
											<div class="text-sm text-gray-400">Quality Assured</div>
										</div>
									</div>
								</div>
							</div>
							<div class="animate-fade-in-right delay-700 border border-neutral-700 rounded-3xl p-6">
								<div class="glass-morphism-strong rounded-3xl p-12 neon-glow-hover transition-all duration-700 group hover:scale-105">
									<div class="flex items-center mb-8">
										<div class="w-10 h-10 rounded-full flex border border-neutral-700 p-10 items-center justify-center text-4xl font-black shadow-2xl mr-6 group-hover:rotate-12 transition-transform duration-500">
											04
										</div>
										<div class="h-px flex-1 bg-gradient-to-r from-accent-500/50 to-transparent"></div>
									</div>
									<h3 class="text-4xl font-bold mb-6 text-gradient">Return or Keep</h3>
									<p class="text-md text-gray-300 leading-relaxed mb-8">
										When your rental period ends, you have multiple flexible options:
									</p>
									<div class="space-y-4">
										<ul class="space-y-3 lis0t-none text-gray-30">
											<li class="flex items-center">
												<div class="w-3 h-3 bg-white rounded-sm mr-4"></div>
												<span class="text-gray-300">Return the products using our free shipping label</span>
											</li>
											<li class="flex items-center">
												<div class="w-3 h-3 bg-white rounded-sm mr-4"></div>
												<span class="text-gray-300">Extend your rental period</span>
											</li>
											<li class="flex items-center">
												<div class="w-3 h-3 bg-white rounded-sm mr-4"></div>
												<span class="text-gray-300">Buy the product at a reduced price</span>
											</li>
											<li class="flex items-center">
												<div class="w-3 h-3 bg-white rounded-sm mr-4"></div>
												<span class="text-gray-300">Switch to different products</span>
											</li>
										</ul>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>
			</div>
		</div>
	`
})
export class HowToComponent {}
