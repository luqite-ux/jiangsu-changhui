# Horizontal Header Logo Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the stacked header artwork with a larger transparent Chang Hui symbol and a two-line live-text wordmark on its right.

**Architecture:** Derive a transparent symbol asset deterministically from the approved source artwork so the trademark is not regenerated. Update only the existing header link markup and its contract test, preserving responsive header dimensions and accessibility.

**Tech Stack:** Next.js 16, React, Tailwind CSS, next/image, Node test runner, Sharp

## Global Constraints

- Change only the Jiangsu Changhui customer repository.
- Preserve the existing red symbol exactly; do not redraw it.
- Render `CHANG HUI` and `ELECTRIC` as live text to the right of the symbol.
- Keep the horizontal arrangement on desktop and mobile.
- Do not modify shared `huanqiu-admin` code or tenant data.

---

### Task 1: Transparent symbol and horizontal header lockup

**Files:**
- Create: `public/logo-symbol.png`
- Modify: `components/site-header.tsx`
- Modify: `tests/home-hero-layout-contract.test.mjs`

**Interfaces:**
- Consumes: approved source artwork at `public/logo-header.png`
- Produces: transparent symbol asset at `/logo-symbol.png` and accessible horizontal home-link markup

- [ ] **Step 1: Write the failing contract test**

Assert that `public/logo-symbol.png` exists, is square, has an alpha channel, and includes transparent pixels. Assert that the header uses this asset followed by live `CHANG HUI` and `ELECTRIC` wordmark lines inside a horizontal flex link.

- [ ] **Step 2: Run the focused test and verify RED**

Run: `node --test tests/home-hero-layout-contract.test.mjs`

Expected: FAIL because `logo-symbol.png` and the horizontal wordmark do not exist.

- [ ] **Step 3: Create the transparent symbol asset**

Use Sharp to crop only the red symbol from `public/logo-header.png`, convert near-white source pixels to alpha while preserving antialiased red edges, trim transparent padding, and place the unchanged mark on a square transparent canvas.

- [ ] **Step 4: Implement the horizontal lockup**

Replace the stacked `logo-header.png` image with `/logo-symbol.png`. Use a horizontal flex container, a larger responsive symbol, and two dark-blue serif text lines to its right. Preserve the existing `aria-label`, navigation spacing, and header heights.

- [ ] **Step 5: Run the focused test and verify GREEN**

Run: `node --test tests/home-hero-layout-contract.test.mjs`

Expected: PASS.

- [ ] **Step 6: Verify the complete site**

Run: `pnpm test`, `pnpm exec tsc --noEmit`, and `pnpm build`.

Expected: all commands pass.

- [ ] **Step 7: Verify responsive rendering**

Open the production-style site in a real browser at desktop and mobile viewport widths. Confirm the image background is transparent, the symbol is visibly larger, the wordmark sits on its right, navigation does not overlap, and contrast remains readable.

- [ ] **Step 8: Commit and deploy**

Stage only the plan, test, header, and new asset; commit intentionally; push `main`; wait for the Jiangsu Changhui Production deployment to become ready; verify the official domain.
