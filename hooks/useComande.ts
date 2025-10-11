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
      const response = await fetch("/api/comande");
      if (!response.ok) throw new Error("Errore nel caricamento delle comande");
      return response.json();
    },
  });
}

export function useCreateComanda() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (comandaData: CreateComandaRequest) => {
      const response = await fetch("/api/comande", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(comandaData),
      });
      if (!response.ok) throw new Error("Errore nella creazione della comanda");
      return response.json();
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
      const response = await fetch("/api/comande", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(comandaData),
      });
      if (!response.ok)
        throw new Error("Errore nell'aggiornamento della comanda");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comande"] });
    },
  });
}
