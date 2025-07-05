import {ApplicationConfig, LOCALE_ID, provideZoneChangeDetection} from '@angular/core';
import {provideRouter} from '@angular/router';
import {routes} from './app.routes';
import {provideHttpClient, withInterceptors} from '@angular/common/http';
import {authInterceptor} from './servicesFE/auth.interceptor';
import {registerLocaleData} from '@angular/common';
import localeDe from '@angular/common/locales/de';
import {provideAnimations} from '@angular/platform-browser/animations';

registerLocaleData(localeDe);

export const appConfig: ApplicationConfig = {
	providers: [
		provideZoneChangeDetection({eventCoalescing: true}),
		provideRouter(routes),
		provideHttpClient(withInterceptors([authInterceptor])),
		provideAnimations(),
		{provide: LOCALE_ID, useValue: 'de-DE'}
	]
};
