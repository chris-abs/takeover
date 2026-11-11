# Application profiles and migration boundaries

The three goals are React 18+, compatible dependencies and Vite. These are profile-selection criteria, not required paths, installed reference apps or fixed version recommendations.

## Internal browser apps

Discover the actual router, authentication, state, HTTP clients and telemetry from the target repo. Internal SPAs may use React Router and Microsoft sign-in, but neither is a prerequisite for running this skill. Inspect guards, redirects and token attachment only far enough to preserve existing contracts through the upgrade. Keep existing permissions, business switching and UI/state patterns.

Existing UI/styling packages may have restrictive React peers; investigate exact declarations and used APIs without assuming failure or recommending a new UI library. Do not assess component-library adoption or visual coverage.

## Other profiles

SSR/hydration apps need their actual server entry, browser entry, routing and deployment contracts checked before recommending Vite. Do not apply a client-only SPA configuration to them. React Native or an unsupported non-web profile is outside this skill's web migration scope; do not rewrite it to fit.

## Optional reference apps

Use a reference repository only when the user provides one or it is genuinely available in the current workspace. Do not search a developer's home directory for a named checkout or assume an organisation's reference app is installed. Record its revision, exact relevant versions, used entry points and evidence limits. Working reference usage is supporting evidence, not a mandatory package set or proof that every integration in the target works. No reference app is needed for a standalone assessment.

## Decision rules

- Testing adequacy is an external precondition; existing test invocation may need a build-tool adapter. Coverage analysis, test design and new test infrastructure are outside scope.
- Align React types where present. General JavaScript-to-TypeScript conversion is separate work.
- State/Redux upgrades follow actual compatibility constraints. Keep existing feature and hook architecture.
- Router majors follow actual contracts; preserve URLs, auth return paths, basename and telemetry. React 18 alone does not require Router 6.
- Select runtime/package versions from current metadata and target repo requirements, not examples or another developer's installed versions. An already supported newer React version does not need downgrading to 18.
- Use deterministic usage/registry/peer evidence where possible; source and runtime interpretation establish the concrete migration plan.
