import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'; // Importieren
import {UserService} from './user.service';
import {User} from '../models/user.models';

export class AuthService {
  constructor(private userService: UserService) {}

  // Die register-Methode bleibt gleich...
  async register(userData: Omit<User, "id" | "user_flag" | "name" | "address">): Promise<User> {
    const existingUser = await this.userService.findUserByEmail(userData.email);
    if (existingUser) {
      throw new Error("E-Mail ist bereits vergeben");
    }
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const userToSave = { ...userData, password: hashedPassword };
    return await this.userService.createUser(userToSave);
  }

  /**
   * Prüft Login-Daten und gibt bei Erfolg einen JWT zurück.
   * @returns Einen JWT-String oder null bei Fehlschlag.
   */
  async login(username: string, password: string): Promise<string | null> {
    const user = await this.userService.findUserByUsername(username);
    if (!user) return null;

    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) return null;

    // Login erfolgreich, jetzt Token erstellen!
    // 1. Definiere die "Payload" - die Daten, die im Token gespeichert werden sollen.
    //    Halte sie minimal! Die User-ID ist ideal.
    const payload = {
      id: user.id,
      email: user.email
      // Füge hier keine sensiblen Daten wie das Passwort hinzu!
    };

    // 2. Signiere den Token mit deinem Secret und setze eine Ablaufzeit.
    if (!process.env['JWT_SECRET']) {
      throw new Error('JWT_SECRET ist nicht in der Umgebung definiert.');
    }

    return jwt.sign(
      payload,
      process.env['JWT_SECRET'],
      {expiresIn: '1h'} // z.B. 1 Stunde gültig
    );
  }
}
