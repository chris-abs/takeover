# build-tests: decisions

- Build only seams whose approval box is ticked (`- [x] Approve`).
- Never change production code or config. Tests protect current behaviour; they do not change it.
- A failing new test is either a test bug, which you fix, or a real defect, which you record in your reply. Never change the app to make a test pass.
- Same seam rules as the audit: protect data in → data out; never mock or assert on hooks, thunks, actions, reducers or selectors.
- Check [resolutions.md](resolutions.md) before solving a test-setup problem. A resolved problem uses its settled answer.
