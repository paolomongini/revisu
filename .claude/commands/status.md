---
description: Check that Revisu is correctly set up
---

Run `python scripts/radar.py status` and report the result to the user as a short checklist (✅/⚠️).
For anything missing, give the one-line fix (e.g. "run setup.ps1 again to add the OpenAlex key").
Never read or print `.env`.
Remind the user: dashboard at http://localhost:8765/dashboard/ (started by `start.ps1` / `start.sh`).

Platform note: commands are written as `python ...`; on macOS/Linux use `python3 ...` if `python` is not found.
