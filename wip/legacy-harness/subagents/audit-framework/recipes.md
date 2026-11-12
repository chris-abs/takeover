# Recipes

Read only the recipes that apply. They plan the migration; they don't change the app. Check current official migration guidance and exact package contracts each time. Package declarations, metadata compatibility and working runtime behaviour are separate levels of evidence.

## REACT-18-CSR: React 17 → 18 client root

- **Detect:** React or React DOM below 18 with `ReactDOM.render` or an imported `render`, in a client-rendered entry. An SSR, hydration or native entry needs a separately scoped plan.
- **Evidence:** the current and candidate graph, root files, type versions if present, and peer constraints of providers and libraries. React and React DOM candidates must align. Don't go to React 19 just because a codemod mentions it.
- **Commits:**
  1. independently compatible peer prerequisites
  2. React, React DOM and types, keeping the legacy root for now
  3. activate `createRoot`

  Fold a prerequisite into the React commit only when its exact constraints prove the coupling. Adapters go with the dependency that requires them.
- **Preserve:** providers, auth callbacks, route behaviour and styles. Inspect effects only for root-activation compatibility.
- **Verify:** existing checks, the mounted root, behaviour sensitive to batching, Strict Mode effects, and smoke checks of auth, navigation and API calls. The legacy-root warning is expected only in the intermediate commit.
- **Investigate:** unresolved peers, provider changes with no documented bridge, or a server or hydration entry.
- **Source:** https://react.dev/blog/2022/03/08/react-18-upgrade-guide

## CRA-VITE-SPA: CRA → Vite alongside the current build

- **Detect:** `react-scripts` owns start and build in a browser SPA.
- **Evidence:** Node and package-manager constraints, the HTML entry, env keys (never values), SVG and CSS transforms, public assets and base path, local origin and HTTPS, deployment output, and existing check commands. Check source syntax works with both builds.
- **Commits:**
  1. runtime prerequisite, if needed
  2. proven unused dependency cleanup
  3. parallel Vite config, entry, env, assets and alternative scripts
  4. local HTTPS and auth-origin settings
  5. production base, output and deployment contract
  6. switch the default scripts
  7. remove obsolete build dependencies, if safe

  Leave out any that would be empty. Keep enough config together for the alternative build to compile.
- **Preserve:** the current build until the Vite output works. Existing check commands may still need `react-scripts` after Vite becomes the build; don't replace the test setup to remove it. Expose only env keys that are explicitly public.
- **Verify:** React and plugin compatibility at every intermediate stage, existing checks, production assets, a deep-link refresh through nginx, base paths, and auth redirects per environment.
- **Investigate:** an unsupported intermediate Node or plugin set, unknown transforms, or check commands that would need separately scoped infrastructure changes.
- **Sources:** https://vite.dev/guide/ ; https://react.dev/blog/2025/02/14/sunsetting-create-react-app

## INTERNAL-AUTH-PEERS: internal auth and HTTP packages

- **Detect:** organisation auth, HTTP or API-client packages whose React, Router, Axios or styling constraints matter for the target. Don't upgrade them if they're already compatible.
- **Evidence:** published manifests for the exact current and selected versions, changelogs, source exports and provider or interceptor contracts, and where the app integrates them. Reference versions are only candidates. A broad peer range doesn't prove API compatibility.
- **Commits:**
  1. independently compatible styling, HTTP or telemetry prerequisites, separately
  2. tightly coupled auth, HTTP, Axios and client changes, with their adapters
  3. a Router change, separately, only if the auth contract supports both Router generations

  Justify every merged commit with graph ranges and source contracts. Keep the existing hook-based data access.
- **Preserve:** scopes, token attachment, login and logout, registered redirects, protected return URLs and telemetry.
- **Verify:** existing checks and relevant authenticated smoke checks in an approved environment. No production changes during assessment.
- **Investigate:** missing private metadata or source, unclear token or client ownership, or an undocumented Router transition. Get the exact contract from accessible source and metadata. Never invent a recipe for private packages, or infer one from another app's `node_modules`.

## ROUTER-5-6: Router API migration, when required

- **Detect:** a selected dependency requires Router 6 while the app uses Router 5. React 18 alone doesn't trigger this.
- **Evidence:** auth and telemetry support for both Router generations, route definitions, `useHistory` and `withRouter` consumers, params, query and base paths, and package peers.
- **Commits:**
  1. backward-compatible preparation, only where it's worth it
  2. the Router and history upgrade, with the necessary `Switch`, route element, navigation, guard and consumer adapters

  Don't split into commits that import APIs that aren't available yet. A supported compatibility adapter can allow route-by-route changes; plan its removal.
- **Preserve and verify:** route URLs, deep links, login returns, back, replace and query behaviour, unsaved-changes navigation, and telemetry.
- **Investigate:** an auth guard or history telemetry contract that can't support the chosen API. Keep the recipe conditional until it's required and verified.
- **Source:** https://reactrouter.com/6.30.1/upgrading/v5
