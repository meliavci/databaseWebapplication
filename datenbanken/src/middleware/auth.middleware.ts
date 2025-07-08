import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthenticatedRequest extends Request {
	user?: {
		id?: number;
		username?: string;
		email: string;
		role: "user" | "admin";
	};
}

export function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
	const authHeader = req.headers['authorization'];
	const token = authHeader && authHeader.split(' ')[1];

	if (token == null) {
		res.status(401).json({ error: 'Kein Token bereitgestellt. Zugriff verweigert.' });
		return
	}

	const secret = process.env['JWT_SECRET'];
	if (!secret) {
		console.error('JWT_SECRET ist nicht konfiguriert.');
		res.status(500).json({ error: 'Server-Konfigurationsfehler.' });
		return
	}

	// @ts-ignore
	jwt.verify(token, secret, (err: any, decoded: any) => {
		if (err) {
			return res.status(403).json({ error: 'Token ist ungültig. Zugriff verweigert.' });
		}
		req.user = decoded;
		next();
	});
}
