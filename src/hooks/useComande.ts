import { supabase } from "@/lib/supabase";
import {
  ComandaCompleta,
  CreateComandaRequest,
  UpdateComandaRequest,
} from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useComande() {
  return useQuery<ComandaCompleta[]>({
    queryKey: ["comande"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("comanda")
        .select(
          `
          *,
          dettagli_comanda (
            id,
            quantita,
            prezzo_unitario,
            menu (nome, categoria)
          )
        `
        )
        .order("data_ordine", { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });
}

export function useCreateComanda() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (comandaData: CreateComandaRequest) => {
      // Crea la comanda
      const { data: comanda, error: comandaError } = await supabase
        .from("comanda")
        .insert([{ cliente: comandaData.cliente, note: comandaData.note }])
        .select()
        .single();

      if (comandaError) throw comandaError;

      // Aggiungi i dettagli
      const dettagli = comandaData.piatti.map((piatto) => ({
        comanda_id: comanda.id,
        menu_id: piatto.menu_id,
        quantita: piatto.quantita,
        prezzo_unitario: piatto.prezzo_unitario,
      }));

      const { error: dettagliError } = await supabase
        .from("dettagli_comanda")
        .insert(dettagli);

      if (dettagliError) throw dettagliError;

      // Calcola il totale
      const totale = comandaData.piatti.reduce(
        (sum, piatto) => sum + piatto.quantita * piatto.prezzo_unitario,
        0
      );

      // Aggiorna il totale
      await supabase.from("comanda").update({ totale }).eq("id", comanda.id);

      return comanda;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comande"] });
    },
  });
}

export function useUpdateComanda() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (comandaData: UpdateComandaRequest) => {
      const updateData: Partial<{ stato: string; note: string }> = {};
      if (comandaData.stato) updateData.stato = comandaData.stato;
      if (comandaData.note !== undefined) updateData.note = comandaData.note;

      const { data, error } = await supabase
        .from("comanda")
        .update(updateData)
        .eq("id", comandaData.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comande"] });
    },
  });
}
