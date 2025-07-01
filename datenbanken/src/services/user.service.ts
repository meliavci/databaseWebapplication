import { Pool } from "mysql2/promise";
import { User } from "../models/user.models";

export class UserService{
  constructor(private db: Pool) {}

  async createUser(user: User): Promise<User>{
    const [result] = await this.db.query(
      'INSERT INTO users (username, passwort, email, user_flag, name, address) VALUES (?, ?, ?, ?, ?, ?)',
      [user.username, user.password, user.email, user.user_flag, user.name, user.address]
    );
    user.id = (result as any).insertId;
    return user;
  }

  async findUserByEmail(email: string): Promise<User | null> {
    const [rows] = await this.db.query('SELECT * FROM users WHERE email = ?', [email]);
    if ((rows as any).length === 0) return null;
    const userRow = (rows as any)[0];
    return {
      id: userRow.id,
      username: userRow.username,
      password: userRow.passwort,
      email: userRow.email,
      user_flag: userRow.user_flag,
      name: userRow.name,
      address: userRow.address,
    };
  }

  async updatePassword(userId: number, newPassword: string): Promise<void>{
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.db.query(
      "UPDATE users Set passwort = ? WHERE id = ?",
      [hashedPassword, userId]
    );
  }
}
