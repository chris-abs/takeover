# icl-compatibility: decisions

- "ICL" means InternalCL.
- ICL Tailwind is the target. Styled is being sunset, so every styled use is mapped, however small.
- The only early exit is an app that imports nothing from the package root. Local wrappers built on ICL Tailwind are fine.
- The ICL repository in the workspace is the reference, not the app's `node_modules`. The installed version may predate Tailwind, and the styled → Tailwind map isn't published.
- Inventory the app before reading the ICL, and read the ICL cheapest first ([icl-lookup.md](icl-lookup.md)). Never read the whole ICL.
- Apps adopt the new ICL Tailwind design; they aren't matched to their old look. Visual differences are noted as design changes and never raise a rating.
- Settled cross-app answers live in [resolutions.md](resolutions.md) and are applied without new ICL reads.
- Ratings measure how much the move puts the app's behaviour at risk, using ordered questions with no component examples ([risk.md](risk.md)). Having no ICL counterpart isn't a failure: the component stays local, restyled with Tailwind, and is rated in its own table.
- The ICL's migration docs are the truth. When they're wrong, the docs get fixed in the ICL; the agent doesn't work around them.
- Ratings come from the props and behaviour in use at every call site, and the worst call site sets the rating ([risk.md](risk.md)). Never sample call sites.
- The integration map informs migration planning. Nothing is built from it yet.
