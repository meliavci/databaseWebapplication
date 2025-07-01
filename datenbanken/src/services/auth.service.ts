import bcrypt from 'bcrypt';
import {UserService} from './user.service';
import {User} from '../models/user.models';

export class AuthService{
  constructor(private userService: UserService) {}

  /**
   * Register a new user
   */
  async register(userData: Omit<User, "id" | "user_flag" | "name" | "address">): Promise<User>{
    const existingUser = await this.userService.findUserByEmail(userData.email);
    if (existingUser){
      throw new Error("E-Mail ist bereits vergeben");
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const userToSave = {...userData, password: hashedPassword};

    return await this.userService.createUser(userToSave);
  }

  /**
   * Checks login-data and returns user
   */
  async login(email: string, password: string): Promise<User | null>{
    const user = await this.userService.findUserByEmail(email);
    if (!user) return null;

    const passwordMatches = await bcrypt.compare(password, user.password)
    if (!passwordMatches) return null;

    return user;
  }
}
