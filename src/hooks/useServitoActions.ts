import { RepartoType, supabase } from "@/lib/supabase";
import { useMutation, useQueryClient } from "@tanstack/react-query";

/**
 * Hook per aggiornare il campo servito di piatti per categoria
 */
export function useServiCategoria() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      comandaId,
      categoria,
      reparto,
      servito = true,
    }: {
      comandaId: number;
      categoria: string;
      reparto: RepartoType;
      servito?: boolean;
    }) => {
      // Prima ottieni gli ID dei menu items di quella categoria
      const { data: menuItems, error: menuError } = await supabase
        .from("menu")
        .select("id")
        .eq("categoria", categoria);

      if (menuError) throw menuError;

      const menuIds = menuItems.map((item) => item.id);

      // Aggiorna tutti i dettagli della comanda per quella categoria e reparto
      const { data, error } = await supabase
        .from("dettagli_comanda")
        .update({ servito })
        .eq("comanda_id", comandaId)
        .eq("reparto", reparto)
        .in("menu_id", menuIds)
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      // Invalida tutte le query delle comande per ricaricare i dati aggiornati
      queryClient.invalidateQueries({ queryKey: ["comande"] });
      queryClient.invalidateQueries({ queryKey: ["comande-reparto"] });
      queryClient.invalidateQueries({ queryKey: ["comande-complete"] });
      queryClient.invalidateQueries({ queryKey: ["dettagli-comanda"] });

      // Forza un refresh completo di tutte le query
      queryClient.refetchQueries({ queryKey: ["comande"] });
    },
  });
}

/**
 * Hook per aggiornare il campo servito di tutti i piatti di un reparto
 */
export function useServiTuttoReparto() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      comandaId,
      reparto,
      servito = true,
    }: {
      comandaId: number;
      reparto: RepartoType;
      servito?: boolean;
    }) => {
      const { data, error } = await supabase
        .from("dettagli_comanda")
        .update({ servito })
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

/**
 * Hook per aggiornare il campo servito di piatti specifici per ID
 */
export function useServiPiattiByIds() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      dettagliIds,
      servito = true,
    }: {
      dettagliIds: number[];
      servito?: boolean;
    }) => {
      const { data, error } = await supabase
        .from("dettagli_comanda")
        .update({ servito })
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
