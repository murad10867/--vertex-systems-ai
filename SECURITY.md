# Security Policy

## Vertex Systems AI Sites

This repository contains a static GitHub Pages website.

Security measures used by the website include:

- HTTPS enforcement on GitHub Pages.
- A restrictive Content Security Policy (CSP).
- No inline JavaScript.
- External links use `noopener noreferrer`.
- Unsafe URL schemes such as `javascript:` are blocked by the site script.
- The site refuses to render inside third-party frames.
- Repository names and descriptions loaded from GitHub are inserted with `textContent`, not raw HTML, to reduce XSS risk.
- No passwords, private API keys, service-role keys, payment secrets, or other credentials should ever be committed to this repository.

If a private credential is accidentally committed, revoke and rotate it immediately. Removing it from the latest commit alone is not sufficient because Git history may still contain it.
