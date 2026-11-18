# Revisu — Research Visualisation Support

**Google Trends per la ricerca in controllo, automazione e machine learning.** Scegli un argomento e vedi
quanto si pubblica, quali sotto-temi crescono, dove sono i gruppi che ci lavorano (mappa mondiale), chi
collabora con chi (grafi esplorabili) e quali paper leggere. Un team di agenti Claude Code analizza i dati
e scrive un report, che un agente revisore verifica.

Gira tutto **sul tuo computer**. Le uniche chiamate esterne sono all'API pubblica di [OpenAlex](https://openalex.org)
(per i dati) e a Claude (per gli agenti). I dati di 44 topic sono già inclusi, quindi la dashboard funziona subito.

---

## Installazione: 3 passi (Windows, macOS, Linux)

Ti servono solo un **account Claude** (abbonamento Pro/Max, oppure una chiave API) e una connessione a internet.
Python e Claude Code, se mancano, li installa il setup. Non servono librerie aggiuntive.

### 1. Scarica Revisu
Sulla pagina GitHub del progetto: pulsante verde **Code → Download ZIP**, poi estrai lo ZIP dove vuoi.
In alternativa, se usi git: `git clone https://github.com/<utente>/revisu.git`.

### 2. Setup (una sola volta)
| Sistema | Cosa fare |
|---|---|
| **Windows** | doppio clic su **`setup.bat`** |
| **macOS** | doppio clic su **`setup.command`**. Se macOS lo blocca: tasto destro → *Apri* → *Apri* |
| **Linux** | apri un terminale nella cartella e scrivi `bash setup.sh` |

Il setup:
1. controlla Python e lo installa se manca (Windows: `winget`; macOS: Homebrew o Command Line Tools di Apple;
   Linux: `apt`/`dnf`/`pacman`, che chiedono la password);
2. installa **Claude Code** con l'installer ufficiale, se manca;
3. chiede se usi un **abbonamento Claude**: rispondi *Y* (nessuna chiave da inserire). Con una chiave API rispondi *n*
   e incollala;
