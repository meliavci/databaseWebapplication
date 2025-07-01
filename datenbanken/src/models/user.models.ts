export interface User{
  id: number;
  username: string;
  passwort: string; //evtl. zu PW Hash ändern für Datensicherheit
  email: string;
  user_flag: number;
  name: string;
  address: string;
}
