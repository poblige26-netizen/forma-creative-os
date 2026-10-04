# Forma — design system

## Direction

A focused creative control room: dark graphite surfaces, violet actions and cyan progress. A small luminous orb and compact Forma wordmark establish identity while the board remains the main working surface. Direction selected by the user: dark, violet/cyan, geometric typography, personal creative organizer.

## Tokens

| Role | Value | Usage |
| --- | --- | --- |
| Background | `#101119` | Main workspace |
| Surface | `#181a26` | Brief and task cards |
| Raised | `#202332` | Controls |
| Border | `#333747` | Control/card boundaries |
| Primary text | `#f2f2fa` | Titles and content |
| Muted text | `#a7adbf` | Supporting labels |
| Accent | `#b8a0ff` | Primary action, idea stage |
| Cyan | `#7dd9ef` | Progress and focus |
| Completion | `#a6dfba` | Done stage marker |

Tokens live in `public/style.css` under `:root`. Status also has a text label; colour alone carries no meaning.

## Typography

System-installed geometric stack: Avenir Next, Century Gothic, sans-serif. No remote font requests. Visual appearance varies by available system fonts. Body 16px; task details and labels 14px; metadata 12px. Project title scales 30–48px; section titles 21px. Body line height 1.5–1.6. Long user text wraps.

## Layout and components

Desktop: 250px project rail, flexible workspace, three task columns. Below 1050px: stacked columns and brief. Below 650px: project rail becomes a compact top selector. Four-pixel spacing rhythm; 9px control, 12px card and 16px panel radii. Minimum control height 44px.

Primary action: violet fill with dark text. Secondary: raised surface and visible border. Focus: cyan 3px outline with offset. Task cards expose title editing and a labelled stage select. Native modal dialogs handle focus containment, Escape and restoration. Errors and success messages share an aria-live status region. Loading disables generation and sets aria-busy.

## UI states

Empty project: blank brief with instruction plus empty stage messages. Populated demo: realistic creative identity project. Generating: clear busy label. AI failure: explicit retry-oriented error, never disguised as success. Storage unavailable: warning with export recovery option.

## Assets

`public/favicon.svg` and CSS orb are original vector/CSS assets. No third-party photographs or unlicensed fonts are required.

## Responsive identity revision — 2026-10-05

The brand now uses a three-module mark: an initial idea, the work in progress and its result. Decreasing module height gives a recognisable rhythm and abstract F silhouette. The same geometry appears in the primary mark, favicon and outlined sidebar motif. Removed the unrelated glowing orb and ornamental star. Graphite surfaces carry the interface; violet identifies actions, cyan supports progress. Russian labels replace unnecessary English workspace chrome.

Updated palette: background #10121a; surface #181b26; raised #202431; border #34394b; primary text #f3f3f8; muted #aab0c1; violet #b6a0ff; cyan #87d9e8. Updated controls: 8px radius; cards 10px; panels 14px. Logo assets: public/mark.svg and public/favicon.svg.

| Version | Width | Navigation | Working surface |
| --- | --- | --- | --- |
| Phone | Below 600px | Compact brand header, project strip, named add button | One selected stage; visible stage counts; collapsed brief by default |
| Tablet | 600–1199px | Top brand/actions and project strip | Three touch-sized columns, board scrolls horizontally when necessary |
| Desktop | 1200px and above | Persistent 240px project rail | Three simultaneous columns, split brief, full project overview |

One application implements these three layout and interaction modes. Projects and data remain shared when the viewport changes; separate native binaries are not supplied. Stage changes follow the moved task on phones, avoiding the appearance that a task vanished. Stage buttons use aria-pressed; the brief toggle uses aria-expanded and aria-controls. Brief can be folded on all device sizes. Dialogs stay within the available screen height.

Design judgment: better identity comes from repeatable geometry, hierarchy and useful space, rather than additional ornament. Phone prioritises the next task; tablet prioritises touch and comparing stages; desktop prioritises overview. Fonts remain the local geometric system stack, avoiding external requests and preserving Cyrillic support.
