# Review: robust-mpc

Reviewer run on 2026-11-18. Files: `report.md`, `analysis/trends.md`, `analysis/collaborators.md`.

## 1. ID check (`python scripts/radar.py check robust-mpc`)

`checked 207 cited ids in 3 file(s) — OK: every cited id exists in the fetched data`

Unknown ids: **none**.

## 2. Numeric claims

| Claim | File:line | Source value | Verdict |
|---|---|---|---|
| 934 recent vs 577 prev, x1.619; total 2551 | report.md:5,12; trends.md:7 | meta.json: n_recent 934, n_prev 577, volume_growth 1.619, total 2551 | OK |
| Yearly 178/193/206/214/314/406 (2021–2026) | report.md:12; trends.md:7 | trend.json years | OK |
| Share 0.004073 (2021) → 0.005 (2025) → 0.00571 (2026); 2024 dip 0.004029 | report.md:5,14; trends.md:9 | trend.json share_of_control_literature | OK (note: share already fell in 2023, 0.004399 → 0.004321; "nel 2024 la quota scende" is incomplete) |
| `koopman-operator` 27 vs 4, x4.17 | report.md:6,19; trends.md:15 | keywords.json | OK |
| `tube-mpc` 26 vs 6 x2.677; `constraint-tightening` 44 vs 20 x1.359; `tube-based-mpc` 101 vs 41 x1.522 | report.md:7,20; trends.md:17 | keywords.json | OK |
| `extended-state-observer` 15 vs 3 x3.089; GP 15 vs 5 x1.853; UQ 23 vs 8 x1.776; model-discrepancy 24 vs 10 x1.483; trajectory-tracking 88 vs 23 x2.364 | report.md:21–23; trends.md:19–23 | keywords.json | OK |
| T11701/T11007 21 vs 5 x2.595; T11192 24 vs 7 x2.118; T11615 127 vs 49 x1.601; T11082 33 vs 12 x1.699 | report.md:24; trends.md:26–30 | topics.json | OK |
| T10791 contains 736 of 934 recent works | report.md:68; trends.md:70 | topics.json T10791 count_recent 736 | OK |
| "Solo [T10808] scende sotto la soglia (x0.794)" / "Un solo elemento eleggibile ha crescita < 0.8" | report.md:25; trends.md:36 | topics.json: eligible topics below 0.8 also include T10046 Stability and Control of Uncertain Systems 220 vs 180 x0.755, T10228 x0.695, T10524 x0.656, T10963 x0.661, T10768 x0.65, T10223 x0.644, T10603 x0.618 | **WRONG** (claim taken from the truncated digest list) |
| Sichuan 25 x3.089; HIT 24 x1.853; Tsinghua 24 x1.141; BIT 24 x0.645 | report.md:28; trends.md:45 | institutions.json | OK |
| Fastest growers with ≥10 recent: USST x4.633, Tongji x2.626, NTU x2.471 | report.md:30; trends.md:47–51 | institutions.json: Sichuan (25 recent) x3.089 ranks 2nd and is left out | **WRONG** (ranking incomplete) |
| ETH 11 vs 16 x0.425; TU Delft 15 vs 6 x1.544; Sevilla x0.68; Imperial x0.824 | report.md:8,32; trends.md:55–58 | institutions.json | OK |
| FAU 6 vs 1 x3.707; IMT 7 vs 4 x1.081; PoliMi 6 vs 6 x0.618; Pavia 2 vs 2; Bergamo/Siena 3 vs 0; TU Wien 4 vs 0; Dortmund 6 vs 6; Hannover 5 vs 4; GIPSA 5; Grenoble INP 4 | report.md:8,34,44; collaborators.md:6–22 | institutions.json | OK |
| PolyU / Hanyang 9 vs 1, x5.56 | report.md:69; trends.md:72 | institutions.json | OK |
| Countries CN 454, US 95, DE 65, GB 53, IT 36 | report.md:8,34; trends.md:43 | countries.json | OK |
| Zeilinger 8 recent h47; Köhler 8 h33; Bemporad 4 h87; Lucia 7 h29; Graichen 6 h32; Fiacchini 6 h23; Müller 4 h48; Houska/Villanueva 5 h31/h16; Schildbach 4 h21; Bin Li 12 h31; Piga 1 | collaborators.md:6–32; report.md:28,38,39,45 | authors.json | OK |
| W4205769419 Automatica 2022, 248 cit.; W2557055507 2016 1157 cit.; W2952672134 2020 1054 cit. | report.md:19,53,54 | papers.md | OK |

