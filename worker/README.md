# Download delivery

The first-party routes `/download/macos` and `/download/windows` read a small
release manifest from the `ultrwispr-updates` R2 bucket, record one structured
Workers Logs event, and stream the signed installer from R2.

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
  windows/
    stable/
      latest.json
macos/
  stable/
    releases/
      Ultrwispr-0.1.0-1.dmg
windows/
  stable/
    releases/
      Ultrwispr-0.1.0-x64-setup.exe
```

Example `latest.json`:

```json
{
  "version": "0.1.0",
  "objectKey": "macos/stable/releases/Ultrwispr-0.1.0-1.dmg",
  "fileName": "Ultrwispr-0.1.0-1.dmg",
  "contentType": "application/x-apple-diskimage",
  "sha256": "64-lowercase-hex-characters"
}
```

The macOS release workflow already uploads the signed and notarized installer
to the Sparkle release prefix. It then uploads `latest.json` last so a partially
published release never becomes visible:

```sh
npx wrangler r2 object put \
  ultrwispr-updates/macos/stable/releases/Ultrwispr-0.1.0-1.dmg \
  --file /absolute/path/Ultrwispr-0.1.0-1.dmg \
  --content-type application/x-apple-diskimage

npx wrangler r2 object put \
  ultrwispr-updates/downloads/macos/stable/latest.json \
  --file /absolute/path/latest.json \
  --content-type application/json
```

Never publish an ad-hoc, unsigned, or non-notarized build through these routes.
