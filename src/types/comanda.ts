import { StatoComanda } from "@/lib/supabase";

export interface PiattoComanda {
  menu_id: number;
  quantita: number;
  prezzo_unitario: number;
}

export interface CreateComandaRequest {
  cliente: string;
  piatti: PiattoComanda[];
  nome_cameriere: string;
  tavolo: number;
  note?: string;
}

export interface UpdateComandaRequest {
  id: number;
  stato?: StatoComanda;
  note?: string;
}
