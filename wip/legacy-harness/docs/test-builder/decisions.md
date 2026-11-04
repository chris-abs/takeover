# test-builder: decisions

- Build only seams whose status is `approved`.
- Never change production code or config. Tests protect current behaviour; they do not change it.
- A failing new test is either a test bug, which you fix, or a real defect, which goes in `known-risks.md`. Never change the app to make a test pass.
- Same seam rules as the audit: protect data in → data out; never mock or assert on hooks, thunks, actions, reducers or selectors.
