// Esporta tutti i tipi
export * from "./auth";
export * from "./comanda";
export * from "./menu";
export * from "./prenotazioni";

// Re-export dei tipi principali da supabase per comodità
export type {
  Comanda,
  ComandaCompleta,
  DettaglioComanda,
  Menu,
} from "@/lib/supabase";
