# Resolutions

Settled answers that hold for every app. Apply them directly; don't look them up again in the ICL. A use these don't cover goes through [icl-lookup.md](icl-lookup.md) as normal.

## Styled-entry dependencies

Every one of these has a Tailwind replacement. Rate them green unless the app uses one in a way the replacement can't cover, and name that use.

| Styled import | Replacement |
|---|---|
| Themes (`defaultTheme`, `strategyBlueTheme` and the others), `ThemeProvider`, the `BusinessTheme` type | The `tailwind.css` stylesheet plus `data-theme`, `data-mode` and `data-tenant` on the document root (`applyTailwindThemeAttributes` from `/tailwind`) |
| `Tokens` and `theme.*` reads in app styles | Tailwind utilities and theme tokens, such as `bg-primary-300` |
| `ResetStyles`, `globalReset` and other global styles | The `tailwind.css` stylesheet |
| `pxToRem` and other style helpers | Tailwind utilities. The helper goes away with the styles it sits in. |
| Hooks (`useOnClickOutside`, `useDisableScroll`, `useIsScrolling`) | An app-local hook the app owns. Don't point to `/tailwind` hooks: they exist for ICL components' internal use, not for consumers. |
| Types, such as `IconsDictionaryOptionsType` | The `/tailwind` type, such as `IconName` |
| `Zod` | Import `zod` directly |

## Icons

The styled and Tailwind systems share one icon registry. Icon names carry over unchanged; don't check them.

## Date pickers

ICL Tailwind has a `DateRangePicker` and no single-date picker. Map every date picker to `DateRangePicker` in the ICL integration table, whatever it's built on now:

- A use that picks a range (from and to, start and end) is rated with the questions in [risk.md](risk.md).
- A use that picks one date is red: the app has to accept a range in its place. Record the gap "single date only; DateRangePicker takes a range" against those call sites, and list it under ICL gaps.

## Design changes

The ICL Tailwind design replaces the old one; it isn't matched to it. Different sizes, spacing, colours, weights and wording are expected, as are lost `styled(X)` overrides. See [risk.md](risk.md).
