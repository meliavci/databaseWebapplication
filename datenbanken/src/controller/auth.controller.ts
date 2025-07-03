import express from "express";
import { AuthService } from '../services/auth.service';
import { UserService} from '../services/user.service';
import { Pool } from "mysql2/promise";

export function createAuthRouter(db: Pool){
  const router = express.Router();
  const userService = new UserService(db)
  const authService = new AuthService(userService);

  router.post('/register', express.json(), async (req, res) =>{
    try {
      const user = await authService.register(req.body);
      res.status(201).json(user);
    } catch (err: any) { // Gib 'err' einen Typ
			console.error(err);
			res.status(400).json({ error: err.message || "Registrierung fehlgeschlagen" });
		}
  });

  router.post('/login', express.json(), async (req, res) : Promise<void> => {
    const {username, password} = req.body;
    try{
      const token = await authService.login(username, password);
      if (!token) res.status(401).json({error: "Ungültige Anmeldedaten"});
      res.json({token});
    } catch (err){
      console.error(err);
      res.status(500).json({error: "Login fehlgeschlagen"});
    }
  })

 	return router;
}
