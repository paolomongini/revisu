# Workflow log

Diario del progetto, usato come materiale per la presentazione del corso. Va compilato a mano durante lo
sviluppo; il comando `/radar` aggiunge automaticamente una voce a ogni esecuzione.

## Prima (senza agenti)
- Come cercavo letteratura e gruppi: <!-- es. Google Scholar, alert, LinkedIn, passaparola ai convegni -->
- Tempo tipico per farsi un quadro di un sotto-tema: <!-- stima -->
- Cosa mancava: <!-- es. visione quantitativa dei trend, mappa dei gruppi -->

## Sviluppo dello strumento con Claude Code
| Data | Cosa ho chiesto | Cosa ha prodotto | Cosa ho corretto / rifatto io |
|---|---|---|---|
| 2026-11-17 | Architettura, scraper OpenAlex, agenti, dashboard | Prima versione funzionante | <!-- --> |
| 2026-11-17 | — | Scoperta: OpenAlex limita le richieste anonime (budget giornaliero) | Aggiunti retry + chiave OpenAlex opzionale |
| 2026-11-17 | — | Il digest per gli agenti era troppo grande (~200 KB) | Diviso in digest.md (statistiche) + papers.md (da cercare con Grep) |
| 2026-11-17 | — | Permesso `python -c` troppo largo (permetteva di aggirare il blocco su `.env`) | Rimosso; aggiunto `radar.py status` |
| 2026-11-17 | — | Mappa coperta da "API KEY REQUIRED": CARTO ora richiede una chiave (scoperto solo guardando la dashboard, l'agente non l'aveva verificata) | Confini dei paesi inclusi in locale (Natural Earth): niente chiave, funziona offline |
| 2026-11-17 | Lanciare gli agenti dalla dashboard (server locale + `claude -p` in streaming) | Funziona; primo test `/ask` risposto con ID verificabili | Scoperto che in modalità headless Claude Code ignora i permessi di progetto finché la cartella non è "fidata": aggiunto avviso + istruzione nel README |
| 2026-11-17 | — | L'agente ha tentato un `python -c` per filtrare i dati: **negato** dai permessi (privilegio minimo) | Nessuna correzione: ha ripiegato su Read. Esempio concreto di sandboxing che funziona |
| 2026-11-17 | "Pensa a nuove feature utili e implementale" | Console agenti in streaming, nuovo topic da GUI, panoramica volume×crescita, filtri incrociati, ricerca globale, salvati + BibTeX, link condivisibili | Verificato con screenshot headless (Playwright): trovati e corretti z-index della mappa sopra l'header, pallino "attivo" sempre visibile, ricerca lenta (~7 s → <1 s), header mobile troppo alto |
| 2026-11-17 | — | Lo stesso paper compariva due volte (preprint + versione pubblicata, ID diversi) | Deduplica per titolo + comando `radar.py rebuild` per correggere i dati già scaricati senza riscaricarli |
| 2026-11-17 | — | Una domanda breve agli agenti costava $0,36 con il modello di default | Con Sonnet $0,20. Scelta finale: modello dell'account di default (uso l'abbonamento, quindi è già pagato) e `RADAR_MODEL` opzionale per chi usa la chiave API. Il costo fisso di Claude Code resta: per domande banali un agente è sovradimensionato |
| 2026-11-17 | — | **Errore metodologico mio (dell'agente)**: per Koopman molte keyword risultavano "nuove" (es. *state estimation*). Causa: OpenAlex restituisce solo i primi 200 gruppi, quindi una keyword fuori dalla top 200 nella finestra precedente sembrava avere conteggio 0 | Notato guardando la dashboard, non dai test. Ora i conteggi mancanti vengono richiesti esplicitamente (*state estimation*: da "nuovo" a 2→17, ×3,26). Sulla mappa le istituzioni con meno di 3 lavori sono grigie |
| 2026-11-17 | — | Esaurito il budget OpenAlex anonimo giornaliero durante i test | Il messaggio d'errore è chiaro e i dati esistenti non vengono toccati. Gli altri 4 topic sono da riscaricare domani o con la chiave gratuita |
| 2026-11-18 | "Come mai non vedo EPFL?" | Verificato su OpenAlex: EPFL ha 31 lavori MPC nel 2024–26, ma solo 1 per la query NN-SysID e 0 per learning-MPC | Non è un bug del codice ma un limite di dati e query (affiliazioni OpenAlex, termini della query). Buon esempio di "controllo umano con conoscenza del dominio": io so che EPFL lavora su questi temi, i dati non lo mostrano |
| 2026-11-18 | — | Striscia "glitchata" sulla mappa: i paesi che attraversano il meridiano 180° (Russia, Fiji) | Longitudini "srotolate" e Antartide rimossa |
| 2026-11-18 | "Perché dati solo dal 2016?" | Era una scelta di configurazione arbitraria | `start_year` portato al 2000 e topic riscaricati |
| 2026-11-18 | "Aggiungi tutte le keyword di automatica + ML" | 56 topic in 6 gruppi; query di learning-MPC e NN-SysID allargate (DeePC, neural state-space, LSTM…) | Alcune query mescolavano AND/OR senza parentesi (ambigue): corrette dopo un controllo automatico |
| 2026-11-18 | "Grafo stile Obsidian" | Grafo collaborazioni / parole / tutto, con pannello dettagli e "solo vicini" | Dagli screenshot: nel grafo delle parole la parola della query (es. "model predictive control") era collegata a tutto, quindi l'ho nascosta e segnalata; componenti isolati rendevano lo zoom illeggibile |
| 2026-11-18 | — | **I permessi che ho scritto per gli agenti hanno bloccato anche me** (modifica di `scripts/`, download di librerie): il blocco funziona per chiunque | Non li ho aggirati: la ricerca globale ora è costruita nel browser e la libreria del grafo arriva da CDN. Per sviluppare serve un `.claude/settings.local.json` separato |
| 2026-11-18 | — | Budget OpenAlex anonimo esaurito: i nuovi topic non sono ancora scaricati | Compaiono nel menu come "○ da scaricare": selezionandoli parte il download |
| 2026-11-18 | "Sei sicuro di aver fatto bene? Volevo due grafi relazionali stile Logseq" | **Avevo frainteso**: avevo fatto un solo grafo con 3 modalità. Rifatti come due grafi separati (persone↔paper, parole↔parole) con pannello impostazioni, nodi trascinabili, evidenziazione dei vicini | Dallo screenshot: un ricercatore risultava con l'affiliazione di un paper di 20 anni prima (Bemporad → Siena), ora uso l'ultima affiliazione nota. Il grafo delle collaborazioni è frammentato perché costruito su un campione di ~240 paper su 26 anni: è un limite dei dati, non della visualizzazione |
| 2026-11-18 | "La striscia sulla mappa è ricomparsa" | Nel browser di test la mappa è corretta. Ipotesi: il browser usava una versione vecchia di app.js dalla cache | Aggiunto il versioning (`app.js?v=5`) per forzare il ricaricamento. Da confermare con l'utente |
| 2026-11-18 | "Mancano EPFL e Ferrari-Trecate" | Diagnosi: dati scaricati con le query vecchie (budget esaurito) + la dashboard mostra solo i primi 150-200 + mancava il lessico del gruppo (REN, performance boosting, port-Hamiltonian) | Aggiunte keyword e un topic dedicato; **la soluzione vera è stata la watchlist** (`config/watchlist.json`): gruppi e persone seguiti contati in ogni topic. Per farlo ho dovuto chiedere all'utente di sbloccare `scripts/` |
| 2026-11-18 | — | Prima versione della watchlist: **Colin Jones unito a 3 omonimi** (uno meteorologo in Svezia) e risultava alla Cornell; Ferrari-Trecate risultava a IMT Lucca | Il campo "ultima istituzione" di OpenAlex è inaffidabile. Ora: nome + affiliazione coerente per unire i profili, istituzione = la più presente negli ultimi 3 anni. Verificato a mano sui titoli dei paper recenti |
| 2026-11-18 | — | Il plugin della privacy ha bloccato l'invio della mail dell'utente a OpenAlex per richiedere la chiave, anche con il consenso | L'utente ha creato la chiave da solo. Buon esempio di protezione che funziona anche quando è scomoda |

## Esecuzioni di /radar
<!-- le voci vengono aggiunte qui dagli agenti -->

### 2026-11-18 — robust-mpc (Robust & Stochastic MPC)
- **Query:** `"robust MPC" OR "tube-based MPC" OR "tube MPC" OR "stochastic MPC" OR "stochastic model predictive control" OR "robust model predictive control"` (slug già configurato).
- **Fetch:** rifiutato perché il budget OpenAlex giornaliero era esaurito. Ho usato i dati già scaricati oggi alle 11:16 con la stessa query (2551 lavori; 934 nel 2024–26 contro 577 nel 2021–23).
- **Reviewer: FIX NEEDED.** `radar.py check` ha trovato 0 ID inesistenti su 207. Il reviewer ha segnalato:
  1. "Un solo topic in calo" era falso: `digest.md` elenca solo 25 topic e l'analista l'ha preso come lista completa. Ne mancavano 7 sotto x0.8, fra cui [T10046] Stability and Control of Uncertain Systems (x0.755).
  2. Sichuan mancava dalla classifica delle istituzioni con crescita più rapida.
  3. Affermazioni non supportate dai dati: "in Europa cresce la Germania" (Hannover e Dortmund in realtà perdono quota) ed "ETH resta il riferimento teorico".
  4. Un paper multi-istituzione è stato attribuito a TU Delft come se fosse una sua linea di ricerca.
  5. Graichen è stato collegato a un paper (GRAMPC) di cui non è autore.
- **Correzioni:** un round di fix su report.md, trends.md e collaborators.md, poi `check` OK (255 ID). Nel report è stato aggiunto il limite "digest troncato". Spunto per il futuro: fare in modo che il digest includa anche i topic in calo.

### 2026-11-18 — economic-mpc (Economic MPC)
- **Query:** `"economic model predictive control" OR "economic MPC"` (slug già configurato).
- **Fetch:** lo scout non ha potuto riscaricare, perché `radar.py fetch` è stato bloccato dai permessi. L'analisi usa i dati già scaricati lo stesso giorno alle 11:16: 785 lavori, 235 nel 2024-26 contro 185 nel 2021-23 (x1.27).
- **Analisi:** trend-analyst e collab-finder in parallelo, poi report scritto dall'orchestratore.
- **Cosa ha trovato il reviewer** (verdetto FIX NEEDED):
  - due paper attribuiti alla persona sbagliata: [W4416617166] non è di McAllister ma del gruppo De Schutter; [W7202119722] non è di Allgöwer;
  - Zanon, Müller e Bemporad dichiarati "senza ID", mentre l'ID c'è in `works.json`;
  - i conteggi per paese presentati come totali, ma sono della sola finestra 2024-26;
  - "cresce al ritmo del settore": in realtà la quota media scende da circa 0.00137 a circa 0.00124;
  - superlativi non supportati ("riferimento europeo", "lavoro fondante", "prototipo");
  - "2-6 lavori per istituto" invece di 1-6;
  - mancava il segnale della keyword koopman-operator (da 0 a 8).
- **Cosa ho corretto:** tutte le voci sopra, in report.md, collaborators.md e trends.md. Ho verificato a mano su papers.md e works.json le attribuzioni e gli ID segnalati dal reviewer prima di applicarli.
- **Non eseguito:** `radar.py check` e `radar.py index` sono stati bloccati dai permessi in questa sessione, quindi vanno lanciati a mano. Il reviewer aveva ripetuto il controllo degli ID a mano, senza trovare ID sconosciuti.
