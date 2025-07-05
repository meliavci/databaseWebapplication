import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {UserService} from './user.service';
import {User} from '../models/user.models';

export class AuthService {
	constructor(private userService: UserService) {}

	async register(userData: any): Promise<User> {
		const existingUser = await this.userService.findUserByEmail(userData.email);
		if (existingUser) {
			throw new Error("E-Mail ist bereits vergeben");
		}

		const hashedPassword = await bcrypt.hash(userData.password, 10);

		// Split name into firstName and lastName
		const nameParts = userData.name?.split(' ') || [];
		const firstName = nameParts[0] || '';
		const lastName = nameParts.slice(1).join(' ') || '';

		const userToSave = {
			...userData,
			firstName,
			lastName,
			password_hash: hashedPassword,
			role: 'user' as const, // Set default role for new users
		};

		// Remove properties that are not direct columns in the user table
		delete userToSave.password;
		delete userToSave.name;

		// Call createUser with a single object containing all user data
		return await this.userService.createUser(userToSave);
	}

	async login(username: string, password: string): Promise<string | null> {
		const user = await this.userService.findUserByUsername(username);
		if (!user || !user.password_hash) {
			return null;
		}

		const passwordMatches = await bcrypt.compare(password, user.password_hash);
		if (!passwordMatches) {
			return null;
		}

		const payload = {
			id: user.id,
			email: user.email,
			role: user.role
		};

		if (!process.env['JWT_SECRET']) {
			throw new Error('JWT_SECRET ist nicht in der Umgebung definiert.');
		}

		return jwt.sign(
			payload,
			process.env['JWT_SECRET'],
			{ expiresIn: '1h' }
		);
	}
}
