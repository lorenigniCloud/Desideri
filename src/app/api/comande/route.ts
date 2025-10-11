import { supabaseServer } from "@/lib/supabase";
import {
  CreateComandaRequest,
  PiattoComanda,
  UpdateComandaRequest,
} from "@/types/comanda";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { data, error } = await supabaseServer
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

    return NextResponse.json(data);
  } catch (error) {
    console.error("Errore comande API:", error);
    return NextResponse.json(
      { error: "Errore nel caricamento delle comande" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { cliente, piatti, note }: CreateComandaRequest =
      await request.json();

    // Crea la comanda
    const { data: comanda, error: comandaError } = await supabaseServer
      .from("comanda")
      .insert([{ cliente, note }])
      .select()
      .single();

    if (comandaError) throw comandaError;

    // Aggiungi i dettagli
    const dettagli = piatti.map((piatto: PiattoComanda) => ({
      comanda_id: comanda.id,
      menu_id: piatto.menu_id,
      quantita: piatto.quantita,
      prezzo_unitario: piatto.prezzo_unitario,
    }));

    const { error: dettagliError } = await supabaseServer
      .from("dettagli_comanda")
      .insert(dettagli);

    if (dettagliError) throw dettagliError;

    // Calcola il totale
    const totale = piatti.reduce(
      (sum: number, piatto: PiattoComanda) =>
        sum + piatto.quantita * piatto.prezzo_unitario,
      0
    );

    // Aggiorna il totale
    await supabaseServer
      .from("comanda")
      .update({ totale })
      .eq("id", comanda.id);

    return NextResponse.json(comanda);
  } catch (error) {
    console.error("Errore creazione comanda:", error);
    return NextResponse.json(
      { error: "Errore nella creazione della comanda" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const { id, stato, note }: UpdateComandaRequest = await request.json();

    const updateData: Partial<{ stato: string; note: string }> = {};
    if (stato) updateData.stato = stato;
    if (note !== undefined) updateData.note = note;

    const { data, error } = await supabaseServer
      .from("comanda")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error("Errore aggiornamento comanda:", error);
    return NextResponse.json(
      { error: "Errore nell'aggiornamento della comanda" },
      { status: 500 }
    );
  }
}
