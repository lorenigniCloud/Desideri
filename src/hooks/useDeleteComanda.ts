import { supabase } from "@/lib/supabase";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useDeleteComanda() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (comandaId: number) => {
      const { error } = await supabase
        .from("comanda")
        .delete()
        .eq("id", comandaId);

      if (error) throw error;
      return comandaId;
    },
    onSuccess: () => {
      // Invalida tutte le query delle comande per aggiornare l'UI
      queryClient.invalidateQueries({ queryKey: ["comande"] });
      queryClient.invalidateQueries({ queryKey: ["comandeByReparto"] });
      queryClient.invalidateQueries({ queryKey: ["comandeByCamera"] });
    },
  });
}
