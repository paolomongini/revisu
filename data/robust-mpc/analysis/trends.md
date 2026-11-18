# Trend: Robust & Stochastic MPC

*Fonte: OpenAlex, dati estratti il 2026-11-18 alle 11:16. Finestra recente 2024–2026, precedente 2021–2023.*

## 1. Volume

Dal 2000 al 2026 ci sono **2551** lavori. Nella finestra recente sono **934**, contro **577** nella precedente: crescita del volume **x1.619**. La serie annuale è quasi monotona: 178 (2021), 193 (2022), 206 (2023), 214 (2024), poi un salto a 314 (2025) e 406 (2026, anno parziale).

Il tema cresce **più del campo**. La quota sulla letteratura di controllo passa da 0.004073 (2021) a 0.005 (2025) e a 0.00571 (2026). Non è una crescita lineare: la quota cala già nel 2023 (0.004399 → 0.004321), tocca il minimo nel 2024 (0.004029), poi riparte. Nel 2026 sia il conteggio assoluto sia la quota sono in crescita, ma il dato va letto con le cautele della sezione 5.

## 2. Sotto-temi in crescita

La crescita è il rapporto tra quote, quindi è già normalizzata sul volume del tema: x1 significa "cresce quanto il robust/stochastic MPC nel suo insieme".

**a) Koopman e MPC data-driven.** È il segnale più forte: `koopman-operator` 27 vs 4, **x4.17**; `data-driven-control` 28 vs 14, x1.236. Si usano modelli lineari (o bilineari) nello spazio "sollevato" di Koopman per ottenere MPC robusti o stocastici di sistemi non lineari sconosciuti. Riferimenti: [W4205769419] (classic, Automatica 2022, con autori di Politecnico di Milano e TU Delft), [W4399345172] (recent-impact, tube zonotopico per veicoli), [W7171653312] (fresh, Koopman bilineare con contraction metrics).

**b) Tube MPC e constraint tightening.** `tube-mpc` 26 vs 6, **x2.677**; `tube-based-model-predictive-control` 101 vs 41, x1.522; `constraint-tightening` 44 vs 20, x1.359. È il nucleo metodologico del robust MPC: un controllore nominale più un feedback ausiliario che tiene lo stato in un insieme invariante. Riferimenti: [W7165650547] (recent-impact, tube MPC event-triggered con garanzie ISS), [W7162296935] (recent-impact, tube MPC fuzzy per la stabilità del veicolo).

**c) Learning e quantificazione dell'incertezza.** `gaussian-process-regression` 15 vs 5, x1.853; `uncertainty-quantification` 23 vs 8, x1.776; `model-discrepancy` (model mismatch) 24 vs 10, x1.483. L'idea è stimare dai dati il modello o il suo errore, insieme a un'incertezza da passare all'MPC stocastico. Riferimenti: [W7134199088] (fresh, fattibilità ricorsiva di SMPC con dinamica GP, FAU Erlangen), [W4409414969] (recent-impact, SMPC basato su GP per serre).

**d) Osservatori e stima dei disturbi.** `extended-state-observer` 15 vs 3, **x3.089**; `disturbance-estimation` 20 vs 7, x1.765; `state-estimation` 24 vs 9, x1.647. Il robust MPC viene combinato con ESO e osservatori di disturbo, soprattutto nei drive elettrici e nella meccatronica. Riferimento: [W4408100214] (recent-impact, IPMSM sensorless con EKF-LESO).

**e) Tracking e tempo reale.** `trajectory-tracking` 88 vs 23, **x2.364**; `real-time-control` 40 vs 14, x1.765; `computational-efficiency` 21 vs 9, x1.441. L'attenzione si sposta verso implementazioni veloci per robotica e veicoli. Riferimento: [W7119812754] (fresh, robust MPC event-triggered per quadrotori).

**f) Domini applicativi (topic OpenAlex).**
- [T11701] Space Satellite Systems: 21 vs 5, x2.595
- [T11007] Hybrid Renewable Energy Systems: 21 vs 5, x2.595
- [T11192] Underwater Vehicles: 24 vs 7, x2.118
- [T11082] Spacecraft Dynamics: 33 vs 12, x1.699
- [T11615] Mobile Robots: 127 vs 49, x1.601

