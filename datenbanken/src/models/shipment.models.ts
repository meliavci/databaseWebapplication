export interface Shipment{
  id: number; //Shipment ID
  user_id: number;
  article_id: number;
  delivery_type: string;
  status: string;
  date_created: string;
  date_delivered: string;
}
