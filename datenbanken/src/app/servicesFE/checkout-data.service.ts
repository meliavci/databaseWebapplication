import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface PersonalData {
	firstName: string;
	lastName: string;
	email: string;
	phone?: string;
}

export interface DeliveryAddress {
	street: string;
	houseNumber: string;
	postalCode: string;
	city: string;
}

export interface PaymentData {
	selectedMethod: 'card' | 'paypal' | 'klarna';
	cardholder?: string;
}

@Injectable({
	providedIn: 'root'
})
export class CheckoutDataService {
	private personalDataSource = new BehaviorSubject<PersonalData | null>(null);
	personalData$ = this.personalDataSource.asObservable();

	private deliveryAddressSource = new BehaviorSubject<DeliveryAddress | null>(null);
	deliveryAddress$ = this.deliveryAddressSource.asObservable();

	private paymentDataSource = new BehaviorSubject<PaymentData | null>(null);
	paymentData$ = this.paymentDataSource.asObservable();

	setPersonalData(data: PersonalData) {
		this.personalDataSource.next(data);
	}

	setDeliveryAddress(data: DeliveryAddress) {
		this.deliveryAddressSource.next(data);
	}

	setPaymentData(data: PaymentData) {
		this.paymentDataSource.next(data);
	}
}