Riferimenti: [W4416970250] (fresh, deep Koopman per l'assetto di spacecraft), [W7147619752] (fresh, manipolatori subacquei).

## 3. In raffreddamento

*(Corretto dopo la review: il digest elenca solo 25 topic, la lista completa è in `topics.json`.)* Topic eleggibili con crescita < 0.8:
- [T10046] Stability and Control of Uncertain Systems: 220 vs 180, x0.755
- [T10228] Multilevel Inverters and Converters: 27 vs 24, x0.695
- [T10963] Advanced Optimization Algorithms Research: 61 vs 57, x0.661
- [T10524] Traffic control and management: 51 vs 48, x0.656
- [T10768] Electric Vehicles and Infrastructure: 20 vs 19, x0.65
- [T10223] Microgrid Control and Optimization: 50 vs 48, x0.644
- [T10603] Smart Grid Energy Management: 34 vs 34, x0.618
- [T10808] Electric and Hybrid Vehicle Technologies: 27 vs 21, x0.794

Altri topic hanno una quota in calo ma restano sopra la soglia:
- [T10121] Building Energy: x0.831
- [T11081] Advanced Control Systems Design: x0.88
- [T12794] Adaptive Dynamic Programming: x0.883

## 4. Geografia

**Paesi** (`countries.json`): Cina 454, USA 95, Germania 65, Regno Unito 53, Italia 36.

**Istituzioni con più lavori recenti:** [I24185976] Sichuan University (25, x3.089), [I204983213] Harbin Institute of Technology (24, x1.853), [I99065089] Tsinghua (24, x1.141), [I125839683] Beijing Institute of Technology (24, x0.645).

**Crescita più rapida con almeno 10 lavori recenti:**
- [I148128674] University of Shanghai for Science and Technology: 15 vs 2, x4.633
- [I24185976] Sichuan University: 25 vs 5, x3.089
- [I116953780] Tongji: 17 vs 4, x2.626
- [I172675005] NTU Singapore: 16 vs 4, x2.471
- [I90610280] South China Univ. of Technology: 12 vs 3, x2.471

La crescita di Sichuan è molto concentrata: Bin Li [A5100365238] firma da solo 12 lavori recenti.

**Europa.** [I98358874] TU Delft cresce (15 vs 6, x1.544). I gruppi storici invece perdono quota:
- [I35440088] ETH Zurich: 11 vs 16, x0.425
- [I79238269] Universidad de Sevilla: x0.68
- [I47508984] Imperial College: x0.824

In Italia c'è [I127077003] IMT Lucca (7 vs 4, x1.081).

## 5. Limiti

- **Anomalia 2026.** Il 2026 conta 406 lavori contro 314 del 2025, pur essendo parziale: i dati si fermano al 18 novembre e l'indicizzazione di fine anno è incompleta. Il dato non spiega la causa e non si può verificare qui. Ipotesi plausibili:
  - articoli online-first o early-access datati con l'anno del fascicolo;
  - preprint arXiv inclusi nella ricerca;
  - cambiamenti nella copertura degli abstract in OpenAlex.

  Anche la quota sale (0.00571), il che fa pensare a un aumento specifico del tema e non solo a un effetto di indicizzazione dell'intero database. Però anche il denominatore è parziale. Per questo la crescita x1.619 va presa come un ordine di grandezza, non come un valore esatto.
- **Topic OpenAlex grossolani.** [T10791] Advanced Control Systems Optimization raccoglie 736 dei 934 lavori recenti, quindi non distingue tra i sotto-temi.
- **Keyword circolari o rumorose.** `tube-mpc` e `tube-based-model-predictive-control` sono quasi termini della query stessa. Termini come `error-propagation` sono generici.
- **Numeri piccoli.** Crescite come x5.56 ([I14243506] PolyU, [I4575257] Hanyang: 9 vs 1) partono da basi minime e possono essere rumore.
- **Risultati fuori tema.** La ricerca testuale include lavori marginali, ad esempio [W7158082043] (SMPC applicato alla "big data predictive analysis").
- **Istituzioni sovrapposte.** [I4405256045] Institute for Dynamic Systems and Control potrebbe sovrapporsi a ETH Zurich nella gerarchia OpenAlex.
- **Countries.json** non indica la finestra temporale dei conteggi.
