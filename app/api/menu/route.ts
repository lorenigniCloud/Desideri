import { supabaseServer } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { data, error } = await supabaseServer
      .from("menu")
      .select("*")
      .eq("disponibile", true)
      .order("categoria", { ascending: true })
      .order("nome", { ascending: true });

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error("Errore menu API:", error);
    return NextResponse.json(
      { error: "Errore nel caricamento del menu" },
      { status: 500 }
    );
  }
}
