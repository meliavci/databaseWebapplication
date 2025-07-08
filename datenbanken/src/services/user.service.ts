import { Pool, RowDataPacket } from "mysql2/promise";
import { User } from '../models/user.models';

export class UserService {
	constructor(private db: Pool) {}

	async createUser(userData: Omit<User, 'id'>): Promise<User> {
		const { username, email, password_hash, role, firstName, lastName, address } = userData;

		const [result] = await this.db.execute(
			'INSERT INTO users (username, email, password_hash, role, firstName, lastName, address) VALUES (?, ?, ?, ?, ?, ?, ?)',
			[username, email, password_hash, role, firstName || null, lastName || null, address || null]
		);
		const insertId = (result as any).insertId;
		return { id: insertId, ...userData };
	}

	async findUserByEmail(email: string): Promise<User | null> {
		const [rows] = await this.db.execute<RowDataPacket[]>('SELECT * FROM users WHERE email = ?', [email]);
		if (rows.length === 0) {
			return null;
		}
		return rows[0] as User;
	}

	async findUserByUsername(username: string): Promise<User | null> {
		const [rows] = await this.db.execute<RowDataPacket[]>('SELECT * FROM users WHERE username = ?', [username]);
		if (rows.length === 0) {
			return null;
		}
		return rows[0] as User;
	}

	async findUserById(id: number): Promise<User | null> {
		const [rows] = await this.db.execute<RowDataPacket[]>('SELECT id, username, email, role, firstName, lastName, address FROM users WHERE id = ?', [id]);
		if (rows.length === 0) {
			return null;
		}
		return rows[0] as User;
	}

	async findUserByIdWithPassword(id: number): Promise<User | null> {
		const [rows] = await this.db.execute<RowDataPacket[]>('SELECT * FROM users WHERE id = ?', [id]);
		if (rows.length === 0) {
			return null;
		}
		return rows[0] as User;
	}

	async findAll(): Promise<User[]> {
		const [rows] = await this.db.execute<RowDataPacket[]>('SELECT id, username, email, role, firstName, lastName FROM users');
		return rows as User[];
	}

	async updateRole(id: number, role: 'user' | 'admin'): Promise<User | null> {
		const [result] = await this.db.execute('UPDATE users SET role = ? WHERE id = ?', [role, id]);
		if ((result as any).affectedRows === 0) {
			return null;
		}
		return this.findUserById(id);
	}

	async updatePassword(id: number | undefined, newPasswordHash: string): Promise<void> {
		await this.db.execute('UPDATE users SET password_hash = ? WHERE id = ?', [newPasswordHash, id]);
	}
}
