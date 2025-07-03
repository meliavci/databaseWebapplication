import {RowDataPacket} from 'mysql2';

export interface Shopping_Cart extends RowDataPacket{
  id: number;
  user_id: number;
  status: string;
  created_at: string;
  updated_at: string;
}
