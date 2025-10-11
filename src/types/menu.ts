export interface MenuItem {
  id: number;
  nome: string;
  categoria: string;
  prezzo: number;
  disponibile: boolean;
  descrizione?: string;
  created_at: string;
}

export interface MenuByCategory {
  [categoria: string]: MenuItem[];
}

export interface CreateMenuItemRequest {
  nome: string;
  categoria: string;
  prezzo: number;
  descrizione?: string;
  disponibile?: boolean;
}

export interface UpdateMenuItemRequest {
  id: number;
  nome?: string;
  categoria?: string;
  prezzo?: number;
  descrizione?: string;
  disponibile?: boolean;
}
