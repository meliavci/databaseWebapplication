import { Component } from '@angular/core';

@Component({
	selector: "app-logo",
	imports: [
	],
	templateUrl: "../../../public/Logo2.svg",
	standalone: true
})
export class LogoComponent {
	fillColor: string = "#FFF";

	changeColor() {
		const r = Math.floor(Math.random() * 256);
		const g = Math.floor(Math.random() * 256);
		const b = Math.floor(Math.random() * 256);
		this.fillColor = `rgb(${r}, ${g}, ${b})`;
	}
}
