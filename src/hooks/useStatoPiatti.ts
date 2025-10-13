import { RepartoType, StatoPiatto, supabase } from "@/lib/supabase";
import { useMutation, useQueryClient } from "@tanstack/react-query";

/**
 * Hook per aggiornare lo stato di piatti specifici
 */
export function useUpdateStatoPiatti() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      comandaId,
      reparto,
      categoria,
      nuovoStato,
    }: {
      comandaId: number;
      reparto: RepartoType;
      categoria?: string; // Se specificata, aggiorna solo i piatti di questa categoria
      nuovoStato: StatoPiatto;
    }) => {
      let query = supabase
        .from("dettagli_comanda")
        .update({ stato: nuovoStato })
        .eq("comanda_id", comandaId)
        .eq("reparto", reparto);

      // Se è specificata una categoria, filtra anche per quella
      if (categoria) {
        // Prima ottieni gli ID dei menu items di quella categoria
        const { data: menuItems, error: menuError } = await supabase
          .from("menu")
          .select("id")
          .eq("categoria", categoria);

        if (menuError) throw menuError;

        const menuIds = menuItems.map((item) => item.id);
        query = query.in("menu_id", menuIds);
      }

      const { data, error } = await query.select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      // Invalida le query delle comande per ricaricare i dati aggiornati
      queryClient.invalidateQueries({ queryKey: ["comande"] });
      queryClient.invalidateQueries({ queryKey: ["comande-reparto"] });
    },
  });
}

/**
 * Hook per aggiornare lo stato di piatti specifici per ID
 */
export function useUpdateStatoPiattiByIds() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      dettagliIds,
      nuovoStato,
    }: {
      dettagliIds: number[];
      nuovoStato: StatoPiatto;
    }) => {
      const { data, error } = await supabase
        .from("dettagli_comanda")
        .update({ stato: nuovoStato })
        .in("id", dettagliIds)
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comande"] });
      queryClient.invalidateQueries({ queryKey: ["comande-reparto"] });
    },
  });
}

/**
 * Hook per aggiornare lo stato di tutti i piatti di una comanda per un reparto
 */
export function useUpdateStatoTuttiPiattiReparto() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      comandaId,
      reparto,
      nuovoStato,
    }: {
      comandaId: number;
      reparto: RepartoType;
      nuovoStato: StatoPiatto;
    }) => {
      const { data, error } = await supabase
        .from("dettagli_comanda")
        .update({ stato: nuovoStato })
        .eq("comanda_id", comandaId)
        .eq("reparto", reparto)
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comande"] });
      queryClient.invalidateQueries({ queryKey: ["comande-reparto"] });
    },
  });
}
