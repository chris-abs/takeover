# Handover

After the audit, the orchestrator turns the subagents' reports into a handover the user can act on. It is the only output the skill writes. The reports are the evidence; the explanation is the orchestrator's.

## Inputs

Only the subagents' replies. Read each in full. Never re-audit the app to fill a gap; name the gap instead.

If a reply is missing, or its frontmatter doesn't match [contract.md](contract.md), say so in the handover and carry on with the others.

## Running again

If `output/legacy-audit/<app>/` already holds a handover, rename it to `output/legacy-audit/<app>-<YYYY-MM-DD>/` before writing (add `-2`, `-3` if that exists). Then list every ticked box in the old one by ID. For each ID the new reports still propose, tick it in the new handover only if the proposal's text is unchanged; otherwise leave it unticked and tell the user it changed. Name any ticked ID that no longer appears.

## Files

### `README.md`

The overview. In this order:

1. **Where things stand:** one short paragraph. The app, the commit assessed, which audits ran and whether each completed.
2. **What we found:** one line per audit, from its `headline`, in plain language.
3. **What to review, in order:** a numbered list. Each item names the decision, how many boxes it involves, and links to the section of the audit file where the boxes are. Put first whatever blocks the most later work. Test protection comes before the changes it protects.
4. **Needs your input:** every `needs_input` item across the audits, each with what to do and what it blocks. Leave the section out when there are none.
5. **Where the audits meet:** findings two audits both reported, kept once under the audit that owns it, and any tension between their proposals (for example, a test runner one audit keeps and another replaces). Say which audit owns the decision. Leave the section out when there's none.
6. **Next step:** how to start the build phase once the review is done.

Link each audit's file.

### `<subagent>.md`

One per audit that replied. It opens with the reply's frontmatter, unchanged. Then two parts:

**The explanation**, for a reader who hasn't seen the report:

1. **What this audit looked at**, in one or two sentences.
2. **What it found:** the key findings, confirmed first, then suspected, each labelled. Use the report's numbers exactly.
3. **What it proposes:** the proposals as a short list, grouped the way a reviewer would weigh them. Link each group to its boxes below.
4. **What to decide:** what ticking or leaving a box means here, and anything worth knowing before deciding.
5. **What it doesn't prove:** the limits the report states.

**The report**, under `## Report`: the reply's body, unedited, approval boxes included. Shift its headings down so none is higher than `###`, and change nothing else. This is where the user ticks, and what `build-tests` reads.

What each explanation must cover:

| Subagent | Must cover |
|---|---|
| `audit-tests` | its branch (A, B or C) and why; current versus proposed seams, files and coverage; the setup that approving the seams brings with it |
| `audit-icl` | the classification; item counts by rating in each table; the main ICL gaps |
| `audit-framework` | the status; the recommended target versions and why; the proposed commits in order |

## Writing

- Plain language. Explain a term the first time you use it, or link where the report defines it.
- Short paragraphs and lists. A table only for counts.
- The explanation holds no boxes. Boxes appear once, in the report part, as the subagent wrote them.
- Never add findings, numbers or recommendations the reports don't contain.
- Never commit the handover.
