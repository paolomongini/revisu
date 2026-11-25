# Collaborazioni e letture: Adaptive Control

Profilo: dottorando in controllo automatico (Italia), interessi MPC / learning-based MPC / identificazione con reti neurali, data-driven control. Il dataset copre 22768 lavori (2000-2026); finestra recente [2024, 2026] = 5033 lavori, contro 3931 nel triennio precedente (x1.28). La query è stata ristretta ai nomi dei metodi (MRAC, adaptive backstepping, L1, adaptive SMC, adaptive NN/fuzzy, ...). Il 2026 è un anno parziale.

## Gruppi seguiti (watchlist)
- **Politecnico di Milano [I93860229]** (Milano, IT): 12 lavori recenti contro 14 precedenti (growth x0.669). È il gruppo seguito più presente. Marco Lovera [A5047408261] lavora su MRAC per UAV [W4366153247]. Mohsen Jalaeian-F. [A5066851566] unisce LSTM e RL actor-critic [W4416442515], molto vicino al profilo.
- **ETH Zurich [I35440088]**: 2 recenti, 2 precedenti. Marco Hutter [A5044258783] firma "Adaptive CLF-MPC" [W3211963501] e un controllore adattivo appreso per macchine idrauliche [W4392406158].
- **IDSIA [I2614128279]** (Lugano): 1 recente, 1 precedente. Nei paper Loris Roveda [A5086291668] risulta affiliato a SUPSI [I15196421] [W7203973387].
- **EPFL [I5124864]**: 0 recenti, 2 precedenti. Colin Neil Jones [A5085117832] compare solo in un NMPC del 2020 [W3043310534].
- **University of Pavia [I25217355]**: 0 recenti, 4 precedenti.
- **IMT Lucca** non compare in `institutions.json`. Bemporad, Piga, Magni, Zeilinger e Ferrari-Trecate non compaiono né in `authors.json` né nel campione. La query è centrata sul controllo adattivo classico, non sull'MPC.

## Gruppi da considerare
1. **Grenoble INP [I106785703]** (Grenoble, FR). Marcelo Menezes Morato [A5013734641] e Monica Spinola Felix [A5056690962] firmano [W4403975521] (2024, 83 citazioni), che collega MPC, data-driven, RL e controllo adattivo. È il lavoro più vicino al profilo nel campione (un solo paper). Il volume dell'istituzione non è nei dati.
2. **CNRS [I1294671590]** (Parigi, FR): 40 lavori recenti contro 26 precedenti (x1.202). Denis V. Efimov [A5039416214] propone un MRAC a tempo fisso senza persistenza di eccitazione [W7155387743]. Il punto di contatto con il profilo è il legame tra stima dei parametri e controllo.
3. **Imperial College London [I47508984]** (Londra, GB): 14 contro 4 (x2.734). Alessandro Astolfi [A5072148331] firma [W2142428281]. È un riferimento teorico sull'adattivo non lineare, utile come base per schemi grey-box. Il paper è del 2003: il suggerimento non poggia su attività recente nel campione.
4. **NTNU [I204778367]** (Trondheim, NO): 10 contro 7 (x1.116). Bjarne A. Foss [A5077762571] e Brage Rugstad Knudsen [A5050446060] firmano un NMPC con stima dei parametri dei sensori [W3043310534], in cui combinano identificazione e MPC. Il paper è del 2020: nel campione non c'è attività recente di questi autori.
5. **University of Groningen [I169381384]** (NL). Michele Cucuzzella [A5039988381] e Juan E. Machado [A5003331812] hanno lavorato sulla stima online dei parametri per microreti DC [W4380986230]: identificazione online dentro il controllo.
6. **University of Palermo [I900890020]** (IT). Adriano Fagiolini [A5070192940] aggiunge a un controllore adattivo una rete physics-informed e un Lyapunov appreso [W7160820507] (2026): è il filone dei modelli physics-informed.
7. **KTH [I86987016]** (Stoccolma, SE): 12 contro 2 (x4.686), la crescita più alta tra le istituzioni europee. Nel campione compare solo Qianwen Xu [A5038817226], quindi va verificato prima di contattare.
8. **Caltech [I122411786]** (US, extra-europeo): Guanya Shi [A5029314167] firma Neural-Fly [W4229014698] (2022, 462 citazioni). È un riferimento per l'adattamento online con reti neurali apprese tramite meta-learning.

