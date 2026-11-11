# framework-insights: decisions

- Audit only. Never change the app's code, manifest, lockfile, `node_modules` or registry configuration. Tools are installed outside the app.
- Write the report only to the report directory. Raw evidence, configs, logs, downloaded packages and probe code stay in the external work directory from `prepare-output.mjs`. Never copy them into the app or the report.
- Choose the smallest supported set of upgrades. Keep packages that are already compatible. Router and Redux majors follow actual compatibility constraints; React 18 alone doesn't require them.
- Select versions from current registry metadata and the app's own requirements, never from examples, reference apps or another developer's installed versions. An app already on a supported newer React isn't downgraded.
- A restrictive peer declaration isn't proof of failure, and a successful install or another app's build isn't proof of runtime compatibility. Investigate to a conclusion instead of handing back "check compatibility".
- Investigation the agent can do is never a question for the user. "Needs your input" is only for missing access, unavailable resources or a genuine organisational decision.
- Each proposed commit is one reviewable concern that leaves the app installable and buildable. The user approves or rejects each commit.
- Don't check backend, VPN, CORS or local login health. Preserve auth and origin configuration where the migration changes it.
- Use each developer's own npm configuration. Never create, replace, print or copy credentials.
