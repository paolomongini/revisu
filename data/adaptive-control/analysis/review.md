# Review: Adaptive Control

File verificati: `report.md`, `analysis/trends.md`, `analysis/collaborators.md`, confrontati con `meta.json`, `trend.json`, `keywords.json`, `topics.json`, `institutions.json`, `countries.json`, `authors.json`, `works.json`, `papers.md`.

## 1. ID check
`python scripts/radar.py check adaptive-control`: 214 id citati in 3 file, **nessun id sconosciuto**.

## 2. Verifica dei numeri

| Affermazione | file:riga | Valore nei dati | Verdetto |
|---|---|---|---|
| 22768 lavori; 5033 contro 3931, ×1.28 | report.md:5,12; trends.md:5,7 | meta.json: total 22768, n_recent 5033, n_prev 3931, volume_growth 1.28 | OK |
| Per anno 2021–2026: 1233/1335/1363/1435/1659/1939 | report.md:12; trends.md:8 | trend.json: stessi valori | OK |
| Quota 2022 0.030724 (picco), 2024 0.027053, 2026 0.026887 | report.md:5,14; trends.md:9 | trend.json: stessi valori | OK |
| predefined-time 96 contro 13 ×5.768; prescribed-time 63 contro 9 ×5.467 | report.md:19; trends.md:15 | keywords.json: stessi valori | OK |
| RL 112 contro 28 ×3.124; [T12794] 169 contro 89 ×1.483; [T10462] 134 contro 58 ×1.804 | report.md:20; trends.md:17 | keywords.json / topics.json: stessi valori | OK |
| CBF 34 contro 0; MPC 86 contro 31 ×2.167; [T10791] 221 contro 98 ×1.761 | report.md:21; trends.md:19 | stessi valori | OK |
| adaptive fuzzy control 331 contro 326 ×0.793; [T10820] 243 contro 274 ×0.693; [T10244] ×0.72; [T11082] ×0.734; Nussbaum ×0.719 | report.md:7,25; trends.md:30-31 | keywords.json / topics.json: stessi valori | OK |
| CN 2708, US 310, IN 283, IR 172, SA 133, GB 125, IT 69 (14° posto) | report.md:8,28; trends.md:37 | countries.json: stessi valori; IT 14ª | OK |
| Harbin [I204983213] 112 contro 96, ×0.911; CNRS 40 contro 26 ×1.202 | report.md:8,29,66; trends.md:38,46 | institutions.json: stessi valori | OK |
| KTH 12 contro 2 ×4.686; Imperial 14 contro 4 ×2.734; NTNU 10 contro 7 ×1.116; PoliMi 12 contro 14 ×0.669 | report.md:31; collaborators.md:6,16,17,20 | institutions.json: stessi valori | OK |
| ETH 2/2, IDSIA 1/1, EPFL 0/2, Pavia 0/4 | collaborators.md:7-10 | institutions.json: stessi valori | OK |
| "In crescita più rapida (con volume sufficiente)": Xi'an ×2.059 in testa, poi Shanghai ×1.822, Yanshan ×1.358, NTU ×1.328 | report.md:30; trends.md:39 | institutions.json: tutte le voci hanno `eligible: true` (anche EPFL 0 contro 2). Più alte di Xi'an: Jouf University [I199702508] 26 contro 2 ×10.154, CUHK [I177725633] ×9.373, KTH ×4.686, Shandong Jiaotong [I4210099312] ×3.905, Imperial ×2.734, Lanzhou UT [I22716506] ×2.734, Embry–Riddle [I84475105] 23 contro 7 ×2.566, Wuhan UT [I196699116] ×2.232. Il report omette anche Tiangong [I198091727] ×1.846, Central South ×1.562 e Tongji [I116953780] ×1.367, tutte sopra Yanshan | **WRONG** (contraddice anche report.md:31) |
| Autori più attivi: Wang 33, Hua 26, Zhao 24, Hou e Chen 20 | report.md:32 | authors.json: il n. 2 è Mohamed Kharrat [A5107740763] (University of Sfax, TN) con 28, omesso | **WRONG** (elenco incompleto e presentato come classifica) |
| "Fuori dalla Cina: Krstić e Dixon, 10 ciascuno" | report.md:32 | authors.json: Kharrat (TN) 28, Jinde Cao [A5017808266] (BH) 17, Evald [A5006158794] (BR) 15, Mobayen [A5068858971] (AZ) 15, K. Merve Dogan [A5027299639] (US) 12, Treesatayapun (MX) 12, Alhazmi (SA) 12. Anche fra gli autori statunitensi Dogan (12) supera Krstić e Dixon | **WRONG** |
| Hou h-index 71, Dixon h-index 70, 20 e 10 lavori recenti | collaborators.md:33-34 | authors.json: stessi valori | OK |
| h-index n.d. per gli autori europei | collaborators.md:26-32 | nessuno di questi autori è in authors.json | OK |
| [W4403975521] 2024, 83 citazioni, Morato e Spinola Felix, Grenoble INP | collaborators.md:14 | papers.md:899-901 | OK |
| [W4229014698] 2022, 462 citazioni, Guanya Shi, Caltech | collaborators.md:21 | papers.md:1283-1285 | OK |
| Campione di 329 paper | report.md:68; collaborators.md:52 | digest.md:154 | OK |

