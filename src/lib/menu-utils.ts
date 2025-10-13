/**
 * Ordine standard delle categorie del menu per l'applicazione
 */
export const CATEGORIA_ORDER = [
  "Antipasti",
  "Primi Piatti",
  "Secondi Piatti",
  "Contorni",
  "Dolci",
  "Bevande",
  "Servizio",
] as const;

/**
 * Ordina le categorie del menu secondo l'ordine standard dell'applicazione
 * @param categories Array di categorie da ordinare
 * @returns Array di categorie ordinate secondo CATEGORIA_ORDER
 */
export function sortCategoriesByOrder(categories: string[]): string[] {
  return categories.sort((a, b) => {
    const indexA = CATEGORIA_ORDER.indexOf(
      a as (typeof CATEGORIA_ORDER)[number]
    );
    const indexB = CATEGORIA_ORDER.indexOf(
      b as (typeof CATEGORIA_ORDER)[number]
    );

    // Se entrambe le categorie sono nell'ordine standard, ordina per posizione
    if (indexA !== -1 && indexB !== -1) {
      return indexA - indexB;
    }

    // Se solo una categoria è nell'ordine standard, quella viene prima
    if (indexA !== -1) return -1;
    if (indexB !== -1) return 1;

    // Se nessuna delle due è nell'ordine standard, ordina alfabeticamente
    return a.localeCompare(b);
  });
}

/**
 * Ordina un oggetto con chiavi di categoria secondo l'ordine standard
 * @param menuByCategory Oggetto con categorie come chiavi
 * @returns Array di tuple [categoria, items] ordinate
 */
export function sortMenuByCategory<T>(
  menuByCategory: Record<string, T[]>
): Array<[string, T[]]> {
  const sortedCategories = sortCategoriesByOrder(Object.keys(menuByCategory));
  return sortedCategories.map((categoria) => [
    categoria,
    menuByCategory[categoria],
  ]);
}
