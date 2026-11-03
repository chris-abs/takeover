# Audit workflow

Audit only. Change no production code, tests or configuration.

1. **Establish scope and evidence.** Read the app's own guidance (README, AGENTS.md or similar). Identify the test runner, test locations and harness. Run the existing tests and source-inclusive coverage; record exact commands, results and failures without fixing them.
2. **Inventory journeys.** Start from meaningful user, business or system journeys, not from uncovered files. For each: sequence, alternate and failure paths, business rules, variants.
3. **Map seams.** For each journey, name the public seams that protect its behaviour ([seam-model.md](seam-model.md)), the level needed, real and controlled collaborators, and current evidence ([coverage.md](coverage.md)). Status: covered, partial, missing, or no test needed.
4. **Judge existing tests** ([existing-tests.md](existing-tests.md)).
5. **Reconcile.** Every journey maps to a seam, a defensible no-test classification, or a named broader owner. Every credited test has an assertion that would catch the claimed regression.
6. **Report** in the layout in [output-format.md](output-format.md). Prioritised protection backlog, failures found, suspected production defects (kept separate from coverage gaps and marked unconfirmed), and what the audit does not prove.
