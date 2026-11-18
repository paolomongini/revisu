# Robust & Stochastic MPC — Research Radar
*Generato il 2026-11-18 da OpenAlex · query: `"robust MPC" OR "tube-based MPC" OR "tube MPC" OR "stochastic MPC" OR "stochastic model predictive control" OR "robust model predictive control"`*

## In breve
- **Il tema cresce più del campo.** Ci sono 934 lavori nel 2024–2026 contro 577 nel 2021–2023 (x1.619). La quota sulla letteratura di controllo passa da 0.004073 (2021) a 0.005 (2025). Il 2026 è parziale ma conta già 406 lavori, più dei 314 del 2025: è un dato da prendere con cautela (vedi Limiti).
- **Il segnale più forte è Koopman.** La keyword `koopman-operator` passa da 4 a 27 lavori (x4.17). Il tema è l'MPC robusto e stocastico costruito su modelli appresi dai dati, molto vicino al profilo (identificazione + MPC).
- **Il nucleo metodologico è ancora il tube MPC.** `tube-mpc` cresce x2.677 (26 vs 6) e `constraint-tightening` x1.359. In crescita anche gli osservatori: `extended-state-observer` x3.089 (15 vs 3).
- **Il volume è soprattutto cinese** (Cina 454 lavori, USA 95, Germania 65, Regno Unito 53, Italia 36). In Europa i segnali sono misti: FAU Erlangen [I181369854] passa da 1 a 6 lavori, mentre Hannover [I114112103] (x0.772), Dortmund [I200332995] (x0.618) ed ETH Zurich [I35440088] (11 vs 16, x0.425) perdono quota.
- **Il paper più vicino al profilo** è un robust NMPC con modello GRU di Pavia [W4389749386]. Fuori dall'Italia i gruppi più adatti al profilo sono FAU Erlangen (SMPC con processi gaussiani) e TU Dortmund (MPC robusto approssimato con reti neurali).

## Trend
Dal 2000 al 2026 OpenAlex conta **2551** lavori. La serie annuale cresce in modo quasi monotono: 178 (2021), 193 (2022), 206 (2023), 214 (2024), poi un salto a 314 (2025) e 406 (2026, anno parziale). Il confronto fra finestre dà una crescita del volume **x1.619**.

La crescita non è solo un effetto dell'aumento generale delle pubblicazioni: la quota del tema sulla letteratura di controllo sale da 0.004073 (2021) a 0.005 (2025) e 0.00571 (2026). Non è lineare: la quota cala già nel 2023 (0.004399 → 0.004321), tocca il minimo nel 2024 (0.004029), poi riparte.

## Hot topic
Le crescite delle keyword sono rapporti tra quote, quindi sono già normalizzate sul volume del tema: x1 vuol dire "cresce quanto il robust/stochastic MPC nel complesso".

- **Koopman e MPC data-driven.** `koopman-operator` 27 vs 4 (**x4.17**), `data-driven-control` 28 vs 14 (x1.236). Si usano modelli lineari o bilineari nello spazio "sollevato" di Koopman per ottenere MPC robusti o stocastici di sistemi non lineari. Lavori: il tube MPC con Koopman [W4205769419] (Automatica 2022, 248 citazioni), il tube zonotopico per veicoli [W4399345172], gli operatori di Koopman parametrici per l'SMPC [W7148360004].
- **Tube MPC e constraint tightening.** `tube-mpc` 26 vs 6 (**x2.677**), `tube-based-model-predictive-control` 101 vs 41 (x1.522), `constraint-tightening` 44 vs 20 (x1.359). Lavori: il configuration-constrained tube MPC [W4391589536] e il tube MPC event-triggered con garanzie ISS [W7165650547].
- **Learning e quantificazione dell'incertezza.** `gaussian-process-regression` 15 vs 5 (x1.853), `uncertainty-quantification` 23 vs 8 (x1.776), `model-discrepancy` 24 vs 10 (x1.483). L'idea è imparare dai dati il modello o il suo errore, insieme a un'incertezza da dare all'MPC stocastico, come nell'SMPC con dinamica GP [W7134199088].
- **Osservatori e stima dei disturbi.** `extended-state-observer` 15 vs 3 (**x3.089**), `disturbance-estimation` 20 vs 7 (x1.765). Compaiono soprattutto nei drive elettrici, ad esempio [W4408100214].
- **Tracking e tempo reale.** `trajectory-tracking` 88 vs 23 (x2.364), `real-time-control` 40 vs 14 (x1.765), `computational-efficiency` 21 vs 9 (x1.441). Per l'embedded è rilevante il robust MPC veloce con ricorsioni di Riccati [W4402836939].
- **Domini applicativi in crescita** (topic OpenAlex): [T11701] Space Satellite Systems (21 vs 5, x2.595), [T11007] Hybrid Renewable Energy Systems (21 vs 5, x2.595), [T11192] Underwater Vehicles (24 vs 7, x2.118), [T11615] Mobile Robots (127 vs 49, x1.601).
- **In raffreddamento** (crescita < 0.8). Il caso più rilevante è [T10046] Stability and Control of Uncertain Systems, il topic più vicino al robust control classico: 220 vs 180, x0.755. Crescono in valore assoluto ma perdono quota anche le applicazioni energetiche e di rete: [T10603] Smart Grid Energy Management (34 vs 34, x0.618), [T10223] Microgrid Control (50 vs 48, x0.644), [T10768] Electric Vehicles and Infrastructure (20 vs 19, x0.65), [T10524] Traffic control (51 vs 48, x0.656), [T10963] Advanced Optimization Algorithms (61 vs 57, x0.661), [T10228] Multilevel Inverters (27 vs 24, x0.695), [T10808] Electric and Hybrid Vehicle Technologies (27 vs 21, x0.794). Insieme ai topic in crescita, questo suggerisce (ma non dimostra) uno spostamento dalla teoria classica dei sistemi incerti e dall'energia verso robotica, spazio e modelli appresi.

