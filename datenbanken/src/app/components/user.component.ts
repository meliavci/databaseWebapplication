import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
	selector: 'app-user',
	standalone: true,
	template: `
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-neutral-950 rounded-xl shadow-lg p-8 w-full max-w-sm text-white relative">
        <button class="absolute top-3 right-3 text-gray-400 hover:text-white" (click)="close.emit()">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2"
               viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round"
                  d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
        <div class="text-center space-y-4">
          <div class="text-2xl font-bold">User Profile</div>
          <div class="text-lg">Username:</div>
          <div class="bg-neutral-800 rounded-full px-4 py-2 inline-block font-mono text-blue-400">
            {{ username }}
          </div>
          <button
            class="mt-6 w-full py-2 rounded-full bg-white text-black font-semibold hover:bg-blue-600 hover:text-white transition"
            (click)="logout.emit()"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  `
})
export class UserComponent {
	@Input() username: string = '';
	@Output() logout = new EventEmitter<void>();
	@Output() close = new EventEmitter<void>();
}
