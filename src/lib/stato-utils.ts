import {
  DettaglioComanda,
  RepartoType,
  StatoComanda,
  StatoPiatto,
} from "./supabase";

/**
 * Stati disponibili per il reparto Cucina
 */
export const STATI_CUCINA: StatoPiatto[] = [
  "in_preparazione",
  "antipasto_servito",
  "primo_servito",
  "secondo_servito",
  "comanda_conclusa",
];

/**
 * Stati disponibili per il reparto Brace
 */
export const STATI_BRACE: StatoPiatto[] = [
  "in_preparazione",
  "comanda_conclusa",
];

/**
 * Mapping categoria menu -> stato target quando viene servita
 */
export const CATEGORIA_TO_STATO_SERVITO: Record<string, StatoPiatto> = {
  Antipasti: "antipasto_servito",
  "Primi Piatti": "primo_servito",
  "Secondi Piatti": "secondo_servito",
  // Per altre categorie, usa lo stato generico
};

/**
 * Ottiene lo stato target per una categoria quando viene servita
 */
export function getStatoServitoPerCategoria(categoria: string): StatoPiatto {
  return CATEGORIA_TO_STATO_SERVITO[categoria] || "comanda_conclusa";
}

/**
 * Verifica se uno stato è valido per un reparto
 */
export function isStatoValidoPerReparto(
  stato: StatoPiatto,
  reparto: RepartoType
): boolean {
  switch (reparto) {
    case "cucina":
      return STATI_CUCINA.includes(stato);
    case "brace":
      return STATI_BRACE.includes(stato);
    case "cassa":
      return true; // La cassa può vedere tutti gli stati
    default:
      return false;
  }
}

/**
 * Ottiene gli stati disponibili per un reparto
 */
export function getStatiDisponibiliPerReparto(
  reparto: RepartoType
): StatoPiatto[] {
  switch (reparto) {
    case "cucina":
      return STATI_CUCINA;
    case "brace":
      return STATI_BRACE;
    case "cassa":
      return [...STATI_CUCINA, ...STATI_BRACE];
    default:
      return [];
  }
}

/**
 * Ottiene una label user-friendly per lo stato
 */
export function getStatoLabel(stato: StatoPiatto): string {
  const labels: Record<StatoPiatto, string> = {
    in_preparazione: "In Preparazione",
    antipasto_servito: "Antipasto Servito",
    primo_servito: "Primo Servito",
    secondo_servito: "Secondo Servito",
    comanda_conclusa: "Concluso",
    cancellato: "Cancellato",
  };

  return labels[stato] || stato;
}

/**
 * Ottiene il colore per lo stato (per UI)
 */
export function getStatoColor(
  stato: StatoPiatto
):
  | "default"
  | "primary"
  | "secondary"
  | "error"
  | "info"
  | "success"
  | "warning" {
  switch (stato) {
    case "in_preparazione":
      return "warning";
    case "antipasto_servito":
    case "primo_servito":
    case "secondo_servito":
      return "info";
    case "comanda_conclusa":
      return "success";
    case "cancellato":
      return "error";
    default:
      return "default";
  }
}

/**
 * Deriva lo stato complessivo di una comanda dai suoi dettagli
 * Questa funzione sostituisce lo stato della tabella comanda
 */
export function derivaStatoComanda(dettagli: DettaglioComanda[]): StatoComanda {
  if (dettagli.length === 0) return "nuovo";

  // Se tutti i piatti sono cancellati
  if (dettagli.every((d) => d.stato === "cancellato")) {
    return "cancellato";
  }

  // Se tutti i piatti sono conclusi o serviti
  const piattiAttivi = dettagli.filter((d) => d.stato !== "cancellato");
  if (
    piattiAttivi.every(
      (d) =>
        d.stato === "comanda_conclusa" ||
        d.stato === "antipasto_servito" ||
        d.stato === "primo_servito" ||
        d.stato === "secondo_servito"
    )
  ) {
    return "servito";
  }

  // Se almeno un piatto è concluso o servito
  if (
    piattiAttivi.some(
      (d) =>
        d.stato === "comanda_conclusa" ||
        d.stato === "antipasto_servito" ||
        d.stato === "primo_servito" ||
        d.stato === "secondo_servito"
    )
  ) {
    return "comanda_preparata";
  }

  // Se tutti sono in preparazione
  if (piattiAttivi.every((d) => d.stato === "in_preparazione")) {
    return "comanda_ricevuta";
  }

  return "nuovo";
}

/**
 * Raggruppa i dettagli per categoria e calcola il loro stato aggregato
 */
export function raggruppaDettagliPerCategoria(
  dettagli: DettaglioComanda[]
): Record<
  string,
  {
    dettagli: DettaglioComanda[];
    tuttiServiti: boolean;
    tuttiInPreparazione: boolean;
    statoAggregato:
      | "in_preparazione"
      | "parzialmente_servito"
      | "tutto_servito";
  }
> {
  const gruppi: Record<string, DettaglioComanda[]> = {};

  // Raggruppa per categoria
  dettagli.forEach((dettaglio) => {
    const categoria = dettaglio.menu?.categoria || "Altro";
    if (!gruppi[categoria]) {
      gruppi[categoria] = [];
    }
    gruppi[categoria].push(dettaglio);
  });

  // Calcola lo stato aggregato per ogni categoria
  const risultato: Record<string, any> = {};

  Object.entries(gruppi).forEach(([categoria, dettagliCategoria]) => {
    const dettagliAttivi = dettagliCategoria.filter(
      (d) => d.stato !== "cancellato"
    );

    const tuttiInPreparazione = dettagliAttivi.every(
      (d) => d.stato === "in_preparazione"
    );
    const tuttiServiti = dettagliAttivi.every(
      (d) =>
        d.stato === "comanda_conclusa" ||
        d.stato === getStatoServitoPerCategoria(categoria)
    );

    let statoAggregato:
      | "in_preparazione"
      | "parzialmente_servito"
      | "tutto_servito";
    if (tuttiServiti) {
      statoAggregato = "tutto_servito";
    } else if (tuttiInPreparazione) {
      statoAggregato = "in_preparazione";
    } else {
      statoAggregato = "parzialmente_servito";
    }

    risultato[categoria] = {
      dettagli: dettagliCategoria,
      tuttiServiti,
      tuttiInPreparazione,
      statoAggregato,
    };
  });

  return risultato;
}
