# Forma — product specification

## Problem and audience

Independent creators often have ideas in one place and executable tasks elsewhere. Forma puts the project brief and its next steps in one calm workspace. The initial audience is a solo designer working on identities, websites or personal creative projects. This is a product hypothesis derived from the brief, not a validated research result.

## Core journey

1. Create a project with a title and short description.
2. Write an idea, intended audience and desired result in a 10–3000 character brief.
3. Generate a plan. Without an API key the UI explicitly marks it as a demo template; with a key the server requests tailored tasks from OpenAI.
4. Review the tasks. When a project already has tasks, confirm appending the new plan without overwriting existing work.
5. Edit details, change stages and see progress update.
6. Return later in the same browser, or export the project to Markdown.

## Acceptance criteria

- Project creation rejects blank titles; project switching restores the selected brief and tasks.
- The generator enforces brief bounds and disables duplicate submissions during a request.
- Loading, errors and demo/AI modes are visible and announced to assistive technology.
- Existing tasks survive regeneration; the user can cancel appending the generated plan.
- Task text is rendered as plain text, never interpreted as HTML.
- Moving a task updates board counts and percentage; zero tasks means 0%.
- Reload restores valid saved state. Storage failures are shown; export remains available.
- All core controls are keyboard-accessible and mobile layout has no horizontal page overflow.
- No API key is delivered to the browser or committed.

## MVP decisions

Single-user and local-first. Three stages keep the primary workflow simple. Native dialogs and selects provide keyboard behavior without a framework. Python standard library avoids an installation step. Deterministic demo makes the portfolio reviewable without paid credentials. Markdown export provides a portable handoff.

## Measure after launch

Hypotheses, not achieved numbers: percentage of new projects reaching their first completed task; median time from brief to a reviewed plan; percentage of generated tasks edited; weekly returning creators. Collect only with consent in a hosted version. First validation: five creators complete a project setup and explain their next action aloud. Record blockers rather than invented testimonials.

## Next release

Prioritize JSON import/export and recovery, then cloud persistence with authentication. Test demand before adding shared workspaces, deadlines, integrations or notifications. Automatic publication is out of scope.
