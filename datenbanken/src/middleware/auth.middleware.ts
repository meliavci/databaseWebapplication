import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Wir erweitern das Request-Interface von Express, damit TypeScript
// weiß, dass es ein 'user'-Property geben kann.
export interface AuthenticatedRequest extends Request {
	user?: {
		id?: number;
		username?: string; // username is not in the token, so it's optional
		email: string;
		role: "user" | "admin";
	};
}

export function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
	// 1. Token aus dem Header extrahieren (Format: "Bearer TOKEN")
	const authHeader = req.headers['authorization'];
	const token = authHeader && authHeader.split(' ')[1];

	// 2. Prüfen, ob ein Token vorhanden ist
	if (token == null) {
		res.status(401).json({ error: 'Kein Token bereitgestellt. Zugriff verweigert.' });
		return
	}

	// 3. Den Token verifizieren
	const secret = process.env['JWT_SECRET'];
	if (!secret) {
		console.error('JWT_SECRET ist nicht konfiguriert.');
		// Use a more generic error message for the client
		res.status(500).json({ error: 'Server-Konfigurationsfehler.' });
		return
	}

	// @ts-ignore
	jwt.verify(token, secret, (err: any, decoded: any) => {
		if (err) {
			// z.B. Token abgelaufen oder ungültige Signatur
			return res.status(403).json({ error: 'Token ist ungültig. Zugriff verweigert.' });
		}
		// 4. Den entschlüsselten User an das Request-Objekt anhängen
		req.user = decoded;
		// 5. Zum nächsten Schritt (dem eigentlichen Controller) übergehen
		next();
	});
}
