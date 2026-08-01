# Horizontal Header Logo Design

## Goal

Replace the current stacked header logo with a compact horizontal brand lockup that is easier to read and uses the available navigation width more efficiently.

## Design

- Extract the existing red Chang Hui symbol into a transparent PNG without redrawing or altering the mark.
- Display the symbol larger than it appears in the current stacked artwork.
- Render `CHANG HUI` and `ELECTRIC` as two lines of live text to the right of the symbol.
- Keep the symbol and wordmark vertically centered inside the existing responsive header heights.
- Use the established dark blue brand color for the wordmark and preserve the current accessible home-link label.
- On smaller screens, scale the complete lockup down while retaining the horizontal arrangement.

## Scope

Only the Jiangsu Changhui customer site's header component, its dedicated logo asset, and relevant contract tests are changed. Shared `huanqiu-admin` code, tenant data, and other customer sites are out of scope.

## Verification

- Add a failing contract test for the transparent symbol asset and horizontal wordmark structure.
- Run the focused test, complete test suite, TypeScript check, and production build.
- Verify desktop and mobile rendering in a real browser before deployment.
