export interface User{
  id?: number;
  username: string;
  password_hash: string;
  email: string;
  role: "user" | "admin";
  firstName?: string;
	lastName?: string;
  address?: string;
}
