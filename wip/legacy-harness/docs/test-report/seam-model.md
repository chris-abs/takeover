# Seam model

A **seam** is a public boundary where behaviour can be exercised and observed without reaching into implementation details. A seam is not a test level.

## Choosing a test level per behaviour

- **Focused seam test:** a rule, branch, failure, variant, state transition or regression at one observable boundary.
- **Integration test:** collaboration that focused tests cannot prove: wiring, state propagation, sequencing, adapter contracts. Justified only if the parts could pass separately while the workflow fails.
- **Both:** detailed contract risk and a distinct collaboration risk both exist. Focused tests come first.
- **Neither:** already adequately protected, or no project-owned behaviour worth protecting.

Pick the smallest scope that proves the behaviour with realistic inputs and observable outcomes.

## What to state for each behaviour

- **Contract:** what should happen for given inputs or conditions.
- **Regression risk:** the realistic defect a test should catch.
- **Real collaborators:** project-owned parts that should participate.
- **Controlled boundaries:** external or unrelated dependencies to mock. See [boundaries.md](boundaries.md).
- **Observable outcome:** rendered output, returned result, application state, navigation, persistence or an outbound request. Not internal call order.

## Typical integration risks

- Component, hook, action, reducer and store needing to agree.
- Route or query state selecting the right operation and final navigation.
- An API client carrying request and response through transformation into state.

Integration tests own a few representative paths. Focused tests own the detailed branch matrix.

## Migration-safe protection: data in → data out

We know the store's construction will change (Redux hooks → thunks), so everything between input and output is not a contract. Tests protect the data flow and treat the middle as a black box.

- **In:** preloaded state, user interactions, route and query params, API responses (controlled at the HTTP transport).
- **Out:** rendered UI, outbound request payloads, navigation, persisted data.
- **Middle (free to change):** hooks, thunks, action creators, reducers, selectors, middleware. Never mock them, and never assert on them.
- Build the store the way the app does, with its real reducers and middleware. Only the outer edges are controlled.

The same rule covers React upgrades and CRA → Vite: if a test would fail after a change that keeps behaviour the same, it is a liability, not protection.
