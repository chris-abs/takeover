# Migration recipe catalogue

Read only applicable recipes. These are assessment/planning recipes, not scripts that modify the app. Verify current official migration guidance and exact package contracts at use time. Each recipe must produce granular commit proposals and investigate missing evidence and state concrete changes or verification. Package declarations, metadata compatibility and working runtime behaviour are separate evidence levels.

## REACT-18-CSR — React 17 → React 18 client root

- **Detect:** React/DOM <18 with `ReactDOM.render` or imported `render`; client-rendered entry. SSR/hydration or native entry needs a separately scoped recipe.
- **Evidence:** current/candidate graph, root files, type versions if present, provider/library peer constraints. Candidate React/DOM must align; do not upgrade the app to React 19 merely because a codemod recipe mentions it.
- **Commit boundaries:** independently compatible peer prerequisites → React/DOM/types package+lock change retaining legacy root temporarily → `createRoot` activation. Include a prerequisite in the runtime transaction only when its exact current/candidate constraints establish coupling. Include API adapters with the dependency that requires them.
- **Preserve:** existing providers, auth callbacks, route behaviour and styles. Inspect effects only for root-activation compatibility; no domain rewrite.
- **Verify:** existing checks, mounted root, batching-sensitive behaviour, Strict Mode effects and auth/navigation/API smoke checks. Legacy-root warning is expected only in the intermediate commit.
- **Investigate:** unresolved peers, provider changes with no documented bridge, or a server/hydration entry requiring another plan.
- **Source:** https://react.dev/blog/2022/03/08/react-18-upgrade-guide

## CRA-VITE-SPA — CRA → Vite alongside the current build

- **Detect:** react-scripts owns start/build in an internal/browser SPA.
- **Evidence:** Node/package manager constraints, HTML entry, env keys (not values), SVG/CSS transforms, public assets/base path, local origin/HTTPS, deployment output and existing check commands. Check source syntax compatibility before assuming either build works.
- **Commit boundaries:** runtime prerequisite if needed → proven unused dependency cleanup → parallel Vite config/entry/env/assets and alternative scripts → local HTTPS/auth-origin settings → production base/output/deployment contract → default script activation → truly obsolete build dependency removal if safe. Omit no-op commits. Keep enough configuration together for the alternative build to compile.
- **Preserve:** current build until alternate output works. Existing react-scripts-based check commands may still require react-scripts after Vite becomes the active build; do not replace the testing architecture to remove it. Expose only explicitly public env keys.
- **Verify:** chosen React/plugin compatibility at every intermediate stage, existing checks, production assets, nginx deep refresh, base paths and environment-specific auth redirects.
- **Investigate:** unsupported intermediate Node/React plugin set, unknown transforms, or check invocation requiring separately scoped infrastructure changes. Routine local environment setup is not a reason to combine unrelated upgrades or ask the user for migration decisions.
- **Sources:** https://vite.dev/guide/ ; https://react.dev/blog/2025/02/14/sunsetting-create-react-app

## INTERNAL-AUTH-PEERS — Internal auth/HTTP compatibility transition

- **Detect:** existing organisation auth/HTTP/API-client dependencies with React/Router/Axios/styling constraints relevant to the selected target. Do not require any upgrade if existing packages are compatible.
- **Evidence:** published manifests for exact current/selected versions, changelog/source exports and provider/interceptor contracts; source integration points. Optional reference versions are candidates only. Broad peer ranges do not establish API compatibility.
- **Commit boundaries:** independent compatible styling/HTTP/telemetry prerequisites separately → tightly coupled auth/HTTP/Axios/client changes with required adapters → Router change separately only if the auth contract supports both generations. Use graph ranges and source contracts to justify every merge. Keep existing hook-based data access.
- **Preserve:** scopes/token attachment, login/logout, registered redirects, protected return URL and telemetry.
- **Verify:** existing checks and relevant authenticated smoke checks in an approved environment. No production mutations during assessment.
- **Investigate:** missing private metadata/source, unclear token/client ownership or undocumented Router transition. Find the exact package/version contract through accessible source/metadata; ask for user intervention only when genuinely inaccessible; never invent a proprietary migration recipe or infer it from another app's installed node_modules.

## ROUTER-5-6 — Conditional Router API migration

- **Detect:** selected dependency contract requires Router 6 while app uses Router 5. Not triggered merely because React 18 is the goal.
- **Evidence:** dual-generation auth/telemetry support, route definitions, useHistory/withRouter consumers, params/query/base paths and package peers.
- **Commit boundaries:** backward-compatible preparation only where valuable → Router/history bump with necessary `Switch`/route element, navigation, guard and consumer adapters. Do not split into commits that import unavailable APIs. A supported compatibility adapter can enable smaller route-by-route changes; explicitly plan its removal.
- **Preserve/verify:** original route URLs, deep links, login returns, back/replace/query, unsaved navigation behaviour and telemetry.
- **Investigate:** auth guard or history telemetry contract cannot support the chosen API. Keep conditional until required and verified.
- **Source:** https://reactrouter.com/6.30.1/upgrading/v5
