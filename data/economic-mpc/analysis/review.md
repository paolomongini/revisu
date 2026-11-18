# Review: Economic MPC

Revisore: subagente `reviewer`, 2026-11-18. Ho controllato `report.md`, `analysis/trends.md` e `analysis/collaborators.md` confrontandoli con `meta.json`, `trend.json`, `topics.json`, `keywords.json`, `institutions.json`, `countries.json`, `authors.json`, `works.json` e `papers.md`.

## 1. Controllo degli ID

**Non ho potuto eseguire `python scripts/radar.py check economic-mpc`:** il comando richiede un'approvazione che questa sessione non ha. Ho quindi rifatto a mano la stessa verifica, usando l'insieme di ID che il checker considera noti (radar.py:671-684): ID in `works.json` (lavori, autori, istituzioni), `authors.json`, `institutions.json` e `topics.json`.

- Lavori: tutti i 31 ID W citati sono presenti in `works.json`.
- Autori: tutti gli ID A citati sono presenti in `authors.json`.
- Istituzioni e topic: tutti gli ID I e T citati sono presenti in `institutions.json`, `topics.json` o `digest.md`.
- **ID sconosciuti trovati: nessuno.** Va comunque eseguito `radar.py check` per avere la conferma ufficiale.

## 2. Verifica dei numeri

| Affermazione | file:riga | Valore nella fonte | Esito |
|---|---|---|---|
| 785 totali, 235 recenti vs 185 precedenti, x1.27 | trends.md:7-8, report.md:5 | meta.json total 785, n_recent 235, n_prev 185, volume_growth 1.27 | OK |
| Lavori per anno: 2011: 5, 2014: 33, 2020: 80, 2021-2026: 59/62/64/55/79/101 | trends.md:7,9, report.md:12 | trend.json identico | OK |
| Quote 0.001784 (2020), 0.00135/0.001413/0.001342, 0.001035/0.001258/0.00142 | trends.md:10, report.md:14 | trend.json identico | OK |
| T11007 16 vs 3 x4.199; T11053 31 vs 46 x0.531; T10791 175 vs 158 x0.872 | trends.md:17,44,48 | topics.json identico | OK |
| Keyword recursive feasibility 25 vs 16 x1.23; economic model predictive control 140 vs 129 x0.854 | trends.md:32,48 | keywords.json identico | OK |
| Paesi: CN 103, US 32, DE 14, CA 13, ES 13, IT 13, GB 12, AU 11 | trends.md:52, report.md:7,27 | countries.json identico, **ma sono conteggi della sola finestra recente 2024-26** (radar.py:345, `wfilter(query, r0, r1)`). Il testo non lo dice, e in report.md:7 i numeri compaiono accanto al totale di 785. | UNSUPPORTED (finestra non indicata) |
| ETH 2 recenti, 1 precedente | collaborators.md:6, report.md:53 | institutions.json I35440088: 2 / 1 | OK |
| Zeilinger: 1 recente, h-index 47 | collaborators.md:6 | authors.json A5037513714: count_recent 1, h_index 47 | OK |
| IMT Lucca 3 vs 4, x0.59 | collaborators.md:7, trends.md:70 | I127077003: 3 / 4 / 0.59 | OK |
| PoliMi 2 vs 1 | collaborators.md:8 | I93860229: 2 / 1 | OK |
| EPFL 1 recente | collaborators.md:9, report.md:55 | I5124864: 1 recente, 2 precedenti | OK |
| Stuttgart 5, Delft 6, DTU 5 vs 1 x3.936, Imperial 5, CSIC 2, NTU 6 | collaborators.md:13-19 | institutions.json identico | OK |
| Tabella persone: Yin 4/h28, Han 3/h19, Ferramosca 3/h26, González 3/h24, Allgöwer 2/h91, McAllister 3/h10, Puig 3/h64, J. Liu 4/h44, D. He 12/h24 | collaborators.md:24-32, report.md:59-67 | authors.json identico per tutte e 9 le righe | OK |
| "2-6 lavori per istituto europeo" | collaborators.md:50 | EPFL ne ha 1 (I5124864) | WRONG |
| Citazioni: W4407238496 36, W4401190643 86, W4410588164 35, W4399070699 40, W7127279723 16 | trends.md:21,29,36,38 | papers.md identico | OK |
| 299 dei 785 lavori in papers.md | collaborators.md:49, report.md:89 | digest.md:116: 299 | OK |
| McAllister "Pubblicazioni: [W4416617166]" e "Robert D. McAllister (3 recenti). Lavora su MPC approssimato via imitation learning [W4416617166]" | collaborators.md:15, report.md:61 | works.json W4416617166: gli autori sono Changrui Liu, Shengling Shi, Anıl Alan, Venayagamoorthy e Bart De Schutter [A5026547410]. **McAllister non è tra gli autori.** Il suo lavoro nel campione è [W7207766296]. | WRONG |
| Allgöwer collegato a "EMPC con dinamiche ibride [W7202119722]" | report.md:62 (e collaborators.md:13 come "Persona chiave") | W7202119722: autori di Stuttgart (Abdul, Schwenkel, …). **Allgöwer non è tra gli autori**, mentre firma [W7154484498]. | WRONG |
| "Zanon, Müller, Bemporad … non hanno un ID [A…]" | collaborators.md:47, report.md:88 (e report.md:54, collaborators.md:7) | works.json: Zanon [A5106707940], Müller [A5057092836], Bemporad [A5053340099]. Il checker accetta questi ID (radar.py:676-677). | WRONG |
| Affiliazioni multiple di Ferramosca (Bergamo, UTN, CONICET), Sun (Southeast, Anhui), Dong (CityU HK, UNSW) | collaborators.md:48 | papers.md righe 927, 1431, 1537 / 119, 861 / 101, 1301 | OK |
| Pavia, IDSIA, Ferrari-Trecate, Piga e Magni assenti | collaborators.md:10, report.md:56 | Nessuna corrispondenza in nessun file `*.json` | OK |
| [W7125281334] fuori tema ("Anything as a Service") | trends.md:75, report.md:85 | Il titolo in papers.md:375 lo conferma | OK |

