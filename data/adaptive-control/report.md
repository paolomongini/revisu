# Adaptive Control — Revisu
*Generato il 2026-11-25 da OpenAlex · query: `"model reference adaptive control" OR "adaptive controller" OR "adaptive backstepping" OR "L1 adaptive control" OR "adaptive sliding mode control" OR "adaptive neural network control" OR "adaptive fuzzy control" OR "indirect adaptive control" OR "direct adaptive control" OR ("adaptive control" AND (Lyapunov OR "parameter estimation" OR "persistent excitation" OR "tracking error"))`*

## In breve
- **Filone maturo, non in boom:** 5033 lavori nel 2024–2026 contro 3931 nel 2021–2023 (×1.28), ma la quota sulla letteratura di controllo è piatta (0.027053 nel 2024, 0.026887 nel 2026) e sotto il picco del 2022 (0.030724). Cresce al passo del settore.
- **Dove si sposta il fronte:** convergenza a tempo predefinito/prescritto (×5.768 / ×5.467), reinforcement learning (×3.124) e programmazione dinamica adattiva [T12794], MPC (×2.167) e control barrier functions (34 contro 0).
- **In raffreddamento** lo schema classico "backstepping + approssimatore fuzzy/NN": adaptive fuzzy control ×0.793, Fuzzy Logic and Control Systems [T10820] ×0.693.
- **Geografia fortemente sbilanciata:** nel 2024–2026 Cina 2708 lavori, Stati Uniti 310, Italia 69. Le prime istituzioni sono tutte cinesi (Harbin Institute of Technology [I204983213]: 112 recenti); in Europa spicca CNRS [I1294671590] (40 contro 26).
- **Per un profilo MPC/identificazione** il lavoro più vicino nel campione (un solo paper) è di Grenoble INP [I106785703] (survey MPC + data-driven + adattivo [W4403975521]); in Italia, Politecnico di Milano [I93860229] (12 recenti) e Università di Palermo [I900890020] (adattivo + physics-informed [W7160820507]).

## Trend
Totale 2000–2026: **22768** lavori. Per anno: 2021: 1233, 2022: 1335, 2023: 1363, 2024: 1435, 2025: 1659, 2026: 1939 (anno **parziale**, già sopra il 2025).

I conteggi assoluti crescono, ma la quota sul controllo è stabile intorno a 0.027 (2021: 0.028511, 2022: 0.030724, 2023: 0.028672, 2024: 0.027053, 2025: 0.026587, 2026: 0.026887). Il controllo adattivo segue la crescita generale della letteratura di controllo senza superarla: è un'area consolidata che si riorganizza al suo interno.

*Nota metodologica:* la query iniziale, la sola frase `"adaptive control"`, dal 2025 raccoglieva molti lavori AI/Industria 4.0 che citano il termine di passaggio; per questo è stata ristretta ai nomi dei metodi (vedi query sopra).

