import { ComandaCompleta, RepartoType } from "./supabase";

/**
 * Verifica se una comanda è conclusa per un reparto specifico
 * Una comanda è conclusa quando tutti i piatti del reparto sono serviti
 */
export function isConclusaPerReparto(
  comanda: ComandaCompleta,
  reparto: RepartoType
): boolean {
  // Filtra i dettagli per il reparto specifico
  const dettagliReparto = comanda.dettagli_comanda.filter(
    (d) => d.reparto === reparto
  );

  // Se non ci sono piatti per questo reparto, considera conclusa
  if (dettagliReparto.length === 0) return true;

  // Tutti i piatti del reparto devono essere serviti
  return dettagliReparto.every((d) => d.servito);
}

/**
 * Verifica se una comanda è completamente conclusa (tutti i piatti serviti)
 * Usata per Cassa e Camerieri
 */
export function isConclusaCompleta(comanda: ComandaCompleta): boolean {
  // Se non ci sono dettagli, considera conclusa
  if (comanda.dettagli_comanda.length === 0) return true;

  // Tutti i piatti devono essere serviti
  return comanda.dettagli_comanda.every((d) => d.servito);
}

/**
 * Separa le comande in attive e concluse per un reparto specifico
 */
export function separaComandePerReparto(
  comande: ComandaCompleta[],
  reparto: RepartoType
): {
  attive: ComandaCompleta[];
  concluse: ComandaCompleta[];
} {
  const attive: ComandaCompleta[] = [];
  const concluse: ComandaCompleta[] = [];

  comande.forEach((comanda) => {
    if (isConclusaPerReparto(comanda, reparto)) {
      concluse.push(comanda);
    } else {
      attive.push(comanda);
    }
  });

  return { attive, concluse };
}

/**
 * Separa le comande in attive e concluse (tutte le categorie)
 * Usata per Cassa e Camerieri
 */
export function separaComandeComplete(comande: ComandaCompleta[]): {
  attive: ComandaCompleta[];
  concluse: ComandaCompleta[];
} {
  const attive: ComandaCompleta[] = [];
  const concluse: ComandaCompleta[] = [];

  comande.forEach((comanda) => {
    if (isConclusaCompleta(comanda)) {
      concluse.push(comanda);
    } else {
      attive.push(comanda);
    }
  });

  return { attive, concluse };
}

/**
 * Filtra le comande per reparto e le separa in attive/concluse
 * Usata per Cucina e Brace
 */
export function filtraESeparaComandePerReparto(
  comande: ComandaCompleta[],
  reparto: RepartoType
): {
  attive: ComandaCompleta[];
  concluse: ComandaCompleta[];
} {
  // Prima filtra le comande che hanno piatti per questo reparto
  const comandeFiltrate = comande
    .map((comanda) => {
      const dettagliFiltrati = comanda.dettagli_comanda.filter(
        (d) => d.reparto === reparto
      );

      if (dettagliFiltrati.length === 0) return null;

      return {
        ...comanda,
        dettagli_comanda: dettagliFiltrati,
      };
    })
    .filter(Boolean) as ComandaCompleta[];

  // Poi separa in attive e concluse
  return separaComandePerReparto(comandeFiltrate, reparto);
}
