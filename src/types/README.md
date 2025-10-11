# Tipi TypeScript

Questo file contiene tutti i tipi TypeScript utilizzati nel progetto.

## Struttura

### `/types/comanda.ts`

- `PiattoComanda`: Rappresenta un piatto in una comanda
- `CreateComandaRequest`: Dati per creare una nuova comanda
- `UpdateComandaRequest`: Dati per aggiornare una comanda esistente

### `/types/menu.ts`

- `MenuItem`: Rappresenta un elemento del menu
- `MenuByCategory`: Menu organizzato per categorie
- `CreateMenuItemRequest`: Dati per creare un nuovo elemento del menu
- `UpdateMenuItemRequest`: Dati per aggiornare un elemento del menu

### `/types/index.ts`

- Esporta tutti i tipi per un accesso centralizzato
- Re-export dei tipi da `@/lib/supabase`

## Utilizzo

```typescript
import { Menu, ComandaCompleta, CreateComandaRequest } from "@/types";
```

## Vantaggi

1. **Type Safety**: Eliminazione completa di `any`
2. **IntelliSense**: Autocompletamento migliorato
3. **Refactoring**: Cambi ai tipi si propagano automaticamente
4. **Documentazione**: I tipi servono come documentazione del codice
5. **Consistenza**: Tipi condivisi tra client e server
