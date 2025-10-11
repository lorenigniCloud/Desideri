import { Menu, MenuByCategory } from "@/types";
import { useQuery } from "@tanstack/react-query";

export function useMenu() {
  return useQuery<Menu[]>({
    queryKey: ["menu"],
    queryFn: async () => {
      const response = await fetch("/api/menu");
      if (!response.ok) throw new Error("Errore nel caricamento del menu");
      return response.json();
    },
  });
}

export function useMenuByCategory() {
  return useQuery<MenuByCategory>({
    queryKey: ["menu", "by-category"],
    queryFn: async () => {
      const response = await fetch("/api/menu");
      if (!response.ok) throw new Error("Errore nel caricamento del menu");
      const menu = await response.json();

      return menu.reduce((acc: MenuByCategory, item: Menu) => {
        if (!acc[item.categoria]) acc[item.categoria] = [];
        acc[item.categoria].push(item);
        return acc;
      }, {});
    },
  });
}
