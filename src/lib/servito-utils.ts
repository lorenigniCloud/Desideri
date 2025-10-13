import { DettaglioComanda, RepartoType } from "./supabase";

/**
 * Verifica se tutti i piatti di una categoria sono serviti
 */
export function isCategoriaServita(
  dettagli: DettaglioComanda[],
  categoria: string
): boolean {
  const piattiCategoria = dettagli.filter(
    (d) => d.menu?.categoria === categoria && !d.servito === false // Escludi cancellati se necessario
  );

  if (piattiCategoria.length === 0) return false;

  return piattiCategoria.every((d) => d.servito);
}

/**
 * Verifica se almeno un piatto di una categoria è servito
 */
export function isCategoriaParzialeServita(
  dettagli: DettaglioComanda[],
  categoria: string
): boolean {
  const piattiCategoria = dettagli.filter(
    (d) => d.menu?.categoria === categoria
  );

  if (piattiCategoria.length === 0) return false;

  return piattiCategoria.some((d) => d.servito);
}

/**
 * Ottiene lo stato di una categoria basato sui piatti serviti
 */
export function getStatoCategoria(
  dettagli: DettaglioComanda[],
  categoria: string
): "non_servito" | "parzialmente_servito" | "tutto_servito" {
  const tuttiServiti = isCategoriaServita(dettagli, categoria);
  const almenoUnoServito = isCategoriaParzialeServita(dettagli, categoria);

  if (tuttiServiti) return "tutto_servito";
  if (almenoUnoServito) return "parzialmente_servito";
  return "non_servito";
}

/**
 * Ottiene il colore del cerchio per lo stato della categoria
 */
export function getColoreCerchioCategoria(
  dettagli: DettaglioComanda[],
  categoria: string
): "error" | "warning" | "success" {
  const stato = getStatoCategoria(dettagli, categoria);

  switch (stato) {
    case "tutto_servito":
      return "success"; // Verde
    case "parzialmente_servito":
      return "warning"; // Arancione/Giallo
    case "non_servito":
    default:
      return "error"; // Rosso
  }
}

/**
 * Verifica se l'utente può cliccare il cerchio per una categoria
 * basato sul reparto della categoria e il ruolo dell'utente
 */
export function canClickCerchioCategoria(
  categoria: string,
  userReparto: RepartoType | null,
  categoriaToReparto: Record<string, RepartoType>
): boolean {
  if (!userReparto) {
    console.log("canClickCerchioCategoria: userReparto is null");
    return false;
  }

  const repartoCategoria = categoriaToReparto[categoria];
  const canClick = userReparto === repartoCategoria;

  return canClick;
}

/**
 * Raggruppa i dettagli per categoria con informazioni sullo stato servito
 */
export function raggruppaDettagliPerCategoriaServito(
  dettagli: DettaglioComanda[]
): Record<
  string,
  {
    dettagli: DettaglioComanda[];
    tuttiServiti: boolean;
    almenoUnoServito: boolean;
    stato: "non_servito" | "parzialmente_servito" | "tutto_servito";
    colore: "error" | "warning" | "success";
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

  // Calcola le informazioni per ogni categoria
  const risultato: Record<
    string,
    {
      dettagli: DettaglioComanda[];
      tuttiServiti: boolean;
      almenoUnoServito: boolean;
      stato: "non_servito" | "parzialmente_servito" | "tutto_servito";
      colore: "error" | "warning" | "success";
    }
  > = {};

  Object.entries(gruppi).forEach(([categoria, dettagliCategoria]) => {
    const tuttiServiti = isCategoriaServita(dettagliCategoria, categoria);
    const almenoUnoServito = isCategoriaParzialeServita(
      dettagliCategoria,
      categoria
    );
    const stato = getStatoCategoria(dettagliCategoria, categoria);
    const colore = getColoreCerchioCategoria(dettagliCategoria, categoria);

    risultato[categoria] = {
      dettagli: dettagliCategoria,
      tuttiServiti,
      almenoUnoServito,
      stato,
      colore,
    };
  });

  return risultato;
}
