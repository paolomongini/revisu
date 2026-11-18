# Economic MPC — Research Radar
*Generato il 2026-11-18 da OpenAlex · query: `"economic model predictive control" OR "economic MPC"`*

## In breve
- **Tema maturo, in crescita assoluta ma non relativa:** 785 lavori dal 2000. Nella finestra 2024-2026 ce ne sono 235, contro 185 nel 2021-2023 (x1.27). La quota sulla letteratura di controllo però resta piatta e sotto il picco del 2020.
- **Il traino è l'energia:** Hybrid Renewable Energy Systems [T11007] (x4.199), Microgrid [T10223] (x2.204) e Smart Grid [T10603] (x1.673) crescono. L'EMPC di processo classico [T11053] cala (x0.531).
- **La geografia è dominata dalla Cina:** nella finestra 2024-26 ha 103 lavori, contro 32 degli USA e 13 dell'Italia. In testa c'è North China Electric Power University [I153473198] con 16 lavori recenti.
- **Per il tuo profilo** il filone più vicino è "identificazione neurale/Koopman + EMPC". I riferimenti sono NTU Singapore [I172675005] (Xunyuan Yin [A5032657663]), Bergamo [I11039511] (Antonio Ferramosca [A5072233007]) e TU Delft [I98358874].
- **In Europa** i lavori teorici (dissipatività, stabilità) del campione vengono soprattutto da Stuttgart [I100066346] e IMT Lucca [I127077003]. ETH [I35440088] ha un adaptive EMPC recente [W7125285669].

## Trend
Il tema nasce di fatto nel 2011 (5 lavori) e supera i 30 l'anno nel 2014 (33). Tocca un primo picco nel 2020 (80), poi si assesta: 2021: 59, 2022: 62, 2023: 64, 2024: 55, 2025: 79. Il **2026 è parziale** (dati al 18 novembre) ma conta già 101 lavori, più del 2025.

La quota sulla letteratura di controllo era 0.001784 nel 2020. Nel 2021-23 è stata 0.00135 / 0.001413 / 0.001342 e nel 2024-26 0.001035 / 0.001258 / 0.00142. In media la quota passa da circa 0.00137 (2021-23) a circa 0.00124 (2024-26). L'EMPC quindi cresce in valore assoluto, ma **un po' più lentamente dell'intero settore**. La lieve ripresa del 2026 va confermata a anno chiuso.

## Hot topic
La crescita misura il peso *relativo* di un sottotema dentro l'EMPC: quota nella finestra recente diviso quota nella precedente.

- **Microgrid e rinnovabili ibride.** Comprende [T11007] (16 vs 3, x4.199), [T10223] (28 vs 10, x2.204) e [T10603] (34 vs 16, x1.673). Si tratta di dispatch di PV, accumulo e idrogeno, spesso con EMPC gerarchico o distribuito. Esempi: [W4407238496] e [W4416617166] (EMPC mixed-integer approssimato via imitation learning).
- **Sistemi energetici integrati e rete.** Comprende [T11185] (63 vs 36, x1.378) e [T10424] (23 vs 14, x1.293), con dispatch multi-vettore e load frequency control con EMPC distribuito [W4413277221].
- **Edifici e HVAC.** [T10121] (37 vs 27, x1.079) è un'applicazione matura. Il confronto tra EMPC model-based e data-driven su BOPTEST [W4401190643] è tra i lavori recenti più citati.
- **Teoria.** La keyword *recursive feasibility* cresce (25 vs 16, x1.23). *Closed-loop stability* è stabile (16 vs 13, x0.969). Esempi: [W7125285669] (adaptive EMPC), [W7134825881] (strict dissipativity) e [W7127279723] (learning EMPC a orizzonte variabile).
- **Modelli appresi / Koopman, il filone più vicino ai tuoi interessi.** [T11236] è quasi costante (17 vs 13, x1.029), ma tra i lavori più citati ci sono [W4399070699] (Koopman appreso per il trattamento acque) e [W4410614250] (deep Koopman). La keyword *koopman operator* passa da 0 a 8 lavori: è sotto la soglia di volume, quindi è solo un segnale.
- **In raffreddamento:** Process Optimization [T11053] (31 vs 46, x0.531), Advanced Optimization Algorithms [T10963] (21 vs 26, x0.636) e Stability of Uncertain Systems [T10046] (21 vs 21, x0.787).

## Dove si fa ricerca
- **Paesi, finestra 2024-26** (`countries.json`): Cina 103, Stati Uniti 32, Germania 14, Canada 13, Spagna 13, Italia 13, Regno Unito 12, Australia 11.
- **Istituzioni leader (2024-26):**

| Istituzione | Recenti | Precedenti | Crescita |
|---|---|---|---|
| North China Electric Power University [I153473198] | 16 | 10 | x1.26 |
| Southeast University [I76569877] | 13 | 7 | x1.462 |
| Zhejiang University of Technology [I55712492] | 12 | 3 | x3.149 |
| Baylor University [I157394403] | 10 | 5 | x1.574 |

- **In forte crescita, partendo da numeri piccoli:**
  - University of Waterloo [I151746483]: 6 vs 1, x4.723
  - Technical University of Denmark [I96673099]: 5 vs 1, x3.936
  - Tongji University [I116953780]: 5 vs 1, x3.936
- **In calo:**
  - University of Alberta [I154425047]: 4 vs 10, x0.315
  - Universitat Politècnica de Catalunya [I9617848]: 4 vs 7, x0.45
