-- Script per aggiornare lo schema del database
-- Aggiunge campi per cameriere, reparto e tavolo

-- 1. Aggiungere colonna nomeCameriere
ALTER TABLE comanda 
ADD COLUMN nome_cameriere VARCHAR(100);

-- 2. Aggiungere colonna reparto con constraint
ALTER TABLE comanda 
ADD COLUMN reparto VARCHAR(20) CHECK (reparto IN ('cassa', 'brace', 'cucina'));

-- 3. Aggiungere colonna tavolo
ALTER TABLE comanda 
ADD COLUMN tavolo INTEGER;

-- 4. Aggiornare gli stati per essere più specifici per reparto
-- Prima rimuoviamo il constraint esistente se presente
ALTER TABLE comanda 
DROP CONSTRAINT IF EXISTS comanda_stato_check;

-- Aggiungiamo il nuovo constraint con stati specifici per reparto
ALTER TABLE comanda 
ADD CONSTRAINT comanda_stato_check 
CHECK (stato IN (
  'nuovo',           -- Cassa: appena creato
  'in_brace',        -- Brace: in preparazione
  'brace_pronto',    -- Brace: carne pronta
  'in_cucina',       -- Cucina: in preparazione
  'cucina_pronto',   -- Cucina: tutto pronto
  'servito',         -- Completato
  'cancellato'       -- Annullato
));

-- 5. Aggiornare eventuali record esistenti (opzionale)
-- UPDATE comanda SET stato = 'nuovo' WHERE stato = 'in_attesa';
-- UPDATE comanda SET stato = 'servito' WHERE stato = 'consegnato';

-- 6. Creare indici per performance
CREATE INDEX IF NOT EXISTS idx_comanda_reparto ON comanda(reparto);
CREATE INDEX IF NOT EXISTS idx_comanda_stato ON comanda(stato);
CREATE INDEX IF NOT EXISTS idx_comanda_cameriere ON comanda(nome_cameriere);
CREATE INDEX IF NOT EXISTS idx_comanda_tavolo ON comanda(tavolo);