## Persone da seguire
| Persona | Istituzione | Attività recente | h-index | Tema |
|---|---|---|---|---|
| Marcelo Menezes Morato [A5013734641] | Grenoble INP | [W4403975521] (2024) | n.d. | MPC e data science |
| Mohsen Jalaeian-F. [A5066851566] | PoliMi | [W4416442515] (2025) | n.d. | LSTM, RL, controllo ottimo |
| Hamid Reza Karimi [A5090855504] / [A5123310289] | PoliMi | [W4414982891] (2025), [W7124927853] (2026) | n.d. | adaptive SMC, osservatori di disturbo (anche neurali) |
| Marco Hutter [A5044258783] | ETH Zurich | [W4392406158] (2024) | n.d. | adattivo e MPC per la robotica |
| Loris Roveda [A5086291668] | SUPSI | [W7203973387] (2026) | n.d. | adattivo indiretto con modelli surrogati |
| Denis V. Efimov [A5039416214] | CNRS | [W7155387743] (2026) | n.d. | MRAC e convergenza dei parametri |
| Adriano Fagiolini [A5070192940] | Univ. Palermo | [W7160820507] (2026) | n.d. | PINN e adattivo |
| Zhongsheng Hou [A5082706113] | Qingdao University [I108688024] | 20 lavori recenti | 71 | model-free adaptive control (data-driven) |
| Warren E. Dixon [A5032651215] | University of Florida [I33213144] | 10 lavori recenti, [W7117582391] | 70 | adattivo con reti profonde (Lb-DNN, KAN) |

## Lista di lettura
- `classic` [W2142428281] (2003): immersion and invariance, uno strumento classico per l'adattivo non lineare.
- `classic` [W2914108621] (2019): model-free adaptive control e analisi di stabilità, il ponte verso il data-driven.
- `classic` [W4229014698] (2022): Neural-Fly, adattamento online con rappresentazioni neurali apprese.
- `recent-impact` [W4403975521] (2024): survey che collega data science e MPC, letta in chiave adattiva.
- `recent-impact` [W4412663119] (2025): SMC basato su RNN, mostra le reti ricorrenti dentro l'anello di controllo.
- `recent-impact` [W4406046946] (2025): L1 adaptive come augmentation di un controllore nominale, con garanzie.
- `watched` [W3211963501] (2021): adaptive CLF-MPC, l'integrazione diretta fra adattivo e MPC.
- `fresh` [W7118624428] (2026): identificazione e MRAC con reti neurali.
- `fresh` [W7124463516] (2026): MRAC con vincoli su stati e ingressi, contrapposto (non confrontato sperimentalmente) a MPC e CBF.
- `fresh` [W7160820507] (2026): Lyapunov appreso e PINN per stimare la dinamica non modellata.

## Limiti
- **Persone sdoppiate.** Hamid Reza Karimi compare con due ID OpenAlex distinti ([A5090855504], [A5123310289]): i conteggi per persona sono quindi sottostimati.
- **Affiliazioni che cambiano nel tempo.** Hongyi Xie [A5034086891] risulta all'Harbin Institute of Technology nel 2022 [W4285057872] e al PoliMi nel 2025 [W4416790530]: probabile cambio di affiliazione, non un errore, ma i conteggi per istituzione seguono l'affiliazione del singolo paper. Roveda è indicato come SUPSI e non come IDSIA.
- **h-index mancanti.** I ricercatori europei non sono tra gli autori più attivi di `authors.json` (dominato da istituzioni cinesi), quindi per loro l'h-index non è disponibile.
- **Copertura parziale.** Il campione contiene 329 paper. La ricerca per parole chiave non equivale all'appartenenza reale al tema: i gruppi MPC/identificazione della watchlist risultano sottorappresentati proprio per come è costruita la query.
- **2026 parziale.** I conteggi del 2026 e le citazioni dei lavori `fresh` sono incompleti.
