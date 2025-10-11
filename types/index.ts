// Esporta tutti i tipi
export * from "./comanda";
export * from "./menu";

// Re-export dei tipi principali da supabase per comodità
export type {
  Comanda,
  ComandaCompleta,
  DettaglioComanda,
  Menu,
} from "@/lib/supabase";
