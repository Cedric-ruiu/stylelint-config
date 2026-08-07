# Security Policy

## Supported versions

| Version | Supported |
| ------- | --------- |
| 2.x     | ✅        |
| 1.x     | ❌        |

## Reporting a vulnerability

Please report security issues privately through
[GitHub Security Advisories](https://github.com/Cedric-ruiu/stylelint-config/security/advisories/new),
not as a public issue.

Expect an acknowledgement within a few days. This is a single-maintainer package, so
please allow reasonable time for a fix before disclosing publicly.

## Scope

This package is a Stylelint configuration — it ships no executable code beyond a plain
config object, and it runs only in a developer's or CI environment, never in production.
The realistic attack surface is its dependency tree. Dependency updates are automated
via Dependabot, and releases are published to npm with
[provenance attestation](https://docs.npmjs.com/generating-provenance-statements).
