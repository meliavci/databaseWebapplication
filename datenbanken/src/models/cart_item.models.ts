import {RowDataPacket} from 'mysql2';

export interface Cart_Item extends RowDataPacket{
  id: number;
  cart_id: number;
  item_id: number;
  quantity: number;
}
