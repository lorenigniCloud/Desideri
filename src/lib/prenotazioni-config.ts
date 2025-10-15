// Configurazione zone e tavoli del ristorante

export const ZONE = [
  "cantinella",
  "cantina",
  "pergola",
  "arco",
  "piazzetta",
] as const;

export type Zona = (typeof ZONE)[number];

export const TURNI = [
  { value: 1, label: "1° Turno" },
  { value: 2, label: "2° Turno" },
  { value: 3, label: "3° Turno" },
] as const;

export type TurnoValue = (typeof TURNI)[number]["value"];

// Configurazione tavoli per zona
// Ogni zona ha un array di capienze, dove l'indice rappresenta il numero del tavolo (1-based)
export const ZONE_CONFIG: Record<Zona, { tavoli: number; capienze: number[] }> =
  {
    cantinella: {
      tavoli: 3,
      capienze: [10, 10, 10], // Tavolo 1: 6 posti, Tavolo 2: 6 posti, Tavolo 3: 4 posti
    },
    cantina: {
      tavoli: 3,
      capienze: [10, 10, 10],
    },
    pergola: {
      tavoli: 3,
      capienze: [10, 10, 10],
    },
    arco: {
      tavoli: 3,
      capienze: [10, 10, 10],
    },
    piazzetta: {
      tavoli: 2,
      capienze: [10, 10],
    },
  };

// Funzione helper per ottenere la capienza di un tavolo
export function getCapienzaTavolo(zona: Zona, numeroTavolo: number): number {
  const config = ZONE_CONFIG[zona];
  if (!config) return 0;
  // numeroTavolo è 1-based, array è 0-based
  return config.capienze[numeroTavolo - 1] || 0;
}

// Funzione helper per ottenere il numero di tavoli in una zona
export function getNumeroTavoliZona(zona: Zona): number {
  return ZONE_CONFIG[zona]?.tavoli || 0;
}

// Funzione helper per ottenere tutte le capienze di una zona
export function getCapienzeZona(zona: Zona): number[] {
  return ZONE_CONFIG[zona]?.capienze || [];
}

// Funzione helper per formattare il nome della zona
export function formatZonaName(zona: Zona): string {
  return zona.charAt(0).toUpperCase() + zona.slice(1);
}

// Funzione helper per formattare il turno
export function formatTurno(turno: TurnoValue): string {
  const turnoObj = TURNI.find((t) => t.value === turno);
  return turnoObj?.label || `Turno ${turno}`;
}
