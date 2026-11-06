# Responsive Internship Board

A responsive, accessible internship listing interface built with **semantic HTML, CSS, and vanilla JavaScript**—no frontend framework.

## Features

- Search by role, domain, location, work mode, or skill.
- Filter by domain and work mode; reset filters in one action.
- Reusable cards rendered from the supplied fictional JSON seed.
- Loading, empty-results, load-error, and retry states.
- Accessible labels, skip link, visible keyboard focus, live result announcements, and native modal dialogs.
- Role details and a client-side demo application form with native validation.
- Responsive layouts designed for 360px mobile, 768px tablet, and desktop widths.
- Reduced-motion preference support.

> **Important:** All internships are fictional sample records. The application form is frontend-only; it does not transmit or persist applicant information.

## Project structure

```text
responsive-internship-board/
├── index.html
├── styles.css
├── app.js
├── data/
│   └── internships.json
├── screenshots/
│   └── README.md
└── README.md
```

## Run locally

The page loads JSON with `fetch()`, so run it through a local HTTP server rather than opening `index.html` directly.

### Option A — VS Code Live Server
1. Open this folder in VS Code.
2. Install/enable the **Live Server** extension.
3. Right-click `index.html` and choose **Open with Live Server**.

### Option B — Python
From this project folder, run:

```bash
py -m http.server 5500
```

Then open <http://localhost:5500>.

## Data

`data/internships.json` uses the supplied fictional internship records and preserves the original IDs (`INT-101` through `INT-105`). Descriptions were added as optional display content.

## Accessibility notes

- Landmark elements (`header`, `nav`, `main`, `section`, `footer`) and a logical heading hierarchy.
- Every filter and form control has a programmatic label.
- The skip link and all interactive controls are keyboard reachable.
- `:focus-visible` provides a high-visibility focus indicator.
- Search result counts and form feedback use live regions.
- Native `<dialog>` elements provide modal semantics, focus handling, and Escape-to-close behavior.
- The interface respects `prefers-reduced-motion`.

## Responsive test checklist

Test using browser DevTools at these viewport widths:

| Viewport | Expected layout | Result |
|---|---|---|
| 360 × 800 | Single-column cards and filters; no horizontal scrolling | To verify |
| 768 × 1024 | Two-column filter/card layout | To verify |
| 1440 × 900 | Wide hero and two-column listing grid | To verify |

Also test:
- [ ] Tab through navigation, filters, cards, dialogs, and application form.
- [ ] Search for a skill such as `JavaScript`.
- [ ] Filter by `Full Stack Development` and `Remote`.
- [ ] Search for a term with no match to see the empty state.
- [ ] Temporarily rename `data/internships.json` to test the error and retry state, then restore it.
- [ ] Submit the demo application with invalid and valid values.
- [ ] Capture desktop and mobile screenshots and save them in `screenshots/`.

## Screenshots

See [`screenshots/README.md`](screenshots/README.md) for the capture checklist. Add screenshots after running the project locally.

## Deploy

This is a static site and can be deployed with GitHub Pages:
1. Create a **public** GitHub repository and push this project.
2. In GitHub, open **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**.
4. Select `main` and `/ (root)`, then save.
5. Wait for the Pages URL to appear and verify the deployed site.
6. Add the deployed URL to this README.

**Live preview:** [View Responsive Internship Board](https://kakarlanikhil123-del.github.io/responsive-internship-board/)

## Submission

Submit one GitHub repository or project page link containing the source, seed data, README, screenshots, and deployed preview URL.
