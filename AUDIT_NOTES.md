# Audit Artifacts & Repository Hygiene Notes

## Raw Audit Outputs & Network Traces
Diagnostic tools such as Google Lighthouse, Chrome DevTools, and network recording proxies capture complete HTTP request/response transcripts during page execution.

When auditing pages containing third-party embeds (such as Google Maps or YouTube iframes), the embed provider's servers automatically transmit public, client-side identifiers (such as Google's generic public client key embedded in `google.com/maps/embed`).

If committed to Git, these raw diagnostic JSON/HAR dumps trigger automated secret-scanning alerts (e.g., GitHub Secret Scanning, GitGuardian, TruffleHog), even though the repository owns no such key, does not use it, and has zero dependency on it.

## Best Practices
1. **Never commit raw diagnostic outputs:** All raw Lighthouse JSON reports (`audit-artifacts/*.json`), HAR captures (`*.har`), and network traces (`*.trace`) are excluded via `.gitignore`.
2. **Store raw traces locally or outside Git:** Keep raw audit dumps on local disk or in a gitignored folder. Only commit human-readable markdown summaries (`AUDIT_REPORT.md`) and visual screenshot captures (`.png`) that contain no secrets.
3. **Pre-commit scanning:** Run pre-commit checks locally before pushing to catch any accidental commits containing key-like tokens or raw network logs.
