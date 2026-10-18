# Static Cloudflare Pages deployment

This folder is the public static website. No npm install, build step, admin portal,
Worker, database or R2 bucket is needed.

## Dashboard upload

Upload the prepared `groove101-static-site.zip` from this session, or drag this
folder into a Cloudflare Pages Direct Upload deployment. `index.html` must be at
the root of the upload. The ZIP contains only public files, excluding these notes.

## Git-connected Pages project

- Framework preset: None
- Build command: `exit 0`
- Build output directory: `.` (the folder containing `index.html`)

The existing contact form posts directly to Formspree. Existing analytics and
YouTube links/embeds also remain in place. No local server-side code is required.

The `_redirects` file preserves the old events-page redirect. Cloudflare Pages
uses the root `404.html` for missing pages, so an Apache `.htaccess` is unnecessary.

The hero image is now `images/hero-main.webp`, at its original dimensions, to stay
below the Pages file-size limit and reduce download size.

For future edits, upload a fresh copy of this folder. The prepared ZIP is a
snapshot and must be recreated after edits.

Documentation:
- https://developers.cloudflare.com/pages/get-started/direct-upload/
- https://developers.cloudflare.com/pages/framework-guides/deploy-anything/

Navigation and footer styling is shared through `site-shell.css` and `site-shell.js` across the content pages. Include these files, `site-theme.css`, `weddings.css` and `weddings.js` in every fresh upload. The historical `events.html` redirect is preserved.
