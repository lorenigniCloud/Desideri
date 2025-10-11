"use client";

import { useComande } from "@/hooks/useComande";
import { useMenuByCategory } from "@/hooks/useMenu";
import { useState } from "react";

export default function Home() {
  const {
    data: menuByCategory,
    isLoading: menuLoading,
    error: menuError,
  } = useMenuByCategory();
  const { data: comande, isLoading: comandeLoading } = useComande();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  if (menuLoading)
    return <div className="p-8 text-center">Caricamento menu...</div>;
  if (menuError)
    return (
      <div className="p-8 text-center text-red-500">
        Errore nel caricamento del menu
      </div>
    );

  console.log(menuByCategory);
  console.log(menuByCategory);
  console.log(menuByCategory);
  const categories = menuByCategory ? Object.keys(menuByCategory) : [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-3xl font-bold text-gray-900">
            Ristorante - Gestione Ordini
          </h1>
          <p className="text-gray-600 mt-2">
            Sistema di gestione ordini e menu
          </p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation */}
        <div className="mb-8">
          <nav className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedCategory === null
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Tutto il Menu
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {category}
              </button>
            ))}
          </nav>
        </div>

        <></>
        {/* Menu */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Menu Section */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {selectedCategory || "Menu Completo"}
            </h2>
            <></>
            {menuByCategory && (
              <div className="space-y-8">
                {Object.entries(menuByCategory)
                  .filter(
                    ([category]) =>
                      !selectedCategory || category === selectedCategory
                  )
                  .map(([category, piatti]) => (
                    <div
                      key={category}
                      className="bg-white rounded-lg shadow-sm border p-6"
                    >
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">
                        {category}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {piatti.map((piatto) => (
                          <div
                            key={piatto.id}
                            className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                          >
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-semibold text-gray-900">
                                {piatto.nome}
                              </h4>
                              <span className="font-bold text-lg text-green-600">
                                €{piatto.prezzo.toFixed(2)}
                              </span>
                            </div>
                            {piatto.descrizione && (
                              <p className="text-gray-600 text-sm">
                                {piatto.descrizione}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* Comande Section */}
          <div className="lg:col-span-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Ordini Recenti
            </h2>

            {comandeLoading ? (
              <div className="text-center py-8">Caricamento ordini...</div>
            ) : (
              <div className="space-y-4">
                {comande && comande.length > 0 ? (
                  comande.slice(0, 5).map((comanda) => (
                    <div
                      key={comanda.id}
                      className="bg-white rounded-lg shadow-sm border p-4"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-gray-900">
                          {comanda.cliente}
                        </h4>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${(() => {
                            switch (comanda.stato) {
                              case "in_attesa":
                                return "bg-yellow-100 text-yellow-800";
                              case "in_preparazione":
                                return "bg-blue-100 text-blue-800";
                              case "pronto":
                                return "bg-green-100 text-green-800";
                              default:
                                return "bg-gray-100 text-gray-800";
                            }
                          })()}`}
                        >
                          {comanda.stato.replace("_", " ")}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {new Date(comanda.data_ordine).toLocaleString("it-IT")}
                      </p>
                      <div className="text-sm">
                        {comanda.dettagli_comanda.map((dettaglio) => (
                          <div
                            key={`${dettaglio.menu_id}-${dettaglio.quantita}`}
                            className="flex justify-between"
                          >
                            <span>
                              {dettaglio.quantita}x {dettaglio.menu?.nome}
                            </span>
                            <span>
                              €
                              {(
                                dettaglio.quantita * dettaglio.prezzo_unitario
                              ).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                      <div className="border-t pt-2 mt-2">
                        <div className="flex justify-between font-semibold">
                          <span>Totale:</span>
                          <span>€{comanda.totale.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    Nessun ordine presente
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
