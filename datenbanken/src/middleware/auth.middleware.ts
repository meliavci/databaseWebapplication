import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Wir erweitern das Request-Interface von Express, damit TypeScript
// weiß, dass es ein 'user'-Property geben kann.
export interface AuthenticatedRequest extends Request {
  user?: {
    id?: number;
    username: string;
    password: string;
    email: string;
    user_flag?: number;
    name?: string;
    address?: string;
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
  if (!process.env['JWT_SECRET']) {
    console.error('JWT_SECRET ist nicht konfiguriert.');
    res.status(401).json({ error: 'Kein Token bereitgestellt. Zugriff verweigert.' });
    return
  }

  jwt.verify(token, process.env['JWT_SECRET'], (err: any, user: any) => {
    if (err) {
      // z.B. Token abgelaufen oder ungültige Signatur
      res.status(403).json({ error: 'Token ist ungültig. Zugriff verweigert.' });
      return
    }
    // 4. Den entschlüsselten User an das Request-Objekt anhängen
    req.user = user;
    // 5. Zum nächsten Schritt (dem eigentlichen Controller) übergehen
    next();
  });
}
