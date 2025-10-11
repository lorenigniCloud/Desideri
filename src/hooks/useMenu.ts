import { supabase } from "@/lib/supabase";
import { Menu, MenuByCategory } from "@/types";
import { useQuery } from "@tanstack/react-query";

export function useMenu() {
  return useQuery<Menu[]>({
    queryKey: ["menu"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("menu")
        .select("*")
        .eq("disponibile", true)
        .order("categoria", { ascending: true })
        .order("nome", { ascending: true });

      if (error) throw error;
      return data || [];
    },
  });
}

export function useMenuByCategory() {
  return useQuery<MenuByCategory>({
    queryKey: ["menu", "by-category"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("menu")
        .select("*")
        .eq("disponibile", true)
        .order("categoria", { ascending: true })
        .order("nome", { ascending: true });

      if (error) throw error;
      const menu = data || [];

      return menu.reduce((acc: MenuByCategory, item: Menu) => {
        if (!acc[item.categoria]) acc[item.categoria] = [];
        acc[item.categoria].push(item);
        return acc;
      }, {});
    },
  });
}
