import {HttpErrorResponse, HttpInterceptorFn} from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './authFE';
import {catchError, EMPTY, throwError} from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
	const authService = inject(AuthService);
	const authToken = authService.getToken();

	let authReq = req;
	if (authToken) {
		// Clone the request and add the authorization header
		authReq = req.clone({
			setHeaders: {
				Authorization: `Bearer ${authToken}`
			}
		});
	}

	// Pass the cloned or original request to the next handler
	return next(authReq).pipe(
		catchError((error: any) => {
			// Check if it's a 401 Unauthorized error
			if (error instanceof HttpErrorResponse && error.status === 401) {
				// Token is invalid or expired, log the user out
				console.log('Authentication token expired or invalid. Logging out.');
				authService.logout();
				// Prevent the error from propagating to the component
				return EMPTY;
			}
			// Re-throw other errors to be caught by the calling service
			return throwError(() => error);
		})
	);
};
