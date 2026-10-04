# Forma · Creative OS

A personal, local-first AI organizer for creative projects. An idea becomes a practical plan, then moves through **Ideas → In progress → Done**.

Designed for independent designers, creators and solo founders. Russian-language interface. Dark graphite, violet and cyan; geometric typography; restrained workspace layout.

## Run

Requires Python 3.9+; no third-party dependencies, package install or build step.

```sh
python3 server.py
```

Open http://127.0.0.1:8765. The app includes a sample identity project and works without an API key. On macOS, use a working Python installation rather than the system developer-tools stub.

## What works

- Create multiple projects and switch between them.
- Describe an idea and generate a task plan.
- Add and edit tasks; move them between three stages.
- See completion progress calculated from real tasks.
- Save projects and briefs in this browser with localStorage.
- Export the active project as Markdown.
- Clearly distinguish a template-based demo from real AI.

## Optional AI mode

Set `OPENAI_API_KEY` securely in the server process environment before launching. `.env.example` documents the names but is not loaded automatically. `OPENAI_MODEL` defaults to `gpt-4.1-mini`; override it with a compatible model available to your API project.

The server calls the OpenAI Responses API with strict JSON Schema and validates task fields and stages before returning a plan. The key stays on the server. The app shows a disclosure before sending the brief. `store: false` is set; this is not a promise of zero provider retention. No credentials are included in this repository.

Without a key, generation produces a deterministic six-step creative workflow, inserting the user's brief into the first task. This is **not** a model response. Provider errors never silently fall back to demo content.

## Verify

```sh
python3 -m unittest discover -s tests -v
node --check public/app.js
```

CI runs both checks. Tests cover input validation, plan validation, demo context, the Responses request contract and incomplete model responses. Live paid AI calls require a separately configured key and were not part of the verified demo.

## Project map

```text
public/                 Accessible responsive UI, design tokens and favicon
server.py               Local static server + protected AI endpoint
tests/                  Meaningful backend contract tests
docs/PRODUCT.md         Product scope, acceptance criteria and roadmap
docs/DESIGN-SYSTEM.md   Palette, typography, layout and component specs
docs/ARCHITECTURE.md    Data model, API, security and tradeoffs
docs/PORTFOLIO.md       Honest portfolio case study and reusable description
.github/workflows/      Automated verification
```

## Boundaries

This is a complete single-user local MVP, not a hosted multi-user service. Data is device-local and can be lost when browser storage is cleared; export important work. No cloud sync, login, automatic publication or background agents. The Python server binds to loopback and must not be exposed publicly as-is. Before a hosted release, add authentication, server persistence, per-user quotas, deployment hardening and backups.

Project direction: Anastasia (`poblige26-netizen`). Product specification, implementation and documentation created with Codex; no claim of hand-written implementation or user research is made.

See [portfolio case study](docs/PORTFOLIO.md) and [product specification](docs/PRODUCT.md).
