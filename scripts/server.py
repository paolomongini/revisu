#!/usr/bin/env python3
"""
Revisu - local app server (Python standard library only).

* serves the dashboard and the data (only dashboard/, data/, config/ - never dotfiles like .env)
* small JSON API so the dashboard can start jobs and stream their progress:
    GET  /api/status
    POST /api/fetch   {"slug": "mpc"} | {"query": "...", "label": "...", "save": true}
    POST /api/agent   {"command": "radar"|"ask", "args": "..."}   -> runs Claude Code headless
    GET  /api/jobs/current
    GET  /api/jobs/<id>/events?from=N   (Server-Sent Events)
    POST /api/jobs/<id>/cancel

Security (see the course lesson on coding agents):
* binds to 127.0.0.1 only;
* rejects requests whose Host/Origin is not this server (blocks CSRF and DNS rebinding from other sites);
* the prompt is passed to Claude Code through stdin, never through a shell;
* Claude Code runs with the project's .claude/settings.json (least privilege) and acceptEdits, not bypass.
"""
from __future__ import annotations

import http.server
import json
import os
import re
import shutil
import subprocess
import sys
import threading
import time
import uuid
from pathlib import Path
from urllib.parse import parse_qs, urlparse

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "scripts"))
import radar  # noqa: E402

PORT = int(os.environ.get("RADAR_PORT", "8765"))
ALLOWED_HOSTS = {f"localhost:{PORT}", f"127.0.0.1:{PORT}"}
ALLOWED_ORIGINS = {f"http://{h}" for h in ALLOWED_HOSTS}
STATIC_DIRS = ("dashboard", "data", "config")
AGENT_COMMANDS = ("radar", "ask")
SUBAGENT_TOOLS = ("Task", "Agent")


# --------------------------------------------------------------------------- jobs
class Job:
    def __init__(self, kind: str, title: str) -> None:
        self.id = uuid.uuid4().hex[:10]
        self.kind, self.title = kind, title
        self.events: list[dict] = []
        self.done = False
        self.ok: bool | None = None
        self.started = time.time()
        self.proc: subprocess.Popen | None = None
        self.cond = threading.Condition()

    def emit(self, **ev) -> None:
        ev["t"] = round(time.time() - self.started, 1)
        with self.cond:
            self.events.append(ev)
            self.cond.notify_all()

    def finish(self, ok: bool, **ev) -> None:
        self.emit(kind="end", ok=ok, **ev)
        with self.cond:
            self.done, self.ok = True, ok
            self.cond.notify_all()

    def summary(self) -> dict:
        return {"id": self.id, "kind": self.kind, "title": self.title, "done": self.done, "ok": self.ok,
                "events": len(self.events), "started": self.started}


LOCK = threading.Lock()
JOBS: dict[str, Job] = {}
CURRENT: Job | None = None


def start_job(kind: str, title: str, target) -> Job:
    global CURRENT
    with LOCK:
        if CURRENT and not CURRENT.done:
            raise RuntimeError(f"Un altro job e' in corso: {CURRENT.title}")
        job = Job(kind, title)
        JOBS[job.id] = CURRENT = job
    threading.Thread(target=_guard, args=(job, target), daemon=True).start()
    return job


def _guard(job: Job, target) -> None:
    try:
        target(job)
    except Exception as e:  # never leave a job hanging
        job.finish(False, text=f"Errore interno: {e}")


def child_env() -> dict:
    env = dict(os.environ)
    env.update({"PYTHONUNBUFFERED": "1", "PYTHONIOENCODING": "utf-8", "PYTHONUTF8": "1"})
    return env


# --------------------------------------------------------------------------- fetch job
def run_fetch(job: Job, args: list[str]) -> None:
    cmd = [sys.executable, str(ROOT / "scripts" / "radar.py"), "fetch", *args]
    job.emit(kind="status", agent="radar.py", text="Scarico i dati da OpenAlex ...")
    p = job.proc = subprocess.Popen(cmd, cwd=ROOT, env=child_env(), stdout=subprocess.PIPE,
                                    stderr=subprocess.STDOUT, text=True, encoding="utf-8", errors="replace")
    last = ""
    for line in p.stdout:  # type: ignore[union-attr]
        line = line.rstrip()
        if line:
            last = line
            job.emit(kind="log", agent="radar.py", text=line)
    code = p.wait()
    slug = last.strip() if code == 0 and re.fullmatch(r"[a-z0-9-]{1,40}", last.strip()) else None
    job.finish(code == 0, slug=slug, text="Dati pronti" if code == 0 else f"radar.py terminato con codice {code}")


# --------------------------------------------------------------------------- agent job
def expand_command(name: str, args: str) -> str:
    text = (ROOT / ".claude" / "commands" / f"{name}.md").read_text(encoding="utf-8")
    text = re.sub(r"^---.*?---\s*", "", text, flags=re.S)  # drop frontmatter
    return text.replace("$ARGUMENTS", args)


def short_input(name: str, inp: dict) -> str:
    for k in ("command", "file_path", "pattern", "path", "description", "prompt"):
        if inp.get(k):
            s = str(inp[k]).replace(str(ROOT), ".").replace("\\", "/")
            return s if len(s) <= 160 else s[:157] + "..."
    return ""


