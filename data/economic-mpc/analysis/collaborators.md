# Collaborazioni: Economic MPC

Profilo: dottorando in controllo automatico (IT). Interessi: MPC e learning-based MPC, identificazione con reti neurali, Koopman, MPC embedded/real-time. Il tema Economic MPC conta 785 lavori (2000-2026). Nella finestra recente [2024, 2026] ce ne sono 235, contro 185 in [2021, 2023] (crescita x1.27; il 2026 è parziale). Il volume è dominato da applicazioni energetiche, quindi i gruppi qui sotto sono scelti perché uniscono **modellazione/identificazione e controllo**, non perché sono i più prolifici.

## Gruppi seguiti
- **ETH Zurich [I35440088]**: 2 lavori recenti, 1 nella finestra precedente. Melanie N. Zeilinger [A5037513714] (1 recente, h-index 47) firma con John Lygeros [A5007359599] un adaptive EMPC con adattamento online del modello [W7125285669]. È il lavoro più vicino al profilo tra quelli dei gruppi seguiti.
- **IMT Lucca [I127077003]**: 3 lavori recenti contro 4 (crescita x0.59). Contributi teorici di Mario Zanon [W7134825881], [W7106310231], [W4405783908]. Alberto Bemporad compare in [W4380303849], ma non ha un profilo in `authors.json`.
- **Politecnico di Milano [I93860229]**: 2 lavori recenti contro 1 ([W4408609015], [W4412714218]).
- **EPFL [I5124864]**: 1 lavoro recente. Colin N. Jones [A5085117832] firma [W4417291510].
- Pavia, IDSIA, Ferrari-Trecate, Piga e Magni **non compaiono** nei dati di questo tema.