## 3. Overclaims

1. **"In Europa cresce la Germania"** (report.md:8). countries.json has no time windows, so no country growth can be computed. The only evidence is one institution (FAU, 1 → 6). Other German groups in the same files are losing share: Hannover x0.772, Dortmund x0.618. UNSUPPORTED.
2. **"ETH Zurich ... resta il riferimento teorico"** (report.md:8) and **"Sono il riferimento teorico per l'SMPC nonlineare"** (report.md:38). These are value judgements the data does not support; the data shows ETH losing share (x0.425). UNSUPPORTED.
3. **TU Delft presented as the Koopman tube MPC group** (report.md:9, report.md:47, collaborators.md:18). In [W4205769419] the first author is at NUDT (CN), and TU Delft is one affiliation out of four (with PoliMi and Jilin). This paper alone does not show a Delft research line. Overattribution.
4. **Graichen linked to GRAMPC [W7202170213]** (report.md:44). Graichen is not an author of that paper (authors: Völz, Wietzke, Pierer von Esch, Landgraf). Minor misattribution.
5. **"FAU ... è il fit più forte"** (report.md:44). This rests on 6 recent works. It is acceptable as a recommendation only if worded as such, not as a finding.
6. **Cooling section.** Because of the WRONG claim above, the report hides that [T10046] Stability and Control of Uncertain Systems, the topic closest to robust control, is losing share (220 vs 180, x0.755). That is a substantive omission.

## 4. Caveats / partial year

- A limits section is present in report.md:64–71, trends.md:62–75 and collaborators.md:46–50. OK.
- The partial year 2026 is flagged in every file. The 2026 > 2025 anomaly is discussed without inventing a cause, and x1.619 is described as an order of magnitude. OK.
- report.md:66 says the OpenAlex budget was exhausted and the data was not re-fetched. This cannot be checked from the data files. It is consistent with meta.json `generated_at` 2026-11-18T11:16:13. Acceptable.

## VERDICT: FIX NEEDED

Fixes:
1. report.md:25 and trends.md:36: replace "Solo/Un solo elemento eleggibile < 0.8" with the full list from topics.json. At minimum include [T10046] Stability and Control of Uncertain Systems (220 vs 180, x0.755), [T10228] (x0.695), [T10963] (x0.661), [T10524] (x0.656), [T10768] (x0.65), [T10223] (x0.644), [T10603] (x0.618), plus [T10808] (x0.794). Note that the digest list is truncated.
2. report.md:30 and trends.md:47–51: add [I24185976] Sichuan University (25 vs 5, x3.089) as the 2nd-fastest grower among institutions with ≥10 recent works, or reword to "oltre a Sichuan".
3. report.md:8: delete "In Europa cresce la Germania". Say instead that FAU grows (1 → 6) while Hannover (x0.772) and Dortmund (x0.618) lose share, and that countries.json has no time windows.
4. report.md:8 and report.md:38: remove "resta il riferimento teorico" / "Sono il riferimento teorico". Keep only the data: 8 recent works each, h-index 47/33, the cited paper.
5. report.md:9, report.md:47, collaborators.md:18: do not present [W4205769419] as a TU Delft line of work. Say it is a co-authored NUDT / TU Delft / PoliMi / Jilin paper.
6. report.md:44: attribute [W7202170213] (GRAMPC) to Landgraf, Wietzke and Völz, not to Graichen.
7. Optional: report.md:14 and trends.md:9 should note that the share already fell in 2023 (0.004399 → 0.004321) before the 2024 low.