## 3. Overclaim

1. **"è il riferimento teorico europeo dell'EMPC"** (collaborators.md:13), **"È il riferimento per la teoria dell'EMPC"** (report.md:62), **"In Europa la teoria … passa da Stuttgart e IMT Lucca"** (report.md:9). I dati non lo sostengono: Stuttgart ha 5 lavori recenti con crescita x0.984, Allgöwer ne ha 2 recenti e Lucca 3 con crescita x0.59. È conoscenza di dominio presentata come un risultato dei dati.
2. **"è il gruppo che più integra identificazione neurale/Koopman e controllo economico"** (collaborators.md:19). Questo confronto non è stato misurato: si basa su 2 paper del campione.
3. **"il lavoro fondante"** (collaborators.md:35) e **"il prototipo di 'identificazione neurale + EMPC'"** (collaborators.md:37). Sono giudizi storici non derivabili dai dati, che contengono lavori EMPC già del 2007 e del 2010. Il dato verificabile è solo che sono "classic", con 683 e 55 citazioni.
4. **"cresce all'incirca al ritmo dell'intero settore, non più in fretta"** (trends.md:10, report.md:14). È troppo generoso. La quota media 2024-26 è circa 0.00124, contro circa 0.00137 nel 2021-23: in quota il tema è leggermente *più lento* del settore, e il 2024 (0.001035) è il valore più basso della serie recente. Formulazione corretta: "quota piatta o in lieve calo; il 2026 (parziale) è in ripresa".
5. **Paesi senza finestra temporale** (report.md:7, trends.md:52). "103 lavori contro 32" letto accanto a "785 lavori dal 2000" fa credere che siano conteggi sull'intero periodo. Inoltre un lavoro con più paesi viene contato una volta per ciascun paese.

## 4. Avvertenze e anno parziale

- La sezione avvertenze è presente in tutti e tre i file (trends.md §5, collaborators.md "Limiti", report.md "Limiti di questa analisi"). OK.
- Il 2026 parziale è trattato correttamente: è segnalato in ogni punto in cui si usa il 2026 o la finestra recente, ed è indicato che la finestra recente è sottostimata. OK.
- È segnalata la fragilità delle crescite costruite su 1 solo lavoro precedente (x4.723, x3.936). OK.
- Segnale omesso, non è un errore: la keyword `koopman-operator` passa da 8 recenti a 0 precedenti (keywords.json, growth null, sotto la soglia di 15). Sostiene il filone "Koopman" meglio del topic T11236 e potrebbe essere citata con la riserva sui piccoli numeri.

## VERDICT: FIX NEEDED

Correzioni richieste:
1. **McAllister / [W4416617166]** (collaborators.md:15, report.md:61). Togliere l'attribuzione a McAllister. Scrivere che [W4416617166] è un lavoro TU Delft con Bart De Schutter [A5026547410], e collegare McAllister al suo lavoro [W7207766296] (ingredienti terminali guidati da policy).
2. **Allgöwer / [W7202119722]** (report.md:62, collaborators.md:13). Attribuire [W7202119722] al gruppo di Stuttgart (ad es. Lukas Schwenkel [A5029868844]), non ad Allgöwer. Ad Allgöwer lasciare solo [W7154484498].
3. **ID mancanti** (collaborators.md:7,47; report.md:54,88). Sostituire "non hanno un ID" con gli ID presenti in works.json e citarli: Mario Zanon [A5106707940], Matthias A. Müller [A5057092836], Alberto Bemporad [A5053340099]. Si può precisare che non sono in `authors.json`, cioè non sono tra i più attivi nella finestra recente.
4. **Paesi** (report.md:7,27; trends.md:52). Aggiungere "nella finestra 2024-2026 (un lavoro può contare per più paesi)".
5. **collaborators.md:50.** Sostituire "2-6 lavori per istituto europeo" con "1-6".
6. **Quota sul settore** (trends.md:10, report.md:14). Riformulare come "quota piatta o in lieve calo rispetto al 2021-23 (media circa 0.00124 vs 0.00137), con ripresa provvisoria nel 2026".
7. **Overclaim** (collaborators.md:13,19,35,37; report.md:9,62). Togliere "il riferimento teorico europeo", "il gruppo che più integra", "il lavoro fondante" e "il prototipo". Sostituirli con fatti verificabili (conteggi, citazioni, titoli) o indicarli esplicitamente come opinione di dominio non derivata dai dati.
8. Eseguire `python scripts/radar.py check economic-mpc` dopo le correzioni e verificare che restituisca 0 ID non verificati.
