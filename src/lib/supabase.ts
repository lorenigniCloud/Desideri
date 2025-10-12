import { createClient } from "@supabase/supabase-js";

// Client per browser (solo questo con static export)
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
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

// Tipi per stati specifici per reparto
export type StatoComanda =
  | "nuovo" // Cassa: appena creato
  | "comanda_ricevuta" // Reparto: comanda ricevuta
  | "comanda_preparata" // Reparto: comanda preparata
  | "comanda_conclusa" // Reparto: comanda conclusa
  | "servito" // Completato
  | "cancellato"; // Annullato

export type RepartoType = "cassa" | "brace" | "cucina";

// Lista hardcoded dei camerieri
export const CAMERIERI = [
  "Cameriere 1",
  "Cameriere 2",
  "Cameriere 3",
  "Cameriere 4",
  "Cameriere 5",
];

export interface Comanda {
  id: number;
  cliente: string;
  data_ordine: string;
  stato: StatoComanda;
  totale: number;
  nome_cameriere: string;
  tavolo: number;
  note?: string;
  created_at: string;
}

export interface DettaglioComanda {
  id: number;
  comanda_id: number;
  menu_id: number;
  quantita: number;
  prezzo_unitario: number;
  reparto: RepartoType;
  created_at: string;
  menu?: Menu;
}

export interface ComandaCompleta extends Comanda {
  dettagli_comanda: (DettaglioComanda & { menu: Menu })[];
}

// Mapping categorie menu -> reparti
export const CATEGORIA_TO_REPARTO: Record<string, RepartoType> = {
  // Brace: carni e grigliate
  "Secondi Piatti": "brace", // Salsicce, Bistecchine, Grigliata, Trippa

  // Cucina: tutto il resto
  "Primi Piatti": "cucina", // Vellutata, Gnocchi
  Contorni: "cucina", // Fagioli, Pisellini
  Dolci: "cucina", // Tris di Dolci, Torta, Castagnaccio, Crostata
  Antipasti: "cucina", // Bruschetta, Acciughe, Crostini, Affettati, Crostone
  Bevande: "cassa", // Vino, Birra, CocaCola, Acqua, Caffè
  Servizio: "cassa", // Coperto
};

// Funzione per determinare il reparto di un singolo piatto
export const getRepartoFromCategoria = (categoria: string): RepartoType => {
  return CATEGORIA_TO_REPARTO[categoria] || "cucina";
};
