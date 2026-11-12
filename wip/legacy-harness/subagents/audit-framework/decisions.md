# audit-framework: decisions

- Audit only. Never change the app's code, manifest, lockfile, `node_modules` or registry configuration. Tools are installed outside the app.
- The report is your reply; write no report files. Raw evidence, configs, logs, downloaded packages and probe code stay in the external work directory from `prepare-output.mjs`. Never copy them into the app or the report.
- The targets are React and React DOM, the build tool (Vite) and the Node runtime. Each must end on a version its maintainers still support. An app already on a target's tool but on an unsupported major isn't on target.
- Choose each target's version from an options chart, built as [investigations.md](investigations.md) describes. Recommend the newest option that isn't blocked and has the lowest effort. If a newer option costs one effort level more, still recommend the lower one, but name the newer option and what it would add. Write commits for the recommended option only. The user decides on approval.
- Every other dependency moves only when the targets or the graph require it. Keep packages that are already compatible. Router and Redux majors follow actual compatibility constraints; React 18 alone doesn't require them.
- Check support policies and release lines at the time of assessment; never hard-code them.
- Select versions from current registry metadata and the app's own requirements, never from examples, reference apps or another developer's installed versions. An app already on a supported newer React isn't downgraded.
- A restrictive peer declaration isn't proof of failure, and a successful install or another app's build isn't proof of runtime compatibility. Investigate to a conclusion instead of handing back "check compatibility".
- Investigation the agent can do is never a question for the user. "Needs your input" is only for missing access, unavailable resources or a genuine organisational decision.
- Each proposed commit is one reviewable concern that leaves the app installable and buildable. The user approves each commit by ticking its box.
- Don't check backend, VPN, CORS or local login health. Preserve auth and origin configuration where the migration changes it.
- Use each developer's own npm configuration. Never create, replace, print or copy credentials.
