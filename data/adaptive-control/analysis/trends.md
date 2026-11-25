# Trend – Adaptive Control

## 1. Volume

Query basata sui nomi dei metodi (MRAC, adaptive backstepping, L1, adaptive sliding mode/neural/fuzzy, ecc.): la frase generica "adaptive control" da sola dal 2025 tirava dentro molti paper AI/Industria 4.0 fuori tema. Totale 2000–2026: **22768** lavori.

- Finestra recente [2024–2026]: **5033**; finestra precedente [2021–2023]: **3931**; crescita ×**1.28**.
- Per anno: 2021: 1233, 2022: 1335, 2023: 1363, 2024: 1435, 2025: 1659, 2026: 1939 (2026 è **parziale**, eppure supera già il 2025).
- **Quota della letteratura di controllo**: 2021: 0.028511, 2022: 0.030724 (picco), 2023: 0.028672, 2024: 0.027053, 2025: 0.026587, 2026: 0.026887.

In sintesi: i conteggi assoluti crescono, ma la quota è **piatta intorno a 0.027** e leggermente sotto il picco del 2022. Il controllo adattivo cresce **al passo del settore, non più velocemente**. Non è un campo "in boom": è un filone maturo e stabile che si sta riorganizzando al suo interno.

## 2. Sotto-temi in crescita

**a) Convergenza a tempo predefinito/prescritto.** predefined-time control: 96 vs 13, ×5.768; prescribed-time control: 63 vs 9, ×5.467. Sono leggi adattive con tempo di assestamento fissato a priori dal progettista, indipendente dalle condizioni iniziali. Papers: [W7162257503] (2026, recent-impact), [W4392309386], [W7168247452] (fresh).

**b) Reinforcement learning / programmazione dinamica adattiva.** reinforcement learning: 112 vs 28, ×3.124; deep reinforcement learning: 48 vs 17, ×2.205; DDPG: 30 vs 10, ×2.343. Topic: Reinforcement Learning in Robotics [T10462] 134 vs 58, ×1.804; Adaptive Dynamic Programming Control [T12794] 169 vs 89, ×1.483. Qui la stima dei parametri viene sostituita o affiancata da politiche apprese (actor-critic). Papers: [W4414958232]; [W4393180309] (Scuola Superiore Sant'Anna, IT).

**c) MPC e sicurezza con vincoli (CBF).** model predictive control: 86 vs 31, ×2.167; control barrier functions: 34 vs 0 (crescita non definita). Topic Advanced Control Systems Optimization [T10791]: 221 vs 98, ×1.761. Lo scopo è combinare l'adattamento con garanzie sui vincoli di stato e di ingresso. È il tema più vicino agli interessi MPC del lettore. Papers: [W4403975521] (rassegna data-driven/MPC, recent-impact), [W7225201693] (MRAC sicuro con CBF, fresh), [W7134038817].

**d) Controllo resiliente sotto attacchi cyber.** denial-of-service attacks: 62 vs 23, ×2.105; cyber-physical security: 35 vs 12, ×2.278; deception attacks: 44 vs 23, ×1.494. Riguarda il controllo adattivo/fuzzy di sistemi multi-agente con DoS o false data injection. Papers: [W4401696411] (Automatica), [W4394564138].

**e) Energia e reti.** renewable energy integration: 50 vs 15, ×2.603; energy efficiency: 44 vs 15, ×2.291; Smart Grid Security and Resilience [T10917]: 80 vs 45, ×1.389. Paper: [W4392180680] (VSG adattivo con RL in microreti).

**f) Soluzioni pratiche e implementabili.** adaptive PID control: 32 vs 9, ×2.777; real-time control: 42 vs 14, ×2.343; actuator saturation: 103 vs 51, ×1.577. Paper: [W7117451051].

## 3. In raffreddamento (crescita < 0.8)

Questi temi hanno conteggi quasi costanti mentre il corpus cresce di ×1.28, quindi la loro quota relativa scende:
- adaptive fuzzy control 331 vs 326, ×0.793; Nussbaum function 58 vs 63, ×0.719; actuator faults 177 vs 178, ×0.777; state constraints 99 vs 103, ×0.751; neural network approximation 44 vs 48, ×0.716.
- Topic: Chaos control and synchronization [T10244] 410 vs 445, ×0.72; Fuzzy Logic and Control Systems [T10820] 243 vs 274, ×0.693; Neural Networks Stability and Synchronization [T11347] 558 vs 552, ×0.79; Spacecraft Dynamics and Control [T11082] 125 vs 133, ×0.734.

Il classico schema "backstepping + approssimatore fuzzy/NN" resta molto voluminoso, ma non è più il fronte in crescita.

## 4. Geografia

- **Paesi** (`countries.json`): CN 2708, US 310, IN 283, IR 172, SA 133, GB 125. L'Italia ha 69. Il dominio cinese è netto.
- **Istituzioni principali** (recenti vs precedenti): Harbin Institute of Technology [I204983213] 112 vs 96; Northeastern University [I9224756] 106 vs 113; Southeast University [I76569877] 87 vs 86; Beihang [I82880672] 86 vs 87. In Europa: CNRS [I1294671590] 40 vs 26, ×1.202.
- **Le istituzioni che crescono di più** (soglia: almeno 20 lavori recenti): Jouf University [I199702508] 26 vs 2, ×10.154; Embry–Riddle Aeronautical University [I84475105] 23 vs 7, ×2.566; Wuhan University of Technology [I196699116] 20 vs 7, ×2.232; Xi'an Jiaotong [I87445476] 29 vs 11, ×2.059; Tiangong University [I198091727] 26 vs 11, ×1.846; Shanghai University [I113940042] 28 vs 12, ×1.822. Con volumi minori: Chinese University of Hong Kong [I177725633] 12 vs 1, ×9.373; KTH [I86987016] 12 vs 2, ×4.686; Imperial College London [I47508984] 14 vs 4, ×2.734.
- **In calo relativo**: Liaoning University of Technology [I2898894] 72 vs 97, ×0.58; State Key Laboratory of Synthetical Automation for Process Industries [I4391767858] 40 vs 65, ×0.481.

## 5. Avvertenze

- **Topic Modeling [T10028]** (21 vs 0) è con ogni probabilità un'etichettatura errata di OpenAlex: va ignorato. Stroke Rehabilitation [T10510] (30 vs 15) e Epidemiology Models [T10482] (26 vs 17) sono nicchie applicative marginali.
- **control barrier functions 34 vs 0** e altri salti da quasi zero possono dipendere da quando è comparso il vocabolario delle keyword, più che da un tema nato dal nulla. Keyword come "Padé approximants" (32 vs 12) o "online learning" (id `e-learning`) sono rumore di estrazione.
- La crescita per istituzione è **relativa alla quota**: Harbin ha più lavori in assoluto (112 vs 96), eppure risulta ×0.911.
- La ricerca su titolo e abstract non equivale all'appartenenza reale al tema. Inoltre i topic OpenAlex sono grossolani (p.es. [T10791]) e il 2026 è incompleto.
