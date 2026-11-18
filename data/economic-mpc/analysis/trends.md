# Trend: Economic MPC

Fonte: OpenAlex, query `"economic model predictive control" OR "economic MPC"` (titolo+abstract), dati generati il 2026-11-18.

## 1. Volume

- Totale 2000-2026: **785** lavori. Il tema nasce di fatto nel 2011 (5 lavori), supera i 30 l'anno nel 2014 (33) e tocca un primo picco nel 2020 (80).
- Finestra recente [2024-2026]: **235** lavori; finestra precedente [2021-2023]: **185**. Crescita del volume **x1.27**.
- Serie recente: 2021: 59, 2022: 62, 2023: 64, 2024: 55, 2025: 79, 2026: 101. Il **2026 è parziale** (dati al 18 novembre, con ritardo di indicizzazione), eppure ha già superato il 2025. Il valore finale sarà quindi più alto.
- **Quota sulla letteratura di controllo** (`share_of_control_literature`): 0.001784 nel 2020, poi 0.00135 / 0.001413 / 0.001342 (2021-23) e 0.001035 / 0.001258 / 0.00142 (2024-26). La quota è sostanzialmente piatta e resta sotto il picco del 2020. In media la quota passa da circa 0.00137 a circa 0.00124: il tema cresce in termini assoluti ma **un po' più lentamente del settore**. Solo il 2026 (0.00142) segnala una lieve ripresa, ancora da confermare a anno chiuso.

## 2. Sotto-temi in crescita

La crescita qui è il rapporto tra la quota del sottotema nella finestra recente e quella nella precedente: misura un peso *relativo* dentro il tema.

**a) Microgrid e sistemi rinnovabili ibridi.** È il traino principale.
- Hybrid Renewable Energy Systems [T11007]: 16 vs 3, **x4.199**
- Microgrid Control and Optimization [T10223]: 28 vs 10, **x2.204**
- Smart Grid Energy Management [T10603]: 34 vs 16, **x1.673**

Si tratta di EMPC per il dispatch di PV, accumulo, idrogeno e carichi, spesso gerarchico o distribuito. Paper rappresentativi: [W4407238496] (microgrid PV-idrogeno con EMPC gerarchico, 36 citazioni), [W4416617166] (EMPC mixed-integer approssimato via imitation learning).

**b) Sistemi energetici integrati e rete elettrica.**
- Integrated Energy Systems Optimization [T11185]: 63 vs 36, **x1.378**
- Electric Power System Optimization [T10424]: 23 vs 14, **x1.293**

Comprende il dispatch multi-vettore (elettricità, calore, idrogeno) e il load frequency control con EMPC distribuito. Paper: [W4413277221] (LFC multi-area con EMPC distribuito a stabilità garantita), [W7140122171] (fresh, IEEE TCST).

**c) Edifici e HVAC.** Building Energy and Comfort Optimization [T10121]: 37 vs 27, **x1.079**. È un'applicazione matura, in crescita lenta. Paper: [W4401190643] (EMPC model-based vs data-driven su BOPTEST, 86 citazioni), [W4410588164] (cluster di edifici + ricarica EV, 35 citazioni).

**d) Teoria: fattibilità e stabilità.**
- Keyword `recursive feasibility`: 25 vs 16, **x1.23**
- Keyword `economic MPC`: 15 vs 11, **x1.074**
- Keyword `closed-loop stability`: 16 vs 13, x0.969 (stabile)

Il filone riguarda la dissipatività, le condizioni terminali e l'EMPC adattivo/stocastico. Paper: [W7125285669] (EMPC adattivo con garanzie, IEEE TAC), [W7134825881] (rilettura della strict dissipativity), [W7127279723] (EMPC learning a orizzonte variabile, Automatica, 16 citazioni).

**e) Modelli appresi / identificazione (vicino ai tuoi interessi).** Control Systems and Identification [T11236]: 17 vs 13, **x1.029**. Il peso relativo è quasi costante, ma il filone Koopman/rete neurale + EMPC è visibile tra i paper più citati: [W4399070699] (Koopman appreso per il trattamento acque, 40 citazioni), [W4410614250] (deep Koopman per carbon capture navale).

La keyword `model predictive control` (42 vs 23, x1.438) è generica. Indica più che altro che i lavori recenti si etichettano come "MPC" generico, non un sottotema vero e proprio.

## 3. In raffreddamento (growth < 0.8)

- Process Optimization and Integration [T11053]: 31 vs 46, **x0.531**. È il calo più netto: l'EMPC "di processo" chimico classico perde peso relativo rispetto all'energia.
- Advanced Optimization Algorithms Research [T10963]: 21 vs 26, **x0.636**
- Stability and Control of Uncertain Systems [T10046]: 21 vs 21, **x0.787**

Sono sotto 1 ma sopra la soglia di 0.8 il topic contenitore Advanced Control Systems Optimization [T10791] (175 vs 158, x0.872) e la keyword `economic model predictive control` (140 vs 129, x0.854).

## 4. Geografia

**Paesi, finestra recente 2024-26** (`countries.json`): Cina 103, Stati Uniti 32, Germania 14, Canada 13, Spagna 13, Italia 13, Regno Unito 12, Australia 11.

**Istituzioni leader nella finestra recente:**
- North China Electric Power University [I153473198]: 16 vs 10, x1.26
- Southeast University [I76569877]: 13 vs 7, x1.462
- Zhejiang University of Technology [I55712492]: 12 vs 3, x3.149
- Baylor University [I157394403]: 10 vs 5, x1.574

**Crescita rapida con volume minimo accettabile:**
- University of Waterloo [I151746483]: 6 vs 1, x4.723
- Tongji University [I116953780]: 5 vs 1, x3.936
- Technical University of Denmark [I96673099]: 5 vs 1, x3.936
- Tsinghua University [I99065089]: 7 vs 2, x2.755

**In calo:**
- University of Alberta [I154425047]: 4 vs 10, x0.315
- Universitat Politècnica de Catalunya [I9617848]: 4 vs 7, x0.45

**Italia ed Europa:** IMT Lucca [I127077003] (3 vs 4, x0.59), Delft [I98358874] (6 vs 4, x1.181) e Stuttgart [I100066346] (5 vs 4, x0.984). Tra gli autori italiani compare Antonio Ferramosca [A5072233007] (Università di Bergamo) con 3 lavori recenti.

## 5. Avvertenze

- **Topic OpenAlex grossolani:** [T10791] è un contenitore generico, e i topic "energia" si sovrappongono tra loro (lo stesso paper può cadere in più categorie).
- **Rumore da keyword:** la query cattura anche lavori fuori tema. Esempio: [W7125281334], sull'economia "Anything as a Service", entra per la stringa "economic model". Inoltre la keyword `model predictive control` è troppo generica.
- **Piccoli numeri:** crescite come x4.723 o x3.936 poggiano su 1 lavoro nella finestra precedente e sono fragili.
- **Affiliazioni e autori:** voci come Ministry of Education of the PRC [I1327237609] o lo State Key Laboratory [I4391767892] sono artefatti di affiliazione e in parte si sovrappongono a università già elencate. La disambiguazione degli autori in OpenAlex può fondere o spezzare profili.
- **2026 parziale:** il volume e la quota del 2026 vanno rivalutati a anno chiuso. Anche la finestra recente è quindi leggermente sottostimata.
