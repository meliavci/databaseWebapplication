import express from "express";
import { Pool } from "mysql2/promise";
import { UserService } from "../services/user.service";
import { authMiddleware, AuthenticatedRequest } from "../middleware/auth.middleware";
import bcrypt from "bcryptjs";
import { Server } from "socket.io";
import jwt from 'jsonwebtoken';

interface SocketManager {
	io: Server;
	userSockets: Map<number, string>;
}

export function createUserRouter(db: Pool, socketManager: SocketManager) {
	const router = express.Router();
	const userService = new UserService(db);

	// Get current user profile
	// @ts-ignore
	router.get('/me', authMiddleware, async (req: AuthenticatedRequest, res) => {
		try {
			const user = await userService.findUserById(req.user!.id!);
			if (!user) return res.status(404).json({ error: "User not found" });
			res.json(user);
		} catch (err) {
			console.error(err);
			res.status(500).json({ error: "Failed to fetch user profile" });
		}
	});

	// Change password
	// @ts-ignore
	router.patch('/me/password', authMiddleware, async (req: AuthenticatedRequest, res) => {
		const { oldPassword, newPassword } = req.body;
		if (!oldPassword || !newPassword) {
			return res.status(400).json({ error: "Old and new password are required" });
		}
		try {
			const user = await userService.findUserByIdWithPassword(req.user!.id!);
			if (!user || !user.password_hash) {
				return res.status(404).json({ error: "User not found" });
			}
			const isMatch = await bcrypt.compare(oldPassword, user.password_hash);
			if (!isMatch) {
				return res.status(400).json({ error: "Current password is incorrect" });
			}
			const newHash = await bcrypt.hash(newPassword, 10);
			await userService.updatePassword(user.id, newHash);
			res.json({ message: "Password updated successfully" });
		} catch (err) {
			console.error(err);
			res.status(500).json({ error: "Failed to update password" });
		}
	});

	// List all users (admin only)
	// @ts-ignore
	router.get('/', authMiddleware, async (req: AuthenticatedRequest, res) => {
		if (req.user?.role !== 'admin') {
			return res.status(403).json({ error: 'Access denied' });
		}
		try {
			const users = await userService.findAll();
			res.json(users);
		} catch (err) {
			console.error(err);
			res.status(500).json({ error: "Failed to fetch users" });
		}
	});

	// Update user role (admin only)
	// @ts-ignore
	router.patch('/:id/role', authMiddleware, async (req: AuthenticatedRequest, res) => {
		if (req.user?.role !== 'admin') {
			return res.status(403).json({ error: 'Access denied' });
		}
		const { role } = req.body;
		const userId = Number(req.params["id"]);
		if (!role || !['user', 'admin'].includes(role)) {
			return res.status(400).json({ error: "Invalid role" });
		}
		try {
			const updatedUser = await userService.updateRole(userId, role);
			if (!updatedUser) {
				return res.status(404).json({ error: "User not found" });
			}

			const userSocketId = socketManager.userSockets.get(userId);
			if (userSocketId) {
				const payload = { id: updatedUser.id, email: updatedUser.email, role: updatedUser.role };
				const secret = process.env['JWT_SECRET'];
				if (secret) {
					const newToken = jwt.sign(payload, secret, { expiresIn: '1h' });
					socketManager.io.to(userSocketId).emit('role_updated', { newRole: role, token: newToken });
					console.log(`Sent 'role_updated' event with new token to user ${userId}`);
				} else {
					console.error('JWT_SECRET is not configured. Cannot issue new token.');
				}
			}

			res.json(updatedUser);
		} catch (err) {
			console.error(err);
			res.status(500).json({ error: "Failed to update user role" });
		}
	});

	return router;
}
