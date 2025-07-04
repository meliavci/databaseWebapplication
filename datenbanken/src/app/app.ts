import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CartDrawerComponent } from './components/cart-drawer.component';
import { HeaderComponent } from './components/header.component';
import {FooterComponent} from './components/footer.component';

@Component({
	selector: 'app-root',
	imports: [RouterOutlet, CartDrawerComponent, HeaderComponent, FooterComponent],
	templateUrl: './app.html',
	styleUrl: './app.css'
})
export class App {
	protected title = 'DeviceDrop';
}
