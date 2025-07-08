import express from 'express';
import { Pool } from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserService } from '../services/user.service';
import { Server } from 'socket.io';

interface SocketManager {
	io: Server;
	userSockets: Map<number, string>;
}

export function createAuthRouter(db: Pool, socketManager: SocketManager) {
	const router = express.Router();
	const userService = new UserService(db);

	// Neuen Benutzer registrieren
	// @ts-ignore
	router.post('/register', async (req, res) => {
		const { name, username, email, password } = req.body;
		if (!name || !username || !email || !password) {
			return res.status(400).json({ error: 'All fields are required' });
		}

		try {
			const existingUser = await userService.findUserByEmail(email) || await userService.findUserByUsername(username);
			if (existingUser) {
				return res.status(409).json({ error: 'User with this email or username already exists' });
			}

			const [firstName, ...lastNameParts] = name.split(' ');
			const lastName = lastNameParts.join(' ');

			const password_hash = await bcrypt.hash(password, 10);
			const newUser = await userService.createUser({
				username,
				email,
				password_hash,
				role: 'user',
				firstName,
				lastName
			});

			socketManager.io.to('admin_room').emit('user_created', newUser);
			console.log(`'user_created' event emitted for new user: ${newUser.username}`);


			res.status(201).json({ message: 'User created successfully', userId: newUser.id });
		} catch (err) {
			console.error('Registration failed:', err);
			res.status(500).json({ error: 'Failed to register user' });
		}
	});

	// Benutzer anmelden
	// @ts-ignore
	router.post('/login', async (req, res) => {
		const { username, password } = req.body;
		if (!username || !password) {
			return res.status(400).json({ error: 'Username and password are required' });
		}

		try {
			const user = await userService.findUserByUsername(username);
			if (!user || !user.password_hash) {
				return res.status(401).json({ error: 'Invalid credentials' });
			}

			const isMatch = await bcrypt.compare(password, user.password_hash);
			if (!isMatch) {
				return res.status(401).json({ error: 'Invalid credentials' });
			}

			const payload = { id: user.id, email: user.email, role: user.role };
			const secret = process.env['JWT_SECRET'];
			if (!secret) {
				throw new Error('JWT_SECRET is not defined');
			}

			const token = jwt.sign(payload, secret, { expiresIn: '1h' });
			res.json({ token });
		} catch (err) {
			console.error('Login failed:', err);
			res.status(500).json({ error: 'Failed to log in' });
		}
	});

	return router;
}
