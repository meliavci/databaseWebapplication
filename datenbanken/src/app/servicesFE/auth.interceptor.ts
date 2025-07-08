import {HttpErrorResponse, HttpInterceptorFn} from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './authFE';
import {catchError, EMPTY, throwError} from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
	const authService = inject(AuthService);
	const authToken = authService.getToken();

	let authReq = req;
	if (authToken) {
		authReq = req.clone({
			setHeaders: {
				Authorization: `Bearer ${authToken}`
			}
		});
	}

	return next(authReq).pipe(
		catchError((error: any) => {
			if (error instanceof HttpErrorResponse && error.status === 401) {
				console.log('Authentication token expired or invalid. Logging out.');
				authService.logout();
				return EMPTY;
			}
			return throwError(() => error);
		})
	);
};
