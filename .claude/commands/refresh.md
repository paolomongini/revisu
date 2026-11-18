---
description: Re-download data for all configured topics (no LLM analysis)
---

Run `python scripts/radar.py fetch-all`. It can take a few minutes. When it finishes, report a table:
slug | total works | volume growth | generated_at (read each `data/<slug>/meta.json`).
Mention that existing `report.md` files are now older than the data, and suggest `/radar <slug>` for the topics
whose numbers changed the most.

Platform note: commands are written as `python ...`; on macOS/Linux use `python3 ...` if `python` is not found.
