export interface PiattoComanda {
  menu_id: number;
  quantita: number;
  prezzo_unitario: number;
}

export interface CreateComandaRequest {
  cliente: string;
  piatti: PiattoComanda[];
  note?: string;
}

export interface UpdateComandaRequest {
  id: number;
  stato?:
    | "in_attesa"
    | "in_preparazione"
    | "pronto"
    | "consegnato"
    | "cancellato";
  note?: string;
}
