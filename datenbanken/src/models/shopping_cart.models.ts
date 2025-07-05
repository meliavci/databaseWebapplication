import {RowDataPacket} from 'mysql2';

export interface Shopping_Cart extends RowDataPacket{
  id: number;
  user_id: number;
  created_at: string;
  updated_at: string;
	status: 'active' | 'completed' | 'cancelled';
}
