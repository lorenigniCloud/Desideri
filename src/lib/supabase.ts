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
  | "in_brace" // Brace: in preparazione
  | "brace_pronto" // Brace: carne pronta
  | "in_cucina" // Cucina: in preparazione
  | "cucina_pronto" // Cucina: tutto pronto
  | "servito" // Completato
  | "cancellato"; // Annullato

export type RepartoType = "cassa" | "brace" | "cucina";

export interface Comanda {
  id: number;
  cliente: string;
  data_ordine: string;
  stato: StatoComanda;
  totale: number;
  nome_cameriere: string;
  reparto: RepartoType;
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
  created_at: string;
  menu?: Menu;
}

export interface ComandaCompleta extends Comanda {
  dettagli_comanda: (DettaglioComanda & { menu: Menu })[];
}

// Mapping categorie menu -> reparti
export const CATEGORIA_TO_REPARTO: Record<string, RepartoType> = {
  // Brace: carni e grigliate
  Carni: "brace",
  Grigliate: "brace",
  Barbecue: "brace",
  "Secondi di Carne": "brace",

  // Cucina: tutto il resto
  Primi: "cucina",
  Pasta: "cucina",
  Risotti: "cucina",
  Contorni: "cucina",
  Dolci: "cucina",
  Antipasti: "cucina",
  "Secondi di Pesce": "cucina",
  Insalate: "cucina",
  Zuppe: "cucina",
};

// Funzione per determinare il reparto principale di una comanda
export const determineMainReparto = (piatti: { menu: Menu }[]): RepartoType => {
  const repartiCount: Record<RepartoType, number> = {
    brace: 0,
    cucina: 0,
    cassa: 0,
  };

  piatti.forEach((piatto) => {
    const reparto = CATEGORIA_TO_REPARTO[piatto.menu.categoria] || "cucina";
    repartiCount[reparto]++;
  });

  // Se ci sono piatti per brace, priorità a brace
  if (repartiCount.brace > 0) return "brace";

  // Altrimenti cucina (include anche casi misti)
  return "cucina";
};