## Hot topic
- **Convergenza a tempo predefinito/prescritto.** predefined-time control: 96 contro 13 (×5.768); prescribed-time control: 63 contro 9 (×5.467). Tempo di assestamento fissato a priori, indipendente dalle condizioni iniziali. Esempi: [W7162257503], [W4392309386], [W7168247452].
- **Reinforcement learning / ADP.** reinforcement learning 112 contro 28 (×3.124); deep RL 48 contro 17 (×2.205); DDPG 30 contro 10 (×2.343). Topic Reinforcement Learning in Robotics [T10462] 134 contro 58 (×1.804) e Adaptive Dynamic Programming Control [T12794] 169 contro 89 (×1.483). Esempi: [W4414958232], [W4393180309] (Scuola Superiore Sant'Anna).
- **MPC e vincoli di sicurezza (CBF).** model predictive control 86 contro 31 (×2.167); control barrier functions 34 contro 0; topic Advanced Control Systems Optimization [T10791] 221 contro 98 (×1.761). È il tema più vicino al profilo MPC. Esempi: [W4403975521], [W7225201693] (MRAC sicuro con CBF), [W7134038817].
- **Controllo resiliente ad attacchi cyber.** denial-of-service attacks 62 contro 23 (×2.105); cyber-physical security 35 contro 12 (×2.278). Esempi: [W4401696411], [W4394564138].
- **Energia e reti.** renewable energy integration 50 contro 15 (×2.603); Smart Grid Security and Resilience [T10917] 80 contro 45 (×1.389). Esempio: [W4392180680].
- **Soluzioni implementabili.** adaptive PID control 32 contro 9 (×2.777); real-time control 42 contro 14 (×2.343); actuator saturation 103 contro 51 (×1.577). Esempio: [W7117451051].
- **In calo relativo:** Nussbaum function ×0.719, state constraints ×0.751, Chaos control and synchronization [T10244] ×0.72, Spacecraft Dynamics and Control [T11082] ×0.734.

## Dove si fa ricerca
- **Paesi** (finestra recente 2024–2026, come nelle altre esecuzioni di Revisu): CN 2708, US 310, IN 283, IR 172, SA 133, GB 125, … IT 69 (14° posto).
- **Istituzioni principali** (recenti contro precedenti): Harbin Institute of Technology [I204983213] 112 contro 96; Northeastern University [I9224756] 106 contro 113; Southeast University [I76569877] 87 contro 86; Beihang [I82880672] 86 contro 87.
- **In crescita più rapida** (soglia scelta qui: almeno 20 lavori recenti): Jouf University [I199702508] 26 contro 2 (×10.154); Embry–Riddle Aeronautical University [I84475105] 23 contro 7 (×2.566); Wuhan University of Technology [I196699116] 20 contro 7 (×2.232); Xi'an Jiaotong [I87445476] 29 contro 11 (×2.059); Tiangong University [I198091727] 26 contro 11 (×1.846); Shanghai University [I113940042] 28 contro 12 (×1.822). Con volumi minori crescono molto anche Chinese University of Hong Kong [I177725633] (12 contro 1) e KTH [I86987016] (12 contro 2).
- **Europa:** CNRS [I1294671590] 40 contro 26 (×1.202); Imperial College London [I47508984] 14 contro 4 (×2.734); KTH [I86987016] 12 contro 2 (×4.686); NTNU [I204778367] 10 contro 7 (×1.116); Politecnico di Milano [I93860229] 12 contro 14 (×0.669).
- **Autori più attivi** (finestra recente): Huanqing Wang [A5016803642] 33 lavori, Mohamed Kharrat [A5107740763] (University of Sfax, TN) 28, Changchun Hua [A5100380201] 26, Xudong Zhao [A5083349103] 24, Zhongsheng Hou [A5082706113] e C. L. Philip Chen [A5100643265] 20 ciascuno. Fuori dalla Cina: Kharrat 28, Jinde Cao [A5017808266] (BH) 17, Paulo Jefferson Dias de Oliveira Evald [A5006158794] (BR) 15, Saleh Mobayen [A5068858971] (AZ) 15, K. Merve Dogan [A5027299639] (US) 12; Miroslav Krstić [A5018293076] e Warren E. Dixon [A5032651215] (US) 10 ciascuno.

## Con chi collaborare
**Gruppi seguiti (watchlist).** Il tema li intercetta poco, perché la query è centrata sull'adattivo classico e non sull'MPC:
- Politecnico di Milano [I93860229] è l'unico ben presente: Marco Lovera [A5047408261] (MRAC per UAV [W4366153247]) e Mohsen Jalaeian-F. [A5066851566] (LSTM + RL actor-critic [W4416442515]), molto vicino al profilo.
- ETH Zurich [I35440088] (2 recenti): Marco Hutter [A5044258783], Adaptive CLF-MPC [W3211963501].
- IDSIA [I2614128279] (1 recente), EPFL [I5124864] e Pavia [I25217355] (0 recenti). IMT Lucca non compare nei dati.

**Nuovi gruppi suggeriti (prima l'Europa):**
1. **Grenoble INP [I106785703]**: Marcelo Menezes Morato [A5013734641], survey che collega MPC, data-driven, RL e adattivo [W4403975521]. È il lavoro più vicino al profilo nel campione, ma è un solo paper e il volume dell'istituzione non è nei dati.
2. **CNRS [I1294671590]**: Denis V. Efimov [A5039416214], MRAC a tempo fisso senza persistenza di eccitazione [W7155387743]: stima dei parametri e controllo.
3. **NTNU [I204778367]**: Bjarne A. Foss [A5077762571], NMPC con stima dei parametri [W3043310534]: identificazione e MPC insieme. Attenzione: il paper è del 2020, nel campione non c'è attività recente di questi autori.
4. **Università di Palermo [I900890020]**: Adriano Fagiolini [A5070192940], adattivo con rete physics-informed e Lyapunov appreso [W7160820507]. In Italia.
5. **University of Groningen [I169381384]**: Michele Cucuzzella [A5039988381], stima online dei parametri in microreti DC [W4380986230].
6. **Imperial College London [I47508984]**: Alessandro Astolfi [A5072148331], riferimento teorico per l'adattivo non lineare [W2142428281]; il paper è del 2003, quindi il suggerimento si basa sulla reputazione teorica, non su attività recente nel campione (l'istituzione ha comunque 14 lavori recenti contro 4).
7. **Fuori Europa:** Caltech [I122411786], Guanya Shi [A5029314167] (Neural-Fly [W4229014698]); per il ponte con il data-driven, Zhongsheng Hou [A5082706113] (model-free adaptive control).

KTH [I86987016] ha la crescita europea più alta ma nel campione compare un solo autore (Qianwen Xu [A5038817226]): da verificare prima di un contatto.

## Da leggere
- [W2142428281] (2003, classico): immersion and invariance per l'adattivo non lineare.
- [W2914108621] (2019, classico): model-free adaptive control, ponte verso il data-driven.
- [W4229014698] (2022): Neural-Fly, adattamento online con rappresentazioni neurali apprese.
- [W4403975521] (2024): survey data science + MPC, con lettura adattiva.
- [W4412663119] (2025): sliding mode basato su RNN, reti ricorrenti nell'anello di controllo.
- [W4406046946] (2025): L1 adaptive come augmentation di un controllore nominale.
- [W3211963501] (2021): Adaptive CLF-MPC, integrazione diretta adattivo–MPC.
- [W7118624428] (2026): identificazione e MRAC con reti neurali.
- [W7124463516] (2026): MRAC con vincoli su stati e ingressi, contrapposto (non confrontato sperimentalmente) a MPC e CBF.
- [W7160820507] (2026): Lyapunov appreso e PINN per la dinamica non modellata.

## Limiti di questa analisi
- **Query per parole chiave ≠ appartenenza al tema.** La ricerca è su titolo e abstract; la query ristretta perde i lavori che usano solo la frase generica e può includere lavori applicativi marginali.
- **Topic OpenAlex rumorosi:** Topic Modeling [T10028] (21 contro 0) è quasi certamente un'etichettatura errata e va ignorato; Stroke Rehabilitation [T10510] e Epidemiology Models [T10482] sono nicchie marginali. Alcune keyword (p.es. "Padé approximants") sono rumore di estrazione, e salti da zero come le CBF (34 contro 0) possono riflettere il vocabolario delle keyword più che un tema nuovo.
- **La crescita per istituzione è relativa alla quota:** Harbin ha più lavori (112 contro 96) ma risulta ×0.911.
- **Disambiguazione autori:** Hamid Reza Karimi ha due ID distinti ([A5090855504], [A5123310289]); alcune affiliazioni sono datate (Loris Roveda [A5086291668] risulta a SUPSI e non a IDSIA). Gli h-index dei ricercatori europei non sono disponibili.
- **Campione:** i paper analizzati nel dettaglio sono 329; il 2026 è parziale (conteggi e citazioni incompleti).
- **Finestra recente incompleta:** la finestra 2024–2026 include il 2026 parziale, quindi tutte le crescite (recente contro precedente) sono calcolate su dati non definitivi.
- **Copertura OpenAlex** non uniforme, in particolare per atti di convegno.