4. chiede la chiave **OpenAlex**, *gratuita* e opzionale ([openalex.org/settings/api](https://openalex.org/settings/api)).
   Senza chiave puoi aggiornare solo circa 5 topic al giorno; i dati inclusi funzionano comunque.

Le chiavi restano nel file locale `.env`. Gli agenti non hanno il permesso di leggerlo.
Per cambiare una chiave basta rilanciare il setup.

### 3. Avvio (ogni volta)
| Sistema | Cosa fare |
|---|---|
| **Windows** | doppio clic su **`start.bat`** |
| **macOS** | doppio clic su **`start.command`** |
| **Linux** | `bash start.sh` |

Si apre la dashboard nel browser (http://localhost:8765/dashboard/) e, nella finestra del terminale, Claude Code.
**Solo la prima volta** Claude Code chiede:
1. **il login**: scegli il tuo account Claude (si apre il browser);
2. **se ti fidi della cartella**: rispondi **Yes**. È necessario perché valgano i permessi del progetto;
   senza questa conferma gli agenti lanciati dalla dashboard non possono scaricare dati.

Per chiudere tutto scrivi `/exit` nel terminale, oppure chiudi la finestra.

### Se qualcosa non va
| Problema | Soluzione |
|---|---|
| Windows: "l'esecuzione di script è disabilitata" | usa i file `.bat`, che la aggirano solo per questo progetto |
| macOS: "impossibile verificare lo sviluppatore" | tasto destro sul file → *Apri* → *Apri* |
| macOS: errore `CERTIFICATE_VERIFY_FAILED` | apri *Applicazioni → Python 3.x → Install Certificates.command* |
| "OpenAlex daily budget exhausted" | aggiungi la chiave OpenAlex gratuita (rilancia il setup) o riprova domani |
| La console agenti dice "cartella non fidata" | lancia `start` una volta e rispondi *Yes* alla domanda di fiducia |
| La porta 8765 è occupata | chiudi l'altra finestra di Revisu, oppure imposta `RADAR_PORT=8766` in `.env` |
| Controllo generale | dentro Claude Code scrivi `/status` |

## Dalla dashboard (senza scrivere comandi)

| Cosa | Come |
|---|---|
| Nuovo argomento | **+ Topic** (tasto `n`). Con *Solo dati* scrivi tu la query OpenAlex (gratis, circa 15 s); con *Lascia fare agli agenti* la costruisce Claude |
| Report verificato | **✦ Genera report con agenti**: segui in diretta scout → trend-analyst + collab-finder → reviewer nella **console** (tasto `a`) |
| Domande libere | console agenti → *Chiedi*, es. "chi lavora su MPC in Italia?" |
| Confronto stile Google Trends | fino a 4 topic sul grafico; modalità *Assolute*, *% letteratura controllo*, *Indice* |
| Grafi relazionali (stile Logseq) | **persone & paper**: chi ha scritto cosa, e quindi chi collabora con chi (dalle impostazioni ⚙ puoi nascondere i paper); **parole**: keyword che compaiono negli stessi paper, colorate per crescita. Passa con il mouse per evidenziare i collegamenti, clicca per i dettagli, trascina i nodi, ⛶ per lo schermo intero |
| Gruppi seguiti | riquadro ★ con le istituzioni e le persone di `config/watchlist.json`, sempre contate (vedi sotto) |
| 57 topic preconfigurati | MPC, identificazione, learning & control, controllo classico, applicazioni, automazione industriale. Quelli con ○ nel menu non sono ancora scaricati: selezionali per scaricarli |
| Panoramica | grafico volume × crescita di tutti i topic: in alto a destra quelli grandi e in crescita |
| Filtri incrociati | clic su una keyword per vedere i paper relativi; clic su un paese per filtrare persone e mappa; zoom rapido Europa/Italia |
| Ricerca globale | tasto `/`: persone, istituzioni e paper in tutti i topic |
| Lista personale | ☆ su paper e persone, poi **★** per esportare in **BibTeX** o Markdown |
| Condividere / stampare | **🔗 Link** copia la vista corrente; **⎙ PDF** stampa il report |

**Costi.** I download da OpenAlex sono gratuiti. Gli agenti usano il Claude Code di chi lo avvia: con un
abbonamento Pro/Max è tutto incluso, e la console mostra solo un costo *equivalente API*. Con una chiave API si paga a
consumo: come ordine di grandezza, una domanda breve costa circa $0,20–0,35 e un report completo qualche dollaro.
Per risparmiare aggiungi a `.env` `RADAR_MODEL=sonnet` (oppure `haiku`). Di default viene usato il modello
predefinito dell'account.

## Cosa chiedere agli agenti (dentro Claude Code)

| Comando | Cosa fa |
|---|---|
| `/radar nn-sysid` | pipeline completa su un topic preconfigurato: dati → analisi → report → verifica |
| `/radar "neural ODE for system identification"` | lo stesso su un argomento libero (l'agente costruisce la query) |
| `/ask chi lavora su learning-based MPC in Italia?` | domanda libera sui dati già scaricati |
| `/refresh` | riscarica i dati di tutti i topic (senza LLM, quindi gratis) |
| `/status` | controlla che il setup sia a posto |

Da terminale, senza LLM: `python scripts/radar.py list | fetch <slug> | fetch-all [--skip-today] | watch | rebuild | check <slug> | status`
(su macOS/Linux usa `python3`).

La dashboard **si aggiorna da sola** ogni 8 secondi: quando gli agenti scrivono nuovi dati o un report,
li vedi comparire senza ricaricare la pagina.

## Come funziona

```
           ┌──────────────── Claude Code (/radar) ───────────────┐
 OpenAlex  │  scout ──► trend-analyst ─┐                          │
   API ◄───┼─ (runs radar.py)          ├─► report.md ─► reviewer  │
           │            collab-finder ─┘   (orchestratore)  │     │
           └────────────────────────────────────────────────┼─────┘
                          data/<topic>/*.json, *.md  ◄──────┘
                                     │
              scripts/server.py (localhost) ──► dashboard/
              avvia radar.py e `claude -p` e trasmette l'avanzamento in streaming (SSE)
```

- **`scripts/radar.py`** è il livello dati **deterministico** (niente LLM). Interroga OpenAlex e calcola trend,
  crescita dei sotto-temi (quota recente / quota precedente), istituzioni geolocalizzate, autori, paper campione.
- **`.claude/agents/`** contiene i quattro subagenti:
  - `scout`: scarica i dati e controlla che la query abbia senso;
  - `trend-analyst`: analizza trend e hot topic;
  - `collab-finder`: confronta i dati con `config/profile.md` e propone gruppi, persone e letture;
  - `reviewer`: verifica ID e numeri, segnala le affermazioni che vanno oltre i dati.
- **`.claude/commands/`** contiene i comandi `/radar`, `/ask`, `/refresh`, `/status`.
- **`.claude/settings.json`** applica il principio del privilegio minimo: gli agenti possono eseguire solo `radar.py`
  e scrivere solo in `data/`. Non possono fare `curl` o WebFetch, leggere `.env` o modificare gli script.
- **`scripts/server.py`** è il server locale (solo libreria standard). Ascolta solo su 127.0.0.1, rifiuta le richieste
  che arrivano da altre origini (protezione da CSRF e DNS rebinding), non serve mai `.env` né gli script, passa il prompt a
  Claude via stdin (mai tramite shell) e consente solo i comandi `radar` e `ask`.
- **`CLAUDE.md`** contiene le regole del progetto: dati non fidati (prompt injection negli abstract), obbligo di
  citare gli ID, nessun numero inventato.

## Gruppi e persone da seguire
In `config/watchlist.json` elenchi le istituzioni e le persone che ti interessano. Vengono contate in **ogni** topic
anche quando sono lontane dalla cima della classifica: un gruppo con 2 paper su un tema, altrimenti invisibile, compare
nel riquadro "★ Gruppi e persone che segui", sulla mappa (con l'anello) e nel grafo. Dopo una modifica lancia
`python scripts/radar.py watch`.

Per le persone lo script cerca i profili OpenAlex con lo stesso nome **e** con un'affiliazione coerente, per non unire
omonimi, e usa l'istituzione più presente negli ultimi 3 anni. Se il risultato è sbagliato puoi fissare il profilo a mano:
`{"name": "Colin N. Jones", "ids": ["A5085117832"], "institution": "EPFL", "country": "CH"}`.

## Personalizzare
- `config/profile.md`: i tuoi interessi e le preferenze geografiche, usati dal *collab-finder*.
- `config/topics.json`: i topic preconfigurati. Le query usano la sintassi booleana di OpenAlex (`"frase esatta"`,
  `AND`, `OR`, senza virgole).

## Progetto del corso
Revisu è nato come compito finale di un corso di dottorato sull'IA agentica. In [WORKFLOW_LOG.md](WORKFLOW_LOG.md)
c'è il diario di sviluppo: cosa è stato chiesto all'agente, cosa ha prodotto e cosa è stato corretto a mano.

## Limiti noti
- OpenAlex non è completo. Inoltre la ricerca per parole chiave su titolo e abstract non coincide con
  "tutti i lavori sul tema".
- La disambiguazione degli autori può sbagliare (omonimi, persone divise in più profili), e le affiliazioni
  possono non essere aggiornate.
- L'anno in corso è parziale.
- I report sono generati da un LLM e verificati, ma vanno comunque letti in modo critico.
