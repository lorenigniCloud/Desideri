import { supabase } from "@/lib/supabase";
import {
  CreatePrenotazioneRequest,
  Prenotazione,
  UpdatePrenotazioneRequest,
} from "@/types/prenotazioni";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Fetch tutte le prenotazioni
export function usePrenotazioni() {
  return useQuery({
    queryKey: ["prenotazioni"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("prenotazioni")
        .select("*")
        .order("giorno", { ascending: true })
        .order("turno", { ascending: true });

      if (error) throw error;
      return data as Prenotazione[];
    },
  });
}

// Fetch prenotazioni per giorno e turno
export function usePrenotazioniByGiornoTurno(giorno: string, turno: number) {
  return useQuery({
    queryKey: ["prenotazioni", giorno, turno],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("prenotazioni")
        .select("*")
        .eq("giorno", giorno)
        .eq("turno", turno)
        .order("zona", { ascending: true })
        .order("numero_tavolo", { ascending: true });

      if (error) throw error;
      return data as Prenotazione[];
    },
    enabled: !!giorno && !!turno,
  });
}

// Fetch prenotazioni per zona
export function usePrenotazioniByZona(
  giorno: string,
  turno: number,
  zona: string
) {
  return useQuery({
    queryKey: ["prenotazioni", giorno, turno, zona],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("prenotazioni")
        .select("*")
        .eq("giorno", giorno)
        .eq("turno", turno)
        .eq("zona", zona)
        .order("numero_tavolo", { ascending: true });

      if (error) throw error;
      return data as Prenotazione[];
    },
    enabled: !!giorno && !!turno && !!zona,
  });
}

// Crea nuova prenotazione
export function useCreatePrenotazione() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (prenotazione: CreatePrenotazioneRequest) => {
      const { data, error } = await supabase
        .from("prenotazioni")
        .insert([prenotazione])
        .select()
        .single();

      if (error) throw error;
      return data as Prenotazione;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["prenotazioni"] });
    },
  });
}

// Aggiorna prenotazione
export function useUpdatePrenotazione() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: number;
      updates: UpdatePrenotazioneRequest;
    }) => {
      const { data, error } = await supabase
        .from("prenotazioni")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data as Prenotazione;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["prenotazioni"] });
    },
  });
}

// Elimina prenotazione
export function useDeletePrenotazione() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase
        .from("prenotazioni")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["prenotazioni"] });
    },
  });
}
