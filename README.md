# ASTRA — Abhishek Soni

A dependency-free portfolio and browser editor, built for one GitHub repository named `portfolio` and one GitHub Pages deployment. Node 22+ builds static, refresh-safe pages. The public site has no framework runtime.

## Current handoff

Built locally. **GitHub authentication and live deployment are still pending.** Do not treat a local preview or a successful mock API test as live publishing verification.

The three supplied projects are visibly labelled independent concept studies, reused from the earlier local portfolio. Contact information is abhi18855@gmail.com and 7999198545. Social links can be added in the editor.

## Add and publish a project

1. Open `/portfolio/editor/`. Choose **New project** and fill out its details.
2. Select multiple gallery images. The browser creates WebP files up to 1920 px (or 1600 px), plus 560 px thumbnails. Adjust quality from 60–92%. No unprocessed original is sent to GitHub.
3. Drag images or use arrow buttons to reorder them. Add image descriptions, choose a cover and optionally feature the project.
4. Use **Preview project**. Drafts and optimized uploads autosave in IndexedDB on this browser/device. **Save draft** keeps a project hidden from the public site.
5. In **Publishing**, connect using a fine-grained GitHub token for only the `portfolio` repository: Contents read/write, Actions read, Metadata read. The token stays in memory; reconnect after a reload. Never paste tokens into chat or commit them.
6. Choose **Publish this project**, then confirm the publication summary. All saved changes are committed together. The editor reports upload, commit, build and live verification states separately. Wait for **Live verified**.

**Publish changes** preserves each project’s draft/published status. Deletions and moves to draft affect the live site only after publishing. Homepage, About, Contact and footer social links are under **Website content**.

## Initial deployment

Connect GitHub first. With an authenticated GitHub CLI and Git installed, run from this directory:

```
node scripts/deploy.mjs
```

Optional `GH_BIN` and `GIT_BIN` specify executable paths. The script confirms the signed-in account, runs tests/build, creates a public `portfolio` repository, pushes source, enables GitHub Pages with Actions and starts deployment. It refuses to overwrite an existing repository. If bootstrap stops after repository creation, inspect and resume the completed steps rather than recreating the repository.

The initial setup credential needs repository creation, source/workflow writing and Pages administration access. **Do not use that broad setup credential in the editor**; the editor only needs the repository permissions described above. Revoke temporary setup access after deployment if appropriate.

The workflow is `.github/workflows/deploy.yml`. The expected production routes are the repository Pages root and its `editor/` subdirectory. Verify them after deployment rather than assuming they are live.

## Drafts, media and storage

- IndexedDB stores content and optimized pending image Blobs. Clearing browser data can remove unpublished work; download backups in Publishing.
- A public repository makes committed draft text accessible on GitHub. Drafts and draft-only images are excluded from the generated website.
- One atomic Git commit includes content and new optimized files. Content conflicts are rejected, and reference updates never force-push.
- Public pages load images lazily; the project collection and editor use progressive loading/pagination. The public catalog includes only cover metadata; complete galleries live on individual static pages.
- Uploads accept JPEG, PNG, WebP and AVIF. SVG, animated GIF, HEIC, corrupt files, originals above 40 MB and decoded images above 60 megapixels are rejected. Encoded large images have a 3 MB ceiling. Processing is sequential to bound memory.
- The dashboard shows referenced bytes and GitHub’s repository-size estimate. Warning begins at 750 MB; publishing stops at an estimated 900 MB. GitHub history retains old images, so deletion does not reclaim history storage. See [GitHub Pages limits](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits).
- Media records carry `src`, `thumb`, sizes and dimensions. Both local media paths and HTTPS URLs work, allowing an external storage upload adapter later.
- Keep this repository dedicated to the editor; avoid third-party scripts on the editor origin. The content security policy limits scripts to local files and API connections to GitHub.

## Development

```
node --test tests/*.test.mjs
node scripts/build.mjs
node scripts/serve.mjs
```

`content/site.json` is the structured source, `media/` holds optimized files, `src/` contains the reusable renderer and editor, and `dist/` is generated and ignored by Git. There are no npm dependencies or installation steps.