- **Europa e Italia:**
  - Delft [I98358874]: 6 recenti
  - Stuttgart [I100066346]: 5
  - Imperial College London [I47508984]: 5
  - IMT Lucca [I127077003]: 3 vs 4
  - Politecnico di Milano [I93860229]: 2

## Con chi collaborare
**Gruppi seguiti** (watchlist):
- **ETH Zurich [I35440088].** Ha 2 lavori recenti. Il più vicino al profilo è [W7125285669], un adaptive EMPC con adattamento online del modello, di Melanie N. Zeilinger [A5037513714] e John Lygeros [A5007359599].
- **IMT Lucca [I127077003].** Lavori teorici di Mario Zanon [A5106707940]: [W7134825881], [W4405783908]. Alberto Bemporad [A5053340099] compare in [W4380303849].
- **EPFL [I5124864].** Ha 1 lavoro, [W4417291510], di Colin N. Jones [A5085117832].
- **Assenti:** Pavia, IDSIA, Ferrari-Trecate, Piga e Magni non compaiono in questo tema.

**Gruppi da considerare**, scelti perché uniscono identificazione/modellazione e controllo:
1. **NTU Singapore [I172675005].** Xunyuan Yin [A5032657663] (4 recenti, h-index 28) e Minghao Han [A5057269196] (3 recenti). Lavorano su deep Koopman e reti neurali per l'EMPC: [W4410614250], [W4399070699]. Nei dati è il fit tematico più diretto con il profilo, anche se poggia su pochi paper, ed è extra-europeo.
2. **Università di Bergamo [I11039511].** Antonio Ferramosca [A5072233007] (3 recenti, h-index 26) lavora con Alejandro H. González [A5006192544] (CONICET, AR). Lavori: imitazione neurale stabile di EMPC [W7214010484] e reti ricorrenti dentro l'EMPC [W4403582256]. È il gruppo italiano più vicino al profilo.
3. **TU Delft [I98358874].** Ha 6 lavori recenti su due filoni:
   - Robert D. McAllister [A5009355093] (3 recenti) lavora sugli ingredienti terminali dell'EMPC guidati da una policy [W7207766296].
   - Il gruppo di Bart De Schutter [A5026547410] lavora su MPC approssimato via imitation learning per l'esecuzione real-time [W4416617166].
4. **University of Stuttgart [I100066346].** Ha 5 lavori recenti (x0.984), di taglio teorico:
   - Frank Allgöwer [A5001090900] (2 recenti, h-index 91) firma un lavoro sull'EMPC periodico [W7154484498].
   - Altri autori di Stuttgart firmano un EMPC con dinamiche ibride [W7202119722].

   Utile per dare garanzie a controllori learning-based. Sempre sul versante teorico, Matthias A. Müller [A5057092836] compare in diversi paper del campione.
5. **DTU [I96673099].** Lavora su digital twin grey-box + EMPC [W7203947404].
6. **CSIC [I134820265].** Vicenç Puig [A5023299508] (3 recenti, h-index 64) lavora su EMPC robusto con modelli LPV [W7119531083].
7. **Imperial College London [I47508984].** Modelli ibridi fisica/dati e stima dello stato per l'EMPC [W7124458292].

Fuori dall'Europa sono interessanti anche Jinfeng Liu [A5100424760] (Alberta), che lavora su reti neurali ibride + EMPC [W4404845556], e Defeng He [A5037196498] (Zhejiang Univ. of Tech., 12 recenti), che fa learning EMPC [W7127279723].

## Da leggere
- **Classici**
  - [W1971804534] (2011): prestazioni medie e stabilità dell'EMPC.
  - [W4206105733] (2018): monografia sull'EMPC non lineare.
  - [W2947592369] (2019): EMPC con ensemble di RNN.
- **Recenti ad alto impatto**
  - [W4401190643]: EMPC model-based vs data-driven su BOPTEST.
  - [W4399070699]: Koopman appreso per EMPC.
  - [W4410614250]: deep Koopman + EMPC.
  - [W7127279723]: learning EMPC, Automatica.
- **Freschi (2026)**
  - [W7125285669]: adaptive EMPC, ETH.
  - [W7214010484]: imitazione neurale stabile di EMPC, utile per l'embedded.
  - [W7203947404]: grey-box + EMPC su un impianto pilota.

## Limiti di questa analisi
- **Ricerca per parole chiave su titolo e abstract.** Non equivale all'appartenenza reale al tema. Entra anche rumore: ad esempio [W7125281334] parla di economia "as a service".
- **Il 2026 è parziale,** quindi la finestra recente è sottostimata e la quota 2026 è provvisoria.
- **Piccoli numeri:** crescite come x4.723 o x3.936 poggiano su 1 solo lavoro nella finestra precedente.
- **Affiliazioni e autori OpenAlex poco affidabili.** "Ministry of Education" [I1327237609] è un artefatto. Ferramosca è legato sia a Bergamo sia all'Argentina. Zanon, Müller e Bemporad compaiono nei paper (`works.json`) ma non nella classifica degli autori più attivi (`authors.json`).
- **Campione parziale:** `papers.md` contiene 299 dei 785 lavori. I topic OpenAlex sono grossolani e si sovrappongono (es. [T10791]).
- **Dati non riscaricati:** in questa esecuzione il re-fetch è stato bloccato dai permessi. L'analisi usa i dati scaricati oggi alle 11:16.
