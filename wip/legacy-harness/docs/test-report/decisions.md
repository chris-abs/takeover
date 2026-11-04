# test-report: decisions

- Audit only; never write tests. The output is the protection backlog the act phase works from.
- Bash is for running the existing tests and coverage only. Record results; never fix failures and never install dependencies.
- The target harness is assumed. Setup gaps are reported as what approving the seams requires, never as a question for the user.
- HTTP is controlled at the transport with MSW.
- Approval is per seam. Every proposed seam starts as `proposed`; only the user changes its status. Test cases are reviewed once built.
- Record a defect only when it changes what a test should assert, and tie it to that seam. Ignore every other defect; another audit owns it.
- The app's fundamentals will change, so internals (hooks, thunks, actions, reducers, selectors) are never seams. Never mock or assert on them. Protect data in → data out ([seam-model.md](seam-model.md)).
- Journeys are private and never committed. Seams are what get published, by the act phase ([output-format.md](output-format.md)).
