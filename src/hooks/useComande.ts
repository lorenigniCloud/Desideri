import { getRepartoFromCategoria, RepartoType, supabase } from "@/lib/supabase";
import {
  ComandaCompleta,
  CreateComandaRequest,
  UpdateComandaRequest,
} from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Hook per tutte le comande
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
            reparto,
            servito,
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

// Hook per comande filtrate per reparto
export function useComandeByReparto(reparto: RepartoType) {
  return useQuery<ComandaCompleta[]>({
    queryKey: ["comande", "reparto", reparto],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("comanda")
        .select(
          `
          *,
          dettagli_comanda!inner (
            id,
            quantita,
            prezzo_unitario,
            reparto,
            servito,
            menu (nome, categoria)
          )
        `
        )
        .eq("dettagli_comanda.reparto", reparto)
        .order("data_ordine", { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });
}

// Hook per comande filtrate per cameriere
export function useComandeByCamera(nomeCameriere: string) {
  return useQuery<ComandaCompleta[]>({
    queryKey: ["comande", "cameriere", nomeCameriere],
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
            reparto,
            servito,
            menu (nome, categoria)
          )
        `
        )
        .eq("nome_cameriere", nomeCameriere)
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
      // Prima recuperiamo i dati del menu per determinare il reparto
      const menuIds = comandaData.piatti.map((p) => p.menu_id);
      const { data: menuItems, error: menuError } = await supabase
        .from("menu")
        .select("*")
        .in("id", menuIds);

      if (menuError) throw menuError;

      // Non assegniamo più un reparto alla comanda

      // Calcola il totale
      const totale = comandaData.piatti.reduce(
        (sum, piatto) => sum + piatto.quantita * piatto.prezzo_unitario,
        0
      );

      // Crea la comanda senza reparto
      const { data: comanda, error: comandaError } = await supabase
        .from("comanda")
        .insert([
          {
            cliente: comandaData.cliente,
            nome_cameriere: comandaData.nome_cameriere,
            tavolo: comandaData.tavolo,
            stato: "nuovo" as const,
            totale,
            note: comandaData.note,
          },
        ])
        .select()
        .single();

      if (comandaError) throw comandaError;

      // Aggiungi i dettagli con reparto per ogni piatto
      const dettagli = comandaData.piatti.map((piatto) => {
        const menu = menuItems?.find((m) => m.id === piatto.menu_id);
        const reparto = getRepartoFromCategoria(menu?.categoria || "");

        // Imposta servito = true per Bevande e Servizio
        const servito =
          menu?.categoria === "Bevande" || menu?.categoria === "Servizio";

        return {
          comanda_id: comanda.id,
          menu_id: piatto.menu_id,
          quantita: piatto.quantita,
          prezzo_unitario: piatto.prezzo_unitario,
          reparto,
          servito,
        };
      });

      const { error: dettagliError } = await supabase
        .from("dettagli_comanda")
        .insert(dettagli);

      if (dettagliError) throw dettagliError;

      return comanda;
    },
    onSuccess: () => {
      // Invalida tutte le query delle comande
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
