# GitHub Pages Deployment Reflection

## Outcome

The currency-converter PWA is now successfully hosted via GitHub Pages and installable on mobile as a standalone app.

---

## Key Setbacks & How We Resolved Them

| Setback | Cause | Resolution |
|---------|-------|------------|
| **Blank page / white-screen** after first deploy | Asset paths in `index.html`, `manifest.json`, and service-worker registration used absolute `/` prefixes. When a site is served from `/<user>/<repo>/` these resolve to the root domain and 404. | Converted every path to **relative** (`./…`), added `<base href="./">`, and updated the script tag to `_expo/static/js/…` without a leading slash. |
| **`_expo` assets ignored** | GitHub Pages runs Jekyll by default; it excludes folders that start with an underscore. | Added an empty `.nojekyll` file to the branch root to disable Jekyll processing. |
| **Routing / deep-link 404s** | Browsers request `/some/path` which GH Pages treats as a real file. | Added a simple `404.html` that redirects back to `index.html`, letting our client-side code handle the route. |
| **Service-worker & manifest still used absolute paths** | Missed during the first fix pass. | Patched to relative paths and added `<base href="./">` to the `manifest.json` and service-worker registration. |