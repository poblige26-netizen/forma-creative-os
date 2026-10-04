# Architecture

## Stack

Plain HTML/CSS/JavaScript frontend and Python 3.9+ standard-library server. No build step or external runtime package. The implementation deliberately fits a small, reviewable single-user portfolio project.

Browser → local HTTP server → OpenAI Responses API (optional). Project state stays in browser localStorage; only the submitted brief leaves the device in AI mode.

## Data model

Workspace: `{ version: 1, active: projectId, projects: Project[] }`.
Project: `{ id, name, description, brief, tasks: Task[] }`.
Task: `{ id, title, description, stage: 'idea' | 'doing' | 'done' }`.

UUIDs identify tasks and user-created projects. Storage shape is checked on restoration. Progress is computed, not persisted. A new plan appends fresh IDs; current work is preserved.

## API

`GET /api/config` returns `{mode: 'demo' | 'ai', token}`. The ephemeral local anti-CSRF token is returned only to the same-origin page.

`POST /api/plan` accepts JSON `{brief: string}` and requires `X-Forma-Token`. Responses contain `{mode, tasks}` or `{error}`. 400 invalid input/output, 403 host/token failure, 404 unknown route, 429 rapid requests, 502 provider connection/error. Request body capped at 16KB; brief capped at 3000 characters. A global two-second request interval bounds rapid accidental repeated submissions; it is not a public-service quota system.

OpenAI uses strict structured output, no tools, server-held credentials, 50-second timeout and `store: false`. Server revalidates result shape and stages. Refusal/incomplete output fails visibly. Official integration reference: https://developers.openai.com/api/docs/guides/structured-outputs (checked 2026-10-05).

## Security and deployment boundaries

Loopback-only binding, allowed Host values, request token, same-origin browser requests, restrictive CSP, no dynamic HTML insertion and no project contents in request logging. Static serving is rooted in public/, so server source and environment configuration are outside the web root. No authentication is implemented because this is a local single-user application. Do not bind this server to a public interface.

For internet hosting, replace the static development server, implement authenticated sessions, per-user persistence, request quotas, HTTPS and secrets management. localStorage is not encrypted storage; do not enter confidential briefs in the portfolio demo.

## Known limits

No account sync, collaboration, task deletion or import UI in v0.1. Browser-data removal deletes saved projects. AI quality depends on the supplied brief and accessible model; generated tasks require review. Styling uses a system font stack. The demo generator follows a common workflow and is not semantically intelligent.