## Dove si fa ricerca
Le istituzioni con più lavori recenti sono cinesi: [I24185976] Sichuan University (25, x3.089), [I204983213] Harbin Institute of Technology (24, x1.853), [I99065089] Tsinghua (24, x1.141), [I125839683] Beijing Institute of Technology (24, x0.645). La crescita di Sichuan dipende in gran parte da una persona: Bin Li [A5100365238] firma 12 dei lavori recenti.

Fra le istituzioni con almeno 10 lavori recenti crescono più in fretta [I148128674] University of Shanghai for Science and Technology (15 vs 2, x4.633), Sichuan (x3.089), [I116953780] Tongji (17 vs 4, x2.626) e [I172675005] NTU Singapore (16 vs 4, x2.471).

**Europa.** [I98358874] TU Delft cresce (15 vs 6, x1.544). I gruppi storici perdono quota: [I35440088] ETH Zurich (11 vs 16, x0.425), [I79238269] Universidad de Sevilla (x0.68), [I47508984] Imperial College (x0.824).

**Italia (36 lavori in totale).** [I127077003] IMT Lucca (7 vs 4) e [I93860229] Politecnico di Milano (6 vs 6). Pavia [I25217355] ha pochi lavori (2 vs 2) ma molto vicini al profilo. Bergamo [I11039511] e Siena [I102064193] sono nuclei nuovi (3 vs 0 ciascuno).

## Con chi collaborare
**Gruppi già seguiti (watchlist):**
- **ETH Zurich**: Melanie N. Zeilinger [A5037513714] e Johannes Köhler [A5054219974] hanno 8 lavori recenti ciascuno (h-index 47 e 33). Hanno firmato insieme il lavoro sulle garanzie in anello chiuso per l'SMPC nonlineare [W4410491960].
- **IMT Lucca**: Alberto Bemporad [A5053340099] (h-index 87) lavora su SMPC learning-based [W4405429595]. Boris Houska [A5050485888] e Mario E. Villanueva [A5058471300] lavorano sul configuration-constrained tube MPC [W4391589536].
- **Pavia**: Lalo Magni, con il robust NMPC su modello GRU [W4389749386]. È il ponte più diretto fra reti neurali per l'identificazione e MPC robusto.
- **Politecnico di Milano** ([W7118568874]), **EPFL** [I5124864] (tube MPC con predittori multi-step [W4388936569]) e **IDSIA/SUPSI** (Dario Piga [A5046585507], [W7117309676]) sono presenti ma con pochi lavori in questo tema.

