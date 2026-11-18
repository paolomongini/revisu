---
description: Full Revisu pipeline for one topic - fetch, analyse, write report, verify
argument-hint: <preset slug | free-text topic, e.g. "neural ODE for system identification">
---

Run the Revisu pipeline for: **$ARGUMENTS**

1. **Resolve the topic.**
   - If `$ARGUMENTS` is a slug in `config/topics.json`, use it.
   - Otherwise translate it into an OpenAlex boolean query (quoted phrases, AND/OR, no commas) using the
     standard terminology of control/automation papers, choose a short label and slug, and show the query
     to the user in one line before fetching.
   - If `$ARGUMENTS` is empty, run `python scripts/radar.py list` and ask which topic.
2. **Fetch** – delegate to the `scout` subagent. If it answers `QUERY NEEDS REFINEMENT`, fix the query once and
   retry; if still bad, stop and explain.
3. **Analyse** – launch the `trend-analyst` and `collab-finder` subagents **in parallel** on the slug.
4. **Report** – write `data/<slug>/report.md` yourself, merging the two analyses (don't copy them verbatim):
   ```
   # <label> — Revisu
   *Generato il <date> da OpenAlex · query: `<query>`*
   ## In breve            (5 bullet, the most useful facts)
   ## Trend
   ## Hot topic
   ## Dove si fa ricerca
   ## Con chi collaborare
   ## Da leggere
   ## Limiti di questa analisi
   ```
   Keep every `[ID]` citation. Language: from `config/profile.md`.
5. **Verify** – delegate to the `reviewer` subagent. If `VERDICT: FIX NEEDED`, apply the fixes to `report.md`
   (and analyses), then run `python scripts/radar.py check <slug>` again. Max 2 fix rounds.
6. Run `python scripts/radar.py index`.
7. **Log** – append to `WORKFLOW_LOG.md` a short entry: date, topic, query used, what the reviewer caught,
   what you fixed. (This log is material for the course presentation – be factual.)
8. Tell the user, in 4–6 lines: key findings, reviewer verdict, and that the dashboard
   (http://localhost:8765/dashboard/) has updated automatically.

Platform note: commands are written as `python ...`; on macOS/Linux use `python3 ...` if `python` is not found.
