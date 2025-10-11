import { createClient } from "@supabase/supabase-js";

// Client per browser
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Server client per API routes
export const supabaseServer = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Tipi TypeScript
export interface Menu {
  id: number;
  nome: string;
  categoria: string;
  prezzo: number;
  disponibile: boolean;
  descrizione?: string;
  created_at: string;
}

export interface Comanda {
  id: number;
  cliente: string;
  data_ordine: string;
  stato:
    | "in_attesa"
    | "in_preparazione"
    | "pronto"
    | "consegnato"
    | "cancellato";
  totale: number;
  note?: string;
  created_at: string;
}

export interface DettaglioComanda {
  id: number;
  comanda_id: number;
  menu_id: number;
  quantita: number;
  prezzo_unitario: number;
  created_at: string;
  menu?: Menu;
}

export interface ComandaCompleta extends Comanda {
  dettagli_comanda: (DettaglioComanda & { menu: Menu })[];
}
