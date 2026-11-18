---
name: security
description: Writes and reviews code securely against the OWASP Top 10.  Use when building or reviewing anything that touches logins, user input, databases, APIs, file uploads, secrets, or dependencies.  Do not apply to pure static content with no code logic.
---

# Security (OWASP Top 10)

Write and review code so it defends against the most common, highest-impact attacks. Anchored on the **OWASP Top 10** — the industry-standard list of the most critical web application security risks.

## When to apply this skill

Apply whenever writing, reviewing, or modifying code that touches a security-sensitive surface: logins/authentication, sessions, passwords, user input, forms, API endpoints, database queries, file uploads, payments, or handling of user/PII data. Apply the checklist proactively on backend/web/API code even when security isn't explicitly requested.

## Checklist — enforce every item

1. **Validate and sanitize all input server-side.** Treat every external input (request bodies, params, headers, files) as untrusted; use allowlists, not denylists.
2. **Use parameterized queries / prepared statements** for all database access. Never build SQL/commands by string concatenation (prevents injection).
3. **Encode/escape output for its context** (HTML, attribute, JS, URL); prefer auto-escaping templates; avoid `innerHTML` / `dangerouslySetInnerHTML` (prevents XSS).
4. **Never hardcode secrets or credentials** in source or committed config. Load them from environment variables or a secrets manager.
5. **Enforce authentication and authorization on every protected resource**, server-side. Check the user is allowed to act on *this specific* object; deny by default.
6. **Hash passwords with a strong, slow, salted algorithm** — bcrypt, scrypt, or Argon2id. Never MD5, SHA-1, or plaintext.
7. **Use HTTPS/TLS everywhere.** Set Secure, HttpOnly, SameSite cookies; encrypt sensitive data at rest.
8. **Apply least privilege** — minimal database/service/file permissions and scoped tokens; run processes as non-root.
9. **Manage dependencies safely** — pin versions / use lockfiles, run audits (`npm audit`, `pip-audit`), and avoid abandoned or typosquatted packages.
10. **Handle errors safely** — return generic messages to users while logging details server-side; never leak stack traces, queries, or file paths.
11. **Log security-relevant events** (auth successes/failures, access denials) without logging secrets or PII; keep logs tamper-resistant.
12. **Protect against common web attacks by default** — CSRF protection on state-changing requests, rate limiting on auth endpoints, security headers (CSP), strict CORS, safe file-upload handling, and SSRF protection.

## How to respond

- **When writing code:** apply these by default, without being asked.
- **When reviewing code:** report each issue with its file/line and which risk it maps to, then state the fix.

## Sources
- OWASP Top 10: https://owasp.org/Top10/
- OWASP Cheat Sheet Series: https://cheatsheetseries.owasp.org/
- OWASP ASVS: https://owasp.org/www-project-application-security-verification-standard/