#!/usr/bin/env python3
"""
Pre-commit hook to detect secrets, raw diagnostic dumps, and sensitive API keys.
Zero-dependency, cross-platform (macOS / Linux / Windows).
"""

import sys
import subprocess
import re
import os

def mask(val):
    if len(val) <= 8:
        return val[:2] + "..." + val[-2:]
    return val[:6] + "..." + val[-2:]

# File extensions/patterns that should never be staged
FORBIDDEN_FILE_PATTERNS = [
    r"audit-artifacts/.*\.json$",
    r"\.har$",
    r"\.trace$",
    r"\.network-dump$",
    r"\.env$",
    r"\.env\.local$",
    r"\.env\.production$",
]

# Sensitive content patterns: (regex, description, allowed_whitelist_regex)
SECRET_PATTERNS = [
    (
        r"AIza[0-9A-Za-z_-]{35}",
        "Google API Key",
        None
    ),
    (
        r"AKIA[0-9A-Z]{16}",
        "AWS Access Key ID",
        None
    ),
    (
        r"gh[pousr]_[0-9A-Za-z]{36}",
        "GitHub Personal Access Token",
        None
    ),
    (
        r"-----BEGIN (?:RSA|EC|DSA|OPENSSH|PRIVATE) KEY-----",
        "Private Key Header",
        None
    ),
    (
        r"re_[A-Za-z0-9_-]{20,}",
        "Resend API Key",
        r"re_(?:your_api_key_here|test_placeholder_key)"
    ),
    (
        r"sk_live_[0-9a-zA-Z]{24,}",
        "Stripe / Live Secret Key",
        None
    )
]

def get_staged_files():
    try:
        cmd = ["git", "diff", "--cached", "--name-only", "--diff-filter=ACM"]
        out = subprocess.check_output(cmd, encoding="utf-8", errors="ignore")
        return [f.strip() for f in out.splitlines() if f.strip()]
    except Exception as e:
        print(f"[pre-commit] Error inspecting git staged files: {e}", file=sys.stderr)
        return []

def get_staged_content(filepath):
    try:
        return subprocess.check_output(
            ["git", "show", f":{filepath}"],
            encoding="utf-8",
            errors="ignore"
        )
    except Exception:
        return ""

def main():
    staged = get_staged_files()
    if not staged:
        sys.exit(0)

    violations = []

    for filepath in staged:
        # Check 1: Forbidden file paths (raw traces, environment secrets)
        for pattern in FORBIDDEN_FILE_PATTERNS:
            if re.search(pattern, filepath, re.IGNORECASE):
                violations.append(
                    f"Blocked File: '{filepath}' matches forbidden pattern '{pattern}'. "
                    f"Raw diagnostic traces and .env files must remain gitignored."
                )

        # Check 2: Content scan
        content = get_staged_content(filepath)
        if not content:
            continue

        for regex, desc, whitelist in SECRET_PATTERNS:
            for match in re.finditer(regex, content):
                val = match.group(0)
                if whitelist and re.match(whitelist, val):
                    continue  # documented placeholder
                masked_val = mask(val)
                violations.append(
                    f"Blocked Secret in '{filepath}': Detected {desc} ({masked_val})."
                )

    if violations:
        print("\n=======================================================", file=sys.stderr)
        print("  ❌ PRE-COMMIT CHECK FAILED: Potential Secrets Detected", file=sys.stderr)
        print("=======================================================", file=sys.stderr)
        for v in violations:
            print(f"  • {v}", file=sys.stderr)
        print("\nPlease unstage or remove sensitive values before committing.", file=sys.stderr)
        print("To bypass if this is a verified false-positive: git commit --no-verify\n", file=sys.stderr)
        sys.exit(1)

    sys.exit(0)

if __name__ == "__main__":
    main()
