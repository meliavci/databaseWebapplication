import express from "express";
import { AuthService } from '../services/auth.service';
import { UserService} from '../services/user.service';
import { Pool } from "mysql2/promise";

export function createAuthRouter(db: Pool){
	const router = express.Router();
	const userService = new UserService(db)
	const authService = new AuthService(userService);

	// Apply middleware to the whole router
	router.use(express.json());

	router.post('/register', async (req, res) =>{
		try {
			const user = await authService.register(req.body);
			res.status(201).json(user);
		} catch (err: any) {
			console.error(err);
			res.status(400).json({ error: err.message || "Registrierung fehlgeschlagen" });
		}
	});

	router.post('/login', async (req, res) => {
		const {username, password} = req.body;
		try{
			const token = await authService.login(username, password);
			if (!token) {
				// Explicitly send 401 for invalid credentials
				res.status(401).json({error: "Ungültige Anmeldedaten"});
				return;
			}
			// On success, send the token
			res.json({token});
		} catch (err){
			console.error(err);
			res.status(500).json({error: "Login fehlgeschlagen"});
		}
	});

	return router;
}
