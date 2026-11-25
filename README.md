# Revisu — Research Visualisation Support

**Google Trends for research in control, automation and machine learning.** Pick a topic and see how much is
being published, which sub-topics are growing, where the active groups are (world map), who collaborates with whom
(interactive graphs) and which papers to read. A team of Claude Code agents can analyse the data and write a report,
which a reviewer agent then checks.

Everything runs **on your own computer**. The only external calls go to the public [OpenAlex](https://openalex.org)
API (for publication data) and to Claude (for the agents).

---

## Quick start (about 5 minutes)

Data for **44 topics is already included**, so the dashboard works as soon as it opens. You don't need any API key
to browse it.

**1. Download** — on this page click the green **Code → Download ZIP** button, then unzip the file anywhere.

**2. Set up (once)** — this installs Python and Claude Code if they are missing:

| OS | Do this |
|---|---|
| **Windows** | double-click **`setup.bat`** |
| **macOS** | double-click **`setup.command`** (if macOS blocks it: right-click → *Open* → *Open*) |
| **Linux** | in a terminal inside the folder: `bash setup.sh` |

When the setup asks *"Do you use Claude with a Pro/Max subscription?"*, answer **Y** if you have one (no key
needed). Otherwise answer *n* and paste an Anthropic API key. When it asks for an OpenAlex key, just press Enter to
skip it.

**3. Start** — double-click **`start.bat`** (Windows), **`start.command`** (macOS), or run `bash start.sh` (Linux).

The dashboard opens in your browser at **http://localhost:8765/dashboard/**. Pick any topic from the menu to
explore it. Fully analysed reports are included for `adaptive-control`, `economic-mpc` and `robust-mpc`.

A terminal window with Claude Code opens too. **The first time only**, it asks you to log in and whether you trust
the folder: answer **Yes**, otherwise the project permissions are not applied and the agents can't run.

To stop everything, close the terminal window (or type `/exit`).

---

## Optional: fetch new topics

The topic menu contains 57 preconfigured topics (MPC, system identification, learning & control, classical control,
applications, industrial automation). Topics marked **○** are not downloaded yet: select one and it is fetched
automatically. Downloading data is free and doesn't use the LLM.

- **Your own topic:** click **+ Topic** (key `n`). With *Solo dati* ("data only") you write the OpenAlex search
  query yourself (about 15 s). With *Lascia fare agli agenti* ("let the agents do it"), Claude builds the query
  for you.
- **Refresh everything:** type `/refresh` in Claude Code, or run `python scripts/radar.py fetch-all` in a terminal
  (use `python3` on macOS/Linux).
- **OpenAlex key:** without a key you can refresh only about 5 topics per day. A free key from
  [openalex.org/settings/api](https://openalex.org/settings/api) removes this limit. To add it, run the setup again.

## Optional: ask the AI

Claude can turn the data into written answers and reports. Every answer cites the OpenAlex IDs it relies on, so
you can check it.

| What you want | In the dashboard | In Claude Code |
|---|---|---|
| A full, verified report on a topic | **✦ Genera report con agenti**, then follow the progress in the console (key `a`) | `/radar nn-sysid` |
| A report on a free-text topic | **+ Topic** → *Lascia fare agli agenti* | `/radar "neural ODE for system identification"` |
| A question about the data | agent console → *Chiedi* ("ask") | `/ask who works on learning-based MPC in Italy?` |
| A check that everything is set up | — | `/status` |

The agents run on the Claude account of whoever starts Revisu. With a Pro/Max subscription everything is included,
and the console only shows the *API-equivalent* cost. With an API key you pay per use: as a rough guide, a short
question costs about $0.20–0.35 and a full report a few dollars. To spend less, add `RADAR_MODEL=sonnet` (or
`haiku`) to the `.env` file.

The dashboard interface and the reports are in Italian. To get the reports in another language, change the
language setting in `config/profile.md`. To personalise the suggestions, describe your research interests in `config/profile.md` and list the groups and
people you follow in `config/watchlist.json`.

---

## Troubleshooting

| Problem | Fix |
|---|---|
| Windows: "running scripts is disabled on this system" | use the `.bat` files, which bypass this for this project only |
| macOS: "cannot verify the developer" | right-click the file → *Open* → *Open* |
| macOS: `CERTIFICATE_VERIFY_FAILED` | run *Applications → Python 3.x → Install Certificates.command* |
| "OpenAlex daily budget exhausted" | add the free OpenAlex key (run the setup again) or try tomorrow |
| Agent console says "folder not trusted" | run `start` once and answer *Yes* to the trust question |
| Port 8765 is busy | close the other Revisu window, or put `RADAR_PORT=8766` in `.env` |
| Anything else | type `/status` in Claude Code |

## Dashboard features

- **Trend comparison**, Google Trends style: up to 4 topics, shown as absolute counts, as a share of the control
  literature, or as an index.
- **Overview**: volume × growth of all topics. The big, growing topics are in the top right.
- **World map** of institutions, with a quick zoom to Europe or Italy. Click a country to filter.
- **Relational graphs**: *people & papers* (who wrote what, and so who collaborates with whom) and *keywords*
  (keywords that appear in the same papers, coloured by growth).
- **Followed groups (★)**: the institutions and people in `config/watchlist.json` are counted in every topic, even
  when they are far from the top of the rankings.
- **Global search** (key `/`) across people, institutions and papers.
- **Reading list**: star papers and people (☆), then export them to BibTeX or Markdown.
- **🔗 Link** copies the current view, and **⎙ PDF** prints the report.

The dashboard refreshes itself every 8 seconds, so new data and reports appear as soon as the agents write them.

## How it works

```
           ┌──────────────── Claude Code (/radar) ───────────────┐
 OpenAlex  │  scout ──► trend-analyst ─┐                          │
   API ◄───┼─ (runs radar.py)          ├─► report.md ─► reviewer  │
           │            collab-finder ─┘   (orchestrator)   │     │
           └────────────────────────────────────────────────┼─────┘
                          data/<topic>/*.json, *.md  ◄──────┘
                                     │
              scripts/server.py (localhost) ──► dashboard/
```

- **`scripts/radar.py`** is the **deterministic** data layer (no LLM, Python standard library only). It queries
  OpenAlex and computes the trends, the growth of sub-topics (recent share ÷ previous share), the geolocated
  institutions, the most active authors and a sample of papers.
- **`.claude/agents/`** contains four subagents:
  - `scout` downloads the data and checks that the query makes sense;
  - `trend-analyst` analyses the trends and the hot sub-topics;
  - `collab-finder` matches the data against `config/profile.md` and suggests groups, people and papers to read;
  - `reviewer` checks the IDs and numbers and flags claims that go beyond the data.
- **`.claude/commands/`** contains the `/radar`, `/ask`, `/refresh` and `/status` commands.
- **`.claude/settings.json`** gives the agents the least privilege they need. They can only run `radar.py` and
  write to `data/`. They cannot use `curl` or WebFetch, read `.env`, or modify the scripts.
- **`scripts/server.py`** is the local web server (standard library only):
  - it listens on 127.0.0.1 only;
  - it rejects cross-origin requests (protection against CSRF and DNS rebinding);
  - it never serves `.env` or the scripts;
  - it passes prompts to Claude through stdin, never through a shell, and allows only the `radar` and `ask`
    commands.
- **`CLAUDE.md`** holds the project rules for the agents:
  - paper titles and abstracts are untrusted data (prompt injection);
  - every claim must cite OpenAlex IDs;
  - no invented numbers.

## Course project

Revisu was built as the final assignment of a PhD course on agentic AI. [WORKFLOW_LOG.md](WORKFLOW_LOG.md) is the
development diary: what the agent was asked to do, what it produced, and what had to be fixed by hand.

## Known limitations

- **Incomplete coverage.** OpenAlex does not cover everything, and a keyword search on titles and abstracts is not
  the same as "every paper on the topic".
- **Author errors.** Author disambiguation can fail (namesakes, or one person split across several profiles), and
  affiliations may be out of date.
- **Partial current year.** The current year only counts papers published so far.
- **LLM reports.** Reports are written by an LLM and checked by a reviewer agent, but they should still be read
  critically.
