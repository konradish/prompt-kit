# Debugging Playbook

Use this when an LLM needs to isolate and resolve issues in code, data pipelines, or complex prompts.

## 1. Symptom Snapshot
- What breaks? Include logs, error messages, or failing tests.
- When did the issue start and what changed recently?
- What is the current impact or blast radius?

## 2. Fast Reproduction
- Minimal steps or code snippet to reproduce.
- Environment details (runtime, dependencies, feature flags).
- Expected vs. actual behavior comparison.

## 3. Hypothesis Queue
- Brainstorm 3-5 plausible root causes.
- For each, note quick checks or experiments to falsify it.
- Prioritize by likelihood and ease of testing.

## 4. Investigation Log
1. Run the highest-priority check and record findings.
2. Update the hypothesis queue based on new evidence.
3. Repeat until one hypothesis is confirmed or all are exhausted.

## 5. Fix & Verification
- Proposed fix with rationale.
- Tests or validation steps to run immediately.
- Rollback or mitigation plan if the fix fails.

## 6. Follow-up Actions
- Monitoring or alerts to add.
- Documentation or incident report updates.
- Lessons learned to prevent recurrence.

Keep the tone objective and evidence-driven so the model stays focused on facts instead of guesswork.
