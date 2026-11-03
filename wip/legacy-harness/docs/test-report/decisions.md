# test-report: decisions

- Audit only; never write tests. The output is the protection backlog the act phase works from.
- The app's fundamentals will change, so internals (hooks, thunks, actions, reducers, selectors) are never seams. Never mock or assert on them. Protect data in → data out ([seam-model.md](seam-model.md)).
- Journeys are private and never committed. Seams are what get published, by the act phase ([output-format.md](output-format.md)).
