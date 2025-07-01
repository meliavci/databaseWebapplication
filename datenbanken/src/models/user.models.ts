export interface User{
  id?: number;
  username: string;
  password: string; //evtl. zu PW Hash ändern für Datensicherheit
  email: string;
  user_flag?: number;
  name?: string;
  address?: string;
}