## Gruppi da considerare
1. **University of Stuttgart [I100066346]**, Stoccarda (DE). Persona chiave: Frank Allgöwer [A5001090900]. 5 lavori recenti. Pubblicazioni: [W7154484498] (stabilità EMPC periodico, 2026, Allgöwer) e [W7202119722] (EMPC con dinamiche ibride, 2026, altri autori di Stuttgart). Perché: è uno dei principali poli teorici europei dell'EMPC nel campione (dissipatività, garanzie), una base utile per dare garanzie ai controllori learning-based.
2. **Università di Bergamo [I11039511]**, Bergamo (IT). Persona chiave: Antonio Ferramosca [A5072233007], con Alejandro H. González [A5006192544] (CONICET, AR). Lavori: [W7214010484] (imitazione neurale stabile di EMPC) e [W4403582256] (previsione con reti ricorrenti dentro un EMPC). Perché: è il gruppo italiano più vicino al tema "reti neurali + MPC".
3. **TU Delft [I98358874]**, Delft (NL). Persona chiave: Robert D. McAllister [A5009355093]. 6 lavori recenti. Pubblicazione: [W7207766296] (ingredienti terminali guidati da policy). Nello stesso ateneo, il gruppo di Bart De Schutter [A5026547410] firma [W4416617166] (MPC approssimato via imitation learning, per l'esecuzione real-time). Perché: combina learning e MPC con un'attenzione al costo computazionale.
4. **Technical University of Denmark [I96673099]**, Kongens Lyngby (DK). 5 lavori recenti contro 1 (crescita x3.936). Pubblicazione: [W7203947404] (digital twin grey-box + EMPC). Perché: identificazione grey-box usata direttamente nel controllo.
5. **Imperial College London [I47508984]**, Londra (GB). 5 lavori recenti. Pubblicazione: [W7124458292] (modelli ibridi e stima dello stato per EMPC). Perché: modellazione ibrida fisica/dati in ambito industriale.
6. **CSIC [I134820265]**, Madrid (ES). Persona chiave: Vicenç Puig [A5023299508]. 2 lavori recenti. Pubblicazioni: [W7119531083] (EMPC robusto con approccio LPV) e il classico [W2617799486]. Perché: modelli LPV come ponte tra identificazione e MPC robusto.
7. **Nanyang Technological University [I172675005]**, Singapore (SG), extra-europeo. Persone chiave: Xunyuan Yin [A5032657663] e Minghao Han [A5057269196]. 6 lavori recenti. Pubblicazioni: [W4410614250] (deep neural Koopman + EMPC) e [W4399070699]. Perché: nei dati è il fit tematico più diretto tra identificazione neurale/Koopman e controllo economico, anche se poggia su pochi paper.

## Persone da seguire
| Persona | Istituzione | Recenti | h-index | Temi |
|---|---|---|---|---|
| Xunyuan Yin [A5032657663] | NTU [I172675005] | 4 | 28 | Koopman neurale, EMPC di processo |
| Minghao Han [A5057269196] | NTU | 3 | 19 | Modelli ibridi neurali, Koopman |
| Antonio Ferramosca [A5072233007] | Bergamo [I11039511] | 3 | 26 | EMPC, imitazione neurale |
| Alejandro H. González [A5006192544] | CONICET | 3 | 24 | EMPC e reti neurali (con Ferramosca) |
| Frank Allgöwer [A5001090900] | Stuttgart [I100066346] | 2 | 91 | Teoria EMPC |
| Robert D. McAllister [A5009355093] | TU Delft [I98358874] | 3 | 10 | Ingredienti terminali, EMPC guidato da policy |
| Vicenç Puig [A5023299508] | CSIC [I134820265] | 3 | 64 | EMPC robusto, LPV |
| Jinfeng Liu [A5100424760] | Alberta [I154425047] | 4 | 44 | Reti neurali ibride + EMPC [W4404845556] |
| Defeng He [A5037196498] | Zhejiang Univ. of Tech. [I55712492] | 12 | 24 | Learning EMPC con costi incogniti [W7127279723] |

## Lista di lettura
- **classic** [W1971804534] (2011): lavoro molto citato su prestazioni medie e stabilità dell'EMPC.
- **classic** [W4206105733] (2018): monografia di riferimento sull'EMPC non lineare.
- **classic** [W2947592369] (2019): EMPC con ensemble di RNN, un esempio precoce di "identificazione neurale + EMPC".
- **recent-impact** [W4401190643] (2024): confronto tra EMPC model-based e data-driven sul benchmark BOPTEST.
- **recent-impact** [W4399070699] (2024): Koopman appreso per un EMPC efficiente.
- **recent-impact** [W4410614250] (2025): Koopman con reti neurali profonde, applicazione di controllo pubblicata su TCST.
- **recent-impact** [W7127279723] (2026): learning EMPC con orizzonte variabile (Automatica).
- **fresh** [W7125285669] (2026): adaptive EMPC con garanzie (ETH, gruppo seguito).
- **fresh** [W7214010484] (2026): imitazione neurale stabile di un EMPC, utile per l'esecuzione embedded.
- **fresh** [W7203947404] (2026): modellazione grey-box + EMPC su un impianto pilota.

## Limiti
- **Persone fuori classifica.** Alcune figure centrali compaiono nei paper (`works.json`) ma non tra gli autori più attivi di `authors.json`: Mario Zanon [A5106707940], Matthias A. Müller [A5057092836] e Alberto Bemporad [A5053340099].
- **Affiliazioni non affidabili.** Ferramosca risulta a Bergamo, ma i lavori più vecchi lo legano a UTN/CONICET (AR), e [W7214010484] non riporta affiliazioni. Chris McCready [A5016570985] non ha un'istituzione. "Ministry of Education" [I1327237609] è un artefatto di affiliazione. Changyin Sun [A5019248683] e Zhao Yang Dong [A5100366084] compaiono con affiliazioni diverse in anni diversi.
- **Campione parziale.** `papers.md` contiene 299 dei 785 lavori. La ricerca è per parole chiave su titolo e abstract, quindi non coincide con l'appartenenza reale al tema.
- **Dati sbilanciati.** I numeri recenti sono piccoli (1-6 lavori per istituto europeo) e il 2026 è parziale, quindi le crescite sono instabili. Il tema è fortemente orientato all'energia: la vicinanza al profilo va verificata caso per caso.