def run_agent(job: Job, command: str, args: str) -> None:
    exe = shutil.which("claude")
    if not exe:
        job.finish(False, text="Claude Code non trovato: esegui setup.bat / setup.sh")
        return
    prompt = expand_command(command, args)
    cmd = [exe, "-p", "--output-format", "stream-json", "--verbose", "--permission-mode", "acceptEdits"]
    # Uses the account's default model. With an API key you can save money by setting e.g.
    # RADAR_MODEL=sonnet (or haiku) in .env.
    model = os.environ.get("RADAR_MODEL", "default").strip()
    if model and model != "default":
        cmd += ["--model", model]
    job.emit(kind="status", agent="orchestratore", text=f"Avvio Claude Code: /{command} {args}")
    p = job.proc = subprocess.Popen(cmd, cwd=ROOT, env=child_env(), stdin=subprocess.PIPE, stdout=subprocess.PIPE,
                                    stderr=subprocess.STDOUT, text=True, encoding="utf-8", errors="replace")
    p.stdin.write(prompt)  # type: ignore[union-attr]
    p.stdin.close()  # type: ignore[union-attr]

    sub_by_tool: dict[str, str] = {}   # tool_use_id of a Task call -> subagent name
    result = None
    for raw in p.stdout:  # type: ignore[union-attr]
        raw = raw.strip()
        if not raw:
            continue
        try:
            ev = json.loads(raw)
        except json.JSONDecodeError:
            if "has not been trusted" in raw:
                job.emit(kind="warn", agent="server",
                         text="Cartella non ancora 'fidata' per Claude Code: i permessi del progetto sono ignorati e "
                              "alcune azioni verranno negate. Avvia una volta start.bat / start.sh e accetta il "
                              "dialogo di fiducia di Claude Code.")
            else:
                job.emit(kind="log", agent="claude", text=raw[:400])
            continue
        typ = ev.get("type")
        who = sub_by_tool.get(ev.get("parent_tool_use_id") or "", "orchestratore")
        if typ == "system" and ev.get("subtype") == "init":
            job.emit(kind="status", agent="orchestratore", text=f"Sessione avviata · modello {ev.get('model', '?')}")
        elif typ == "assistant":
            for b in (ev.get("message") or {}).get("content") or []:
                if b.get("type") == "text" and b.get("text", "").strip():
                    job.emit(kind="text", agent=who, text=b["text"].strip())
                elif b.get("type") == "tool_use":
                    inp = b.get("input") or {}
                    if b.get("name") in SUBAGENT_TOOLS:
                        sub = inp.get("subagent_type") or "subagent"
                        sub_by_tool[b.get("id", "")] = sub
                        job.emit(kind="spawn", agent=who, sub=sub, text=inp.get("description") or "")
                    else:
                        job.emit(kind="tool", agent=who, tool=b.get("name"), text=short_input(b.get("name", ""), inp))
        elif typ == "user":
            for b in (ev.get("message") or {}).get("content") or []:
                if isinstance(b, dict) and b.get("type") == "tool_result":
                    tid = b.get("tool_use_id", "")
                    if tid in sub_by_tool:
                        job.emit(kind="agentdone", agent=sub_by_tool[tid], text="completato")
                    elif b.get("is_error"):
                        c = b.get("content")
                        msg = c if isinstance(c, str) else json.dumps(c)[:300]
                        job.emit(kind="error", agent=who, text=str(msg)[:300])
        elif typ == "result":
            result = ev
    code = p.wait()
    if result:
        ok = not result.get("is_error") and code == 0
        job.finish(ok, text=result.get("result") or "", cost=result.get("total_cost_usd"),
                   turns=result.get("num_turns"), duration=round((result.get("duration_ms") or 0) / 1000))
    else:
        job.finish(False, text=f"Claude Code terminato senza risultato (codice {code}). "
                               "Hai configurato la chiave API o fatto il login?")


