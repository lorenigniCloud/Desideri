import { TurnoValue, Zona } from "@/lib/prenotazioni-config";

export interface Prenotazione {
  id: number;
  giorno: string; // ISO date string
  turno: TurnoValue;
  zona: Zona;
  numero_tavolo: number;
  nome_cliente: string;
  numero_persone: number;
  recapito_telefonico: string;
  note?: string;
  created_at: string;
  updated_at: string;
}

export interface CreatePrenotazioneRequest {
  giorno: string;
  turno: TurnoValue;
  zona: Zona;
  numero_tavolo: number;
  nome_cliente: string;
  numero_persone: number;
  recapito_telefonico: string;
  note?: string;
}

export interface UpdatePrenotazioneRequest {
  nome_cliente?: string;
  numero_persone?: number;
  recapito_telefonico?: string;
  note?: string;
}

export interface TavoloInfo {
  zona: Zona;
  numero_tavolo: number;
  capienza: number;
  posti_occupati: number;
  posti_disponibili: number;
  prenotazioni: Prenotazione[];
}
