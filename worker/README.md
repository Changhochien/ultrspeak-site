# Download delivery

The first-party routes `/download/macos` and `/download/windows` read a small
release manifest from the `ultrwispr-updates` R2 bucket, record one structured
Workers Logs event, and stream the signed installer from R2.

The macOS update resolver is host-independent. It serves the same allowlisted
R2 objects from Workers.dev now and from a custom Worker hostname later:

- `/download/macos-test` reads `downloads/macos/test/latest.json`.
- `/updates/macos/test/appcast.xml` streams `macos/test/appcast.xml`.
- `/updates/macos/test/releases/<file>` streams immutable test artifacts.
- `/updates/macos/stable/*` serves the stable equivalents.
- `/macos/<channel>/*` is retained as a compatibility alias for existing
  stable, beta, canary, and test feed configurations.

The first Tauri canary uses the same R2 binding through the deployed test
Worker origin, `https://ultrspeak-site-preview.hcchangdesign.workers.dev`:

- `/tauri/<channel>/latest.json` serves one shared Tauri updater manifest.
- `/tauri/<channel>/<target>/<arch>/releases/<version>/<sha256>/<file>`
  serves an immutable, content-addressed updater artifact.

`<channel>` is exactly `canary`, `beta`, or `stable`. The only supported
target/architecture/file combinations are `darwin/aarch64/*.app.tar.gz`,
`windows/x86_64/*-setup.exe`, and `linux/x86_64/*.AppImage`. Candidate
manifests, detached `.sig` files, private metadata, unsupported pairs,
traversal, nested file paths, and directory listings are never routed.
Every rejected `/tauri/*` path fails closed in the Worker instead of falling
through to the static asset binding.

The test lane is intentionally separate from `stable`. Only signed, notarized,
stapled, Sparkle-signed builds may be published. Attaching a custom domain adds
a hostname; it does not replace R2 keys or permit removing Workers.dev routes
embedded in existing test builds.

No IP address, user agent, referrer, cookie, account identifier, or arbitrary
query value is written to the download log. The `source` query parameter is
restricted to a short placement identifier such as `footer_mac`.

The Cloudflare account has not enabled Analytics Engine yet. Once enabled, the
same ordered event fields can be moved to an `analytics_engine_datasets`
binding without changing the public download routes.

## R2 layout

```text
downloads/
  macos/
    stable/
      latest.json
    test/
      latest.json
  windows/
    stable/
      latest.json
macos/
  release-build-floor.json   # private ordinary-release high-water authority
  release-builds/
    200.json                 # private immutable per-build reservation
  stable/
    appcast.xml
    releases/
      Ultrwispr-0.1.0-1.dmg
      Ultrwispr-0.1.0-1.html
      Ultrwispr-0.1.0-1.dmg.sha256
  test/
    appcast.xml
    releases/
      Ultrwispr-0.1.1-test.1.dmg
windows/
  stable/
    releases/
      Ultrwispr-0.1.0-x64-setup.exe
tauri/
  canary/
    latest.json
    darwin/aarch64/releases/0.2.0-canary.1/<sha256>/Ultrwispr.app.tar.gz
    windows/x86_64/releases/0.2.0-canary.1/<sha256>/Ultrwispr-setup.exe
    linux/x86_64/releases/0.2.0-canary.1/<sha256>/Ultrwispr.AppImage
```

Example `latest.json`:

```json
{
  "version": "0.1.0",
  "build": 200,
  "objectKey": "macos/stable/releases/Ultrwispr-0.1.0-1.dmg",
  "fileName": "Ultrwispr-0.1.0-1.dmg",
  "contentType": "application/x-apple-diskimage",
  "sha256": "64-lowercase-hex-characters"
}
```

The app publisher conditionally creates the DMG, notes, and checksum first,
compare-and-swaps `latest.json`, and compare-and-swaps `appcast.xml` last.
Release metadata is local evidence and is never routed publicly. An identical
versioned object is an idempotent retry; different bytes at an existing key are
rejected.

```sh
curl -fsSI https://<host>/updates/macos/stable/appcast.xml
curl -fsS -H 'Range: bytes=0-1023' -o /dev/null -D - \
  https://<host>/updates/macos/stable/releases/Ultrwispr-0.1.0-1.dmg
```

Update routes accept only `GET` and `HEAD`. Versioned release routes allow only
`.dmg`, `.html`, and `.dmg.sha256` filenames, reject traversal/nested paths,
support one HTTP byte range with `If-Range`, and return immutable cache headers.
Appcasts are low-cache, atomically read, validator-aware, and deliberately
ignore ranges. HTML notes are sandboxed and cannot fetch third-party resources.
Update responses carry `X-Ultrspeak-Update-Route: 1`; the publisher probes this
marker before packaging so a typo or unbound hostname cannot be embedded.
`If-Range` accepts only an exact strong ETag; wildcards, weak validators, lists,
and stale values fall back to a full `200` response.
Never publish an ad-hoc, unsigned, unstapled, or non-notarized build.

Tauri manifests use atomic R2 reads, JSON content type, ETag revalidation,
`no-cache, max-age=60`, and no range support. Tauri artifacts use one-year
immutable caching and the same single-range/strong-`If-Range` contract as the
Sparkle artifacts. Tauri routes accept only `GET` and `HEAD`, return
`X-Ultrspeak-Update-Route: 1`, and mark missing objects and R2 failures without
disclosing bucket contents. Canary may use the test Worker origin; beta and
stable retain the project-owned production origin policy.