# --------------------------------------------------------------------------- http
class Handler(http.server.SimpleHTTPRequestHandler):
    server_version = "ResearchRadar/1.0"

    def __init__(self, *a, **kw):
        super().__init__(*a, directory=str(ROOT), **kw)

    def log_message(self, fmt, *args):  # quiet
        pass

    # ---- security helpers
    def _host_ok(self) -> bool:
        return (self.headers.get("Host") or "") in ALLOWED_HOSTS

    def _origin_ok(self) -> bool:
        return (self.headers.get("Origin") or "") in ALLOWED_ORIGINS

    def _json(self, code: int, obj) -> None:
        body = json.dumps(obj, ensure_ascii=False).encode("utf-8")
        self.send_response(code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Cache-Control", "no-store")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def _body(self) -> dict:
        n = int(self.headers.get("Content-Length") or 0)
        if n > 4096 or "application/json" not in (self.headers.get("Content-Type") or ""):
            raise ValueError("richiesta non valida")
        return json.loads(self.rfile.read(n) or b"{}")

    # ---- static files
    def end_headers(self):
        if self.path.startswith("/data/") or self.path.startswith("/config/"):
            self.send_header("Cache-Control", "no-store")
        self.send_header("X-Content-Type-Options", "nosniff")
        super().end_headers()

    def do_GET(self):
        if not self._host_ok():
            return self._json(403, {"error": "host non consentito"})
        u = urlparse(self.path)
        if u.path.startswith("/api/"):
            return self._api_get(u)
        if u.path in ("/", ""):
            self.send_response(302)
            self.send_header("Location", "/dashboard/")
            self.end_headers()
            return
        parts = [p for p in u.path.split("/") if p]
        if not parts or parts[0] not in STATIC_DIRS or any(p.startswith(".") or p == ".." for p in parts):
            return self._json(404, {"error": "not found"})
        return super().do_GET()

    def do_HEAD(self):
        return self._json(405, {"error": "method not allowed"})

    def do_POST(self):
        if not (self._host_ok() and self._origin_ok()):
            return self._json(403, {"error": "origine non consentita"})
        u = urlparse(self.path)
        try:
            if u.path == "/api/fetch":
                return self._api_fetch(self._body())
            if u.path == "/api/agent":
                return self._api_agent(self._body())
            m = re.fullmatch(r"/api/jobs/([0-9a-f]{10})/cancel", u.path)
            if m and m.group(1) in JOBS:
                j = JOBS[m.group(1)]
                if j.proc and j.proc.poll() is None:
                    j.proc.terminate()
                    j.emit(kind="status", agent="server", text="Interrotto dall'utente")
                return self._json(200, {"ok": True})
        except (ValueError, json.JSONDecodeError) as e:
            return self._json(400, {"error": str(e)})
        except RuntimeError as e:
            return self._json(409, {"error": str(e)})
        return self._json(404, {"error": "not found"})

    # ---- API
    def _api_get(self, u):
        if u.path == "/api/status":
            return self._json(200, {
                "api": True,
                "claude": bool(shutil.which("claude")),
                "openalex_key": bool(os.environ.get("OPENALEX_API_KEY")),
                "anthropic_key": bool(os.environ.get("ANTHROPIC_API_KEY")),
                "busy": CURRENT.summary() if CURRENT and not CURRENT.done else None,
            })
        if u.path == "/api/jobs/current":
            return self._json(200, CURRENT.summary() if CURRENT else None)
        m = re.fullmatch(r"/api/jobs/([0-9a-f]{10})/events", u.path)
        if m and m.group(1) in JOBS:
            return self._stream(JOBS[m.group(1)], int((parse_qs(u.query).get("from") or ["0"])[0]))
        return self._json(404, {"error": "not found"})

    def _stream(self, job: Job, i: int) -> None:
        self.send_response(200)
        self.send_header("Content-Type", "text/event-stream; charset=utf-8")
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        try:
            while True:
                with job.cond:
                    if i >= len(job.events) and not job.done:
                        job.cond.wait(timeout=15)
                    batch, done = job.events[i:], job.done
                for ev in batch:
                    self.wfile.write(f"data: {json.dumps(ev, ensure_ascii=False)}\n\n".encode("utf-8"))
                i += len(batch)
                if not batch:
                    self.wfile.write(b": ping\n\n")
                self.wfile.flush()
                if done and i >= len(job.events):
                    return
        except (BrokenPipeError, ConnectionResetError, ConnectionAbortedError):
            return

    def _api_fetch(self, b: dict):
        if b.get("slug"):
            slug = str(b["slug"])
            if not re.fullmatch(r"[a-z0-9-]{1,40}", slug):
                raise ValueError("slug non valido")
            job = start_job("fetch", f"Aggiorna dati: {slug}", lambda j: run_fetch(j, [slug]))
            return self._json(200, job.summary())
        query, label = str(b.get("query", "")).strip(), str(b.get("label", "")).strip()
        if not query or len(query) > 300 or "," in query:
            raise ValueError("query vuota, troppo lunga o con virgole (usa OR / AND)")
        label = label[:80] or query.strip('"')[:80]
        slug = radar.slugify(label)
        args = [slug, "--query", query, "--label", label] + (["--save"] if b.get("save", True) else [])
        job = start_job("fetch", f"Nuovo topic: {label}", lambda j: run_fetch(j, args))
        return self._json(200, {**job.summary(), "slug": slug})

    def _api_agent(self, b: dict):
        command, args = str(b.get("command", "")), str(b.get("args", "")).strip()
        if command not in AGENT_COMMANDS:
            raise ValueError("comando non consentito")
        if not args or len(args) > 400:
            raise ValueError("argomento vuoto o troppo lungo")
        job = start_job("agent", f"/{command} {args}", lambda j: run_agent(j, command, args))
        return self._json(200, job.summary())


def main() -> None:
    radar.load_env()
    srv = http.server.ThreadingHTTPServer(("127.0.0.1", PORT), Handler)
    srv.daemon_threads = True
    print(f"Revisu on http://localhost:{PORT}/dashboard/  (Ctrl+C to stop)", flush=True)
    try:
        srv.serve_forever()
    except KeyboardInterrupt:
        pass


if __name__ == "__main__":
    main()