**Gruppi nuovi da considerare (Europa prima):**
1. **FAU Erlangen-Nürnberg** [I181369854]: 6 vs 1 (x3.707). Il gruppo di Knut Graichen [A5021957729] lavora su SMPC con dinamica appresa da GP [W7134199088]. Daniel Landgraf [A5002814930] e Thore Wietzke [A5093680579] firmano anche il lavoro sul solver real-time GRAMPC [W7202170213]. A nostro giudizio è il gruppo più adatto al profilo, perché combina modelli appresi e MPC embedded, ma la base è piccola: 6 lavori recenti.
2. **TU Dortmund** [I200332995]: Sergio Lucia [A5052312024] (7 lavori recenti) sviluppa do-mpc [W4386515812] e l'MPC robusto approssimato con reti neurali [W7165402882].
3. **Leibniz University Hannover** [I114112103]: Matthias A. Müller [A5057092836] lavora su teoria del tube MPC e data-driven MPC, con legami già esistenti con IMT Lucca [W4410619902].
4. **TU Delft** [I98358874]: cresce nel tema (15 vs 6, x1.544). Il tube MPC con Koopman [W4205769419] è un lavoro congiunto NUDT / TU Delft / PoliMi / Jilin, quindi da solo non indica una linea di ricerca di Delft. Va verificato sui paper recenti del gruppo.
5. **Grenoble INP** [I106785703]: Mirko Fiacchini [A5035566586] lavora su SMPC rigoroso, con coautori italiani del CNR-IEIIT [W4399912895].
6. **TU Wien** [I145847075]: Hung Duy Nguyen [A5026860984] lavora su robust MPC physics-informed [W7225823648].
7. **Fuori dall'Europa**: Sichuan University [I24185976] (robust MPC con deep Koopman [W4416970250]).

## Da leggere
1. [W2557055507] (2016, 1157 citazioni): la panoramica di riferimento sull'MPC stocastico.
2. [W2952672134] (2020, 1054 citazioni): data-driven MPC con garanzie di stabilità e robustezza.
3. [W4205769419] (2022): tube MPC con operatori di Koopman.
4. [W4389749386] (2023): robust NMPC con modello GRU. È il più vicino al profilo.
5. [W4391589536] (2024): configuration-constrained tube MPC.
6. [W4402836939] (2024): robust MPC veloce con ricorsioni di Riccati, rilevante per l'embedded.
7. [W4410491960] (2025): garanzie in anello chiuso per l'SMPC nonlineare con rumore illimitato.
8. [W7134199088] (2026): SMPC nonlineare con dinamica GP.
9. [W7148360004] (2026): operatori di Koopman parametrici per l'SMPC.
10. [W7225823648] (2026): robust MPC physics-informed e data-driven.

## Limiti di questa analisi
- **Anomalia 2026.** L'anno è parziale (dati al 18 novembre) ma conta 406 lavori contro 314 del 2025. I dati non dicono perché. Possibili cause: articoli online-first datati con l'anno del fascicolo, preprint arXiv inclusi, cambi nella copertura degli abstract di OpenAlex. Per questo x1.619 va letto come ordine di grandezza.
- **Dati non riscaricati in questa esecuzione.** Il budget giornaliero di OpenAlex era esaurito, quindi il report usa i dati scaricati oggi alle 11:16 con la stessa query.
- **Ricerca per parole chiave.** La query cerca titolo e abstract, quindi non coincide con l'appartenenza reale al tema. Entrano anche lavori marginali, ad esempio [W7158082043]. Alcune keyword (`tube-mpc`) sono quasi i termini della query stessa.
- **Digest troncato.** Il riassunto letto dagli agenti elenca solo 25 topic: la prima versione dell'analisi aveva perso i topic in calo, recuperati dalla review su `topics.json`.
- **Topic OpenAlex grossolani.** [T10791] Advanced Control Systems Optimization contiene 736 dei 934 lavori recenti, quindi non distingue i sotto-temi.
- **Numeri piccoli.** Crescite come x5.56 ([I14243506] PolyU, [I4575257] Hanyang: 9 vs 1) partono da basi minime.
- **Affiliazioni e nomi.** Köhler è a Stuttgart nei paper vecchi e a ETH nei recenti. Houska compare sia a IMT sia a ShanghaiTech. Piga è registrato a SUPSI, non a IDSIA. Un nome comune come "Bin Li" può unire più persone. Colin N. Jones, Giancarlo Ferrari-Trecate e Lalo Magni compaiono solo come coautori e non hanno un ID autore nei dati. ETH [I35440088] e l'Institute for Dynamic Systems and Control [I4405256045] sono contati separatamente.
- **Campione.** La lista dei paper è un campione di 335 lavori su 2551.