## 3. Attribuzioni dei paper (autore / istituzione / anno)
Tutte corrette: [W7155387743] Efimov, CNRS, 2026; [W3043310534] Foss e Knudsen (NTNU), Jones (EPFL), 2020; [W7160820507] Fagiolini, Palermo, 2026; [W4380986230] Cucuzzella e Machado, Groningen, 2023; [W2142428281] Astolfi, Imperial, 2003; [W3211963501] Hutter, ETH, 2021; [W4392406158] Hutter, ETH, 2024; [W4366153247] Lovera, PoliMi, 2022; [W4416442515] Jalaeian-F., PoliMi, 2025 (LSTM + actor-critic presenti nell'abstract); [W4393180309] Sant'Anna, 2024; [W7203973387] Roveda, SUPSI, 2026; [W4414982891] / [W7124927853] Karimi, PoliMi; [W7117582391] Dixon, UF; [W2914108621] Hou, 2019; [W4401696411] Automatica. Gli id di Karimi corrispondono a due profili distinti in works.json. Qianwen Xu [A5038817226] è l'unico autore KTH in works.json.

Imprecisioni minori:
- collaborators.md:28: per Karimi il tema "osservatori neurali" vale solo per [W4414982891]; [W7124927853] usa un disturbance observer, non neurale.
- report.md:60 e collaborators.md:45: "confrontato con MPC e CBF". L'abstract di [W7124463516] (papers.md:46) **contrappone** l'approccio a MPC/CBF; non dice che ci sia un confronto sperimentale.
- collaborators.md:50: definire "affiliazioni non aggiornate" il caso di Hongyi Xie (HIT nel 2022, PoliMi nel 2025) non è supportato dai dati. È coerente con un trasferimento, non con un errore.

## 4. Affermazioni che vanno oltre i dati (overclaim)
1. report.md:30 / trends.md:39: "con volume sufficiente". In institutions.json il flag `eligible` è `true` per tutte le voci, quindi nessun filtro di volume distingue la lista. La selezione è stata fatta solo tra le prime 40 istituzioni del digest.
2. trends.md:40: "Sono storici centri del filone adaptive fuzzy/NN". La storicità non è nei dati, che coprono solo il volume nella finestra precedente (97 e 65). Il giudizio viene dalla memoria del modello.
3. report.md:9 / collaborators.md:14: "il contatto più promettente è Grenoble INP". Si basa su un solo paper con due autori, e il volume dell'istituzione non è nei dati. Va presentato come ipotesi, non come conclusione.
4. report.md:43,46 / collaborators.md:16-17: NTNU e Imperial sono proposti come "nuovi gruppi" sulla base di paper del 2020 ([W3043310534], sulla tolleranza ai guasti dei sensori) e del 2003 ([W2142428281]). Non mostrano un'attività recente delle persone citate. Va detto esplicitamente.
5. report.md:14 / trends.md:11: "si riorganizza al suo interno" è un'interpretazione accettabile, ma resta tale. Nessuna spiegazione causale indebita.

## 5. Avvertenze e anno parziale
- La sezione dei limiti è presente in tutti e tre i file (report.md:63-69, trends.md:42-47, collaborators.md:48-53).
- Il 2026 è segnalato come parziale ovunque. Manca però una nota: la finestra recente [2024–2026] include l'anno parziale, quindi ×1.28 e le crescite per keyword o istituzione sono calcolate su una finestra incompleta.
- report.md:28 / trends.md:37: non è indicata la finestra temporale dei conteggi per paese.

## VERDICT: FIX NEEDED
Correzioni necessarie:
1. **report.md:30 e trends.md:39**: riscrivere "In crescita più rapida" partendo da institutions.json ordinato per crescita. Per esempio, con almeno 20 lavori recenti: Jouf University [I199702508] 26 contro 2 ×10.154; Embry–Riddle [I84475105] 23 contro 7 ×2.566; Wuhan University of Technology [I196699116] 20 contro 7 ×2.232; Xi'an Jiaotong ×2.059. Indicare la soglia usata ed eliminare "con volume sufficiente" (il flag `eligible` è sempre true). Includere Tiangong ×1.846, Central South ×1.562 e Tongji ×1.367 se si tiene la lista attuale.
2. **report.md:32**: inserire Mohamed Kharrat [A5107740763] (University of Sfax, TN), 28 lavori, al 2° posto. Sostituire "Fuori dalla Cina: Krstić e Dixon" con i dati reali: Kharrat 28 (TN), Jinde Cao [A5017808266] 17 (BH), Evald [A5006158794] 15 (BR), Mobayen [A5068858971] 15 (AZ), K. Merve Dogan [A5027299639] 12 (US). Krstić e Dixon (10) si possono citare come "noti nomi statunitensi", non come i più attivi fuori dalla Cina.
3. **trends.md:40**: togliere "storici centri", oppure riformularlo come "erano tra i più attivi nella finestra 2021–2023 (97 e 65 lavori)".
4. **report.md:9 e collaborators.md:14**: attenuare "il contatto più promettente" in "il lavoro più vicino al profilo nel campione (un solo paper)".
5. **report.md:43,46 e collaborators.md:16-17**: indicare che NTNU e Imperial sono suggeriti sulla base di paper del 2020 e del 2003, e che un'attività recente delle persone non risulta nei dati.
6. **report.md:60 e collaborators.md:45**: sostituire "confrontato con MPC e CBF" con "contrapposto ad approcci MPC/CBF".
7. **collaborators.md:28**: correggere il tema di Karimi ("osservatori di disturbo, anche neurali").
8. **collaborators.md:50**: riformulare il caso di Hongyi Xie come "cambio di affiliazione (HIT 2022, PoliMi 2025)", non come errore.
9. **report.md, sezione Limiti**: aggiungere che la finestra recente include il 2026 parziale e che quindi le crescite sono calcolate su dati incompleti.
