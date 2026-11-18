# Collaborazioni: Robust & Stochastic MPC

Profilo: MPC e learning-based MPC, identificazione con reti neurali, Koopman, MPC embedded. Finestra recente [2024, 2026] (2026 parziale).

## Gruppi seguiti (watchlist)
- **ETH Zurich** [I35440088]: 11 lavori recenti contro 16 precedenti (crescita x0.425). Melanie N. Zeilinger [A5037513714]: 8 lavori recenti, h-index 47. Lavori: [W4407359055] (SMPC con policy ottimizzate online) e [W4410491960].
- **IMT Lucca** [I127077003]: 7 contro 4 (x1.081). Alberto Bemporad [A5053340099]: 4 lavori recenti, h-index 87. Lavori: [W4405429595] (SMPC learning-based) e il filone configuration-constrained tube MPC [W4391589536].
- **Politecnico di Milano** [I93860229]: 6 contro 6 (x0.618). Lavori: [W7118568874] e [W4401691911].
- **EPFL** [I5124864]: 3 contro 3 (x0.618). Lavori: [W4388936569] (tube MPC con predittori multi-step) e [W7203671904].
- **Università di Pavia** [I25217355]: 2 contro 2. Contiene [W4389749386], un robust NMPC con modello GRU. Fra i paper del campione è quello più vicino al profilo.
- **IDSIA** [I2614128279]: 1 contro 0. Dario Piga [A5046585507] ha 1 lavoro recente, con affiliazione SUPSI [I15196421]. Lavoro: [W7117309676].
- Colin N. Jones, Giancarlo Ferrari-Trecate e Lalo Magni compaiono solo come coautori nei paper. Non sono in `authors.json`, quindi non hanno un ID autore.

## Gruppi da considerare
1. **FAU Erlangen-Nürnberg** [I181369854], Erlangen (DE): 6 contro 1 (x3.707). Persone: Knut Graichen [A5021957729], Daniel Landgraf [A5002814930], Thore Wietzke [A5093680579]. Lavori: [W7134199088] (SMPC con dinamica GP) e [W7202170213] (GRAMPC, di Landgraf, Wietzke e coautori; Graichen non è tra gli autori). *Fit:* modelli appresi dentro un MPC stocastico, con un solver real-time.
2. **TU Dortmund** [I200332995], Dortmund (DE): 6 contro 6. Persone: Sergio Lucia [A5052312024], Moritz Heinlein [A5006230929]. Lavori: [W4386515812] (do-mpc) e [W7165402882] (MPC robusto approssimato con reti neurali). *Fit:* unisce MPC robusto, reti neurali e implementazione software.
3. **Leibniz University Hannover** [I114112103], Hannover (DE): 5 contro 4. Persona: Matthias A. Müller [A5057092836]. Lavori: [W4410619902] e [W4391589536], scritti con IMT. *Fit:* teoria del tube MPC e del data-driven MPC, con legami già esistenti con Lucca.
4. **Delft University of Technology** [I98358874], Delft (NL): 15 contro 6 (x1.544). Lavori: [W4205769419] (tube MPC con Koopman, lavoro congiunto NUDT / TU Delft / PoliMi / Jilin: Delft è una delle quattro affiliazioni) e [W4405961978] (MPC basato su RL). *Fit:* learning applicato all'MPC robusto; la linea Koopman di Delft va verificata.
5. **Grenoble INP** [I106785703] / **GIPSA-Lab** [I4210124956], Grenoble (FR): 4 e 5 lavori recenti. Persona: Mirko Fiacchini [A5035566586]. Lavori: [W4399912895] (con coautori italiani CNR-IEIIT) e [W7131389916]. *Fit:* SMPC rigoroso, con un ponte naturale verso l'Italia.
6. **TU Wien** [I145847075], Vienna (AT): 4 contro 0. Persona: Hung Duy Nguyen [A5026860984]. Lavoro: [W7225823648]. *Fit:* robust MPC physics-informed e data-driven.
7. **Nuclei italiani emergenti**: Bergamo [I11039511] (3 contro 0, [W7131124665]) e Siena [I102064193] (3 contro 0, Renato Quartullo [A5003413079], [W7130739222]). *Fit:* tube MPC e incertezza di modello, a poca distanza.
8. **Fuori dall'Europa: Sichuan University** [I24185976], Chengdu (CN): 25 contro 5 (x3.089). Persone: Bin Li [A5100365238] e Gaoqi Liu [A5024841973]. Lavori: [W4416970250] (robust MPC con deep Koopman) e [W7208761887]. *Fit:* Koopman e reti neurali dentro un MPC stocastico o robusto.

