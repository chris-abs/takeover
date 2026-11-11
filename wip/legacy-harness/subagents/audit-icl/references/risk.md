# Risk

Every rating measures how much the move to Tailwind puts the app's **behaviour** at risk. An item with no ICL counterpart isn't rated red for that reason alone; it goes in the local Tailwind table.

Rate by answering each table's questions in order, for every call site. Don't rate by resemblance to any component named elsewhere in these docs. If a case doesn't clearly answer a question, say which question and why in the reason, and mark the rating suspected.

## The new design wins

Apps move to the ICL Tailwind design. They don't keep their current look. Visual change is expected:

- Visual differences never affect a rating. These include size, spacing, colour, weight, typography and default wording. Note them in the **Design changes** column when the docs you already read show them. Don't read styles just to fill it in.
- Overrides of an ICL component's styles are dropped in favour of the ICL design. If an override carries meaning, map it to the counterpart's tone or variant for that meaning.
- A prop that only sets appearance maps to a tone, a variant or `className` utilities. That counts as an equivalent.

## Rules for every table

- Rate on the props and behaviour the app actually uses, not on names or the map `kind`.
- The worst call site sets the rating.
- Each rating needs a reason that names the props or behaviours that decided it. When only some call sites drive the rating, name them as `file:line` and say how many call sites are easier than the rating.
- Props marked unknown (passed by spread) cap the confidence. Say so, and rate on the props you can see.
- Volume doesn't change a rating. Report exact call-site counts next to it so effort can be judged separately.
- Label a rating as suspected when it rests on a prop or behaviour you inferred but didn't see.
- A ruling in [resolutions.md](resolutions.md) takes precedence over these questions.

## ICL integration

1. **Would any call site lose behaviour, or change what it does for the user?** Check the counterpart's docs for a way to cover the behaviour before answering yes. A `mapping.ts` row under a different name, or a composed part, counts as covered. A name difference alone is never a change. **Yes → 🔴 Red.** Name the behaviour lost or changed. If the counterpart lacks behaviour the app needs, say whether a local Tailwind component would suit the app better.
2. **Does the app have to take on logic the styled component handled for it?** Logic is any code the app doesn't have today and must write: handling events, holding or deriving state, routing or navigation, or wiring focus, validation or form state. Composing parts in JSX isn't logic in itself. It counts only when a part needs handlers, state or wiring the app doesn't already have. **Yes → 🟠 Amber.** Name each piece of logic that moves to the app.
3. **Otherwise → 🟢 Green.** Every prop, value and piece of state the app already has maps onto the counterpart, even if the JSX structure changes.

List each red behaviour under ICL gaps in `report.md`, so the ICL team can decide.

## Local Tailwind

The component stays in the app and is rebuilt with Tailwind in the new design. Its behaviour stays; its old look doesn't.

1. **Does its behaviour come from a third-party UI library, or from an ICL styled component with no Tailwind counterpart?** **Yes → 🔴 Red.** That behaviour has to be rebuilt or replaced along with the styles.
2. **Do its styles depend on values that vary at runtime, such as state or data?** **Yes → 🟠 Amber.** Those styles need variants or state classes, not just utilities. A prop that only ever receives a constant doesn't count.
3. **Otherwise → 🟢 Green.** The styles are presentational and are rewritten with utilities and tokens.

A component with no call sites isn't rated. List it as unused in `report.md`.

## Styled-entry dependencies

1. **Is the import in [resolutions.md](resolutions.md), or does `/tailwind` export a replacement?** **No → 🔴 Red.**
2. **Does the app use it in a way the replacement doesn't cover?** **Yes → 🟠 Amber.** Name the use.
3. **Otherwise → 🟢 Green.**