## Persone da seguire
- **Johannes Köhler** [A5054219974], ETH: 8 lavori recenti, h-index 33. Robust/stochastic MPC e data-driven MPC.
- **Sergio Lucia** [A5052312024], TU Dortmund: 7 lavori recenti, h-index 29. Robust MPC, approximate MPC, safe RL.
- **Knut Graichen** [A5021957729], FAU: 6 lavori recenti, h-index 32. SMPC con processi gaussiani, NMPC real-time.
- **Mirko Fiacchini** [A5035566586], Grenoble INP: 6 lavori recenti, h-index 23. Fattibilità ricorsiva e tube nell'SMPC.
- **Matthias A. Müller** [A5057092836], Hannover: 4 lavori recenti, h-index 48. Tube MPC e data-driven MPC.
- **Boris Houska** [A5050485888] e **Mario E. Villanueva** [A5058471300], IMT: 5 lavori recenti ciascuno, h-index 31 e 16. Configuration-constrained tube MPC.
- **Georg Schildbach** [A5089302816], Lübeck: 4 lavori recenti, h-index 21. Robust MPC per sistemi LPV e di grande scala ([W4417077589]).
- **Bin Li** [A5100365238], Sichuan: 12 lavori recenti, h-index 31. SMPC distributionally robust, Koopman.

## Lista di lettura
- [W2557055507] (2016, classic): la panoramica di riferimento sull'MPC stocastico.
- [W2952672134] (2020, classic): data-driven MPC con garanzie di robustezza. È la base del filone data-driven.
- [W4205769419] (2022, classic): tube MPC con operatori di Koopman. Collega l'identificazione al controllo robusto.
- [W4391589536] (2024, recent-impact): configuration-constrained tube MPC.
- [W4399345172] (2024, recent-impact): modello ibrido Koopman con tube zonotopico.
- [W4402836939] (2024, recent-impact): robust MPC veloce tramite ricorsioni di Riccati. Rilevante per l'embedded.
- [W4410491960] (2025, recent-impact): garanzie in anello chiuso per l'SMPC nonlineare.
- [W7134199088] (2026, fresh): SMPC nonlineare con dinamica appresa da GP.
- [W7148360004] (2026, fresh): operatori di Koopman parametrici per l'SMPC.
- [W7225823648] (2026, fresh): robust MPC physics-informed e data-driven.

## Limiti
- **Affiliazioni non aggiornate o incoerenti.** Köhler compare come Stuttgart nei paper classici e come ETH in quelli recenti. Houska compare sia come IMT sia come ShanghaiTech [I30809798]. Kyoungseok Han [A5014408311] in `authors.json` risulta a Chongqing, ma in [W7225823648] figura a Hanyang. Piga risulta a SUPSI, non a IDSIA.
- **Disambiguazione dei nomi.** Nomi comuni come "Bin Li" possono unire più persone sotto un solo profilo. Alcuni autori seguiti (Jones, Ferrari-Trecate, Magni) non hanno un profilo in `authors.json`.
- **Copertura parziale.** `papers.md` contiene un campione di 335 lavori su 2551. La ricerca è per parole chiave su titolo e abstract, quindi non equivale all'appartenenza reale al tema. Il 2026 è un anno parziale.
- **Conteggi per istituzione.** ETH [I35440088] e l'Institute for Dynamic Systems and Control [I4405256045] sono contati separatamente, quindi il peso di Zurigo potrebbe essere sottostimato.
