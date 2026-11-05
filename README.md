# Your cinematic creative archive

A lightweight portfolio built with **Astro 7, TypeScript, Pages CMS, and GitHub Pages**. Content lives in Markdown and JSON. There is no database, custom admin server, or subscription built into this project.

The initial site contains three clearly labeled demonstration projects, original vector placeholders, and a six-second synthesized audio sample. Replace the sample name, email, biography, and projects before sharing it as your portfolio. The sample email `hello@example.com` is a placeholder.

## 1. Open the site locally

Install [Node.js 24 LTS](https://nodejs.org/) and [pnpm](https://pnpm.io/installation). In Terminal, run:

```sh
cd "$HOME/Desktop/Netflix Site"
pnpm install
pnpm dev
```

Open the local address printed in Terminal (normally `http://localhost:4321`). Keep Terminal running while you browse. Press Control-C to stop.

To check and build:

```sh
pnpm test
pnpm build
pnpm preview
```

The build produces `dist/`. Do not edit that folder: it is recreated from your source files. The lockfile pins the dependencies used by deployment. TypeScript 6 is intentional because `astro check` does not yet support TypeScript 7.

## 2. Put the repository on GitHub

The folder includes local Git metadata and an initial commit. No remote account is connected.

1. Create an **empty** GitHub repository, such as `creative-portfolio`. Do not initialize it with another README.
2. Open this folder in GitHub Desktop using **File → Add Local Repository**. Choose **Publish repository** if you have not already created one, or configure the remote for the existing empty repository.
3. Alternatively, use Terminal with your real repository URL:

```sh
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
git push -u origin main
```

Do not publish `node_modules`, `.env`, or credentials. These are ignored. The website can be hosted from a public repository; availability from a private repository depends on your GitHub plan. A public repository exposes source content, including unpublished drafts and uploaded media.

## 3. Enable GitHub Pages

1. In the GitHub repository, open **Settings → Pages**.
2. Under **Build and deployment**, choose **GitHub Actions** as the source.
3. In **Actions**, run **Deploy creative portfolio**, or push a change to `main`.
4. Wait for the build and deployment to turn green. The deployment shows your website URL.

The workflow uses the repository identity to select `https://USERNAME.github.io/REPOSITORY/`. A repository named `USERNAME.github.io` uses `/` automatically. You do not need to put your username into the source code. The workflow needs `contents: read`, `pages: write`, and `id-token: write`; these are already declared. Your account must be allowed to enable Actions and Pages.

If your deployment uses an unusual URL, set repository **Settings → Secrets and variables → Actions → Variables**:

- `SITE_URL`: the origin, such as `https://portfolio.example.com`.
- `BASE_PATH`: `/` for a custom domain, or `/repository-name` for a project site.

Local preview uses a placeholder canonical origin until a real `SITE_URL` is supplied. To reproduce repository hosting locally:

```sh
SITE_URL=https://example.com BASE_PATH=/creative-portfolio pnpm build
SITE_URL=https://example.com BASE_PATH=/creative-portfolio pnpm preview
```

Open `/creative-portfolio/` on the printed local address. Internal navigation, CMS image/audio URLs, and Markdown media are all prefixed during the build.

## 4. Connect your visual content editor

1. Visit [app.pagescms.org](https://app.pagescms.org/).
2. Sign in with GitHub and authorize the Pages CMS GitHub application for this repository.
3. Select this repository and its **main** branch.
4. Pages CMS reads `.pages.yml` and displays **Projects**, **Website settings**, **About me**, **Project categories**, and media libraries.

The content editor is separate from the public site. There is no public admin page or login to maintain. Saving in the editor commits to GitHub; the push triggers the deployment workflow. Allow the deployment to finish before expecting changes on the public site.

## 5. Add a project

1. Open **Projects → Create**.
2. Enter the title and a unique URL slug, such as `my-first-film`. Use lowercase letters, digits, and hyphens.
3. Add a short description, category, year, and cover image. Add an image description for accessibility.
4. Write the full story in **Full project description**. This supports formatted text, headings, and images.
5. Add optional media and credits as described below.
6. Turn on **Publish project**, then save.

The page is generated automatically at `/projects/my-first-film/`. Do not create a new code file. Duplicate slugs and category references to missing categories stop the build with a useful error. After publication, keep the slug stable so shared links continue working.

## 6. Upload images, audio, and video

**Images:** Use the cover/hero pickers or **Upload frames → Add item**. Each frame has an image, description, and optional caption. You can use the Images library too. Store media under `projects/my-project/` and use descriptive names. Clicking a gallery image opens an accessible full-screen viewer; Escape closes it.

**Audio:** Choose **Upload audio → Add item**, enter a track title, and upload a file. Add an optional description, cover, and external listening link. MP3 is recommended. The native player never autoplays and does not preload entire tracks. If using only an external listening link, leave the file empty.

**YouTube:** Paste a watch link, `youtu.be` share link, Shorts link, live link, or embed link into **YouTube link**. The player loads only after a visitor presses play, using `youtube-nocookie.com`. Malformed links hide the player; video availability and embedding permission are controlled by YouTube and the video's owner. The external YouTube link remains available if embedded playback is restricted. Never upload original video files into this repository.

**Résumé:** Upload a PDF from **About me → Résumé**.

Empty optional sections disappear. The three demonstration projects exercise video, gallery, and audio layouts. The video example embeds *Big Buck Bunny* (© 2008 Blender Foundation, [CC BY 3.0](https://creativecommons.org/licenses/by/3.0/)); see [the original film and license](https://peach.blender.org/about/). It is explicitly not the portfolio owner's work. No third-party artwork is downloaded into the repository.

## 7. Feature, categorize, and reorder work

- **Website settings → Featured hero project** selects the homepage hero. Select a published project.
- **Projects → Include in selected work** includes a project in the selected-work row.
- **Display order** puts smaller numbers first. Ties use newest year, then title.
- Visitors can filter categories and sort by newest or oldest on the Work page.
- Add a category in **Project categories**, then select it in a project. New categories automatically create homepage rows when they contain published work.
- Rename a category by changing its **Category name**, keeping its slug stable. Reassign affected projects before deleting a category.
- If the chosen hero is deleted or unpublished, the next featured/published project becomes the hero. If no work is published, the site shows a friendly empty state.

## 8. Unpublish or delete a project

Turn off **Publish project** and save to remove the project from navigation, related work, sitemap, and generated pages on the next deployment. Or delete the project in Pages CMS.

**Drafts are not private storage.** In a public repository the source Markdown and Git history remain visible. Files in `public/` are also deployed even when their project is unpublished, and previous versions may exist in browser/search caches. Remove unneeded media separately; deleting a project does not delete its uploads. Do not commit confidential work to a public repository.

## 9. Edit your personal information

**Website settings** contains your name, navigation wordmark, email, description, homepage introduction, hero selection, accent color, footer, contact copy, availability, location, and social links.

**About me** contains your portrait, biography, creative background, disciplines, philosophy, résumé, and professional links. Leave optional links empty to hide them. Add real social URLs; no accounts have been invented for you.

Contact uses a regular `mailto:` link and opens the visitor's configured email app. There is no form backend.

## 10. Media size and long-term storage

Practical starting targets (not hosting guarantees):

- Covers: about 1600–2000 pixels wide, preferably WebP/JPEG under 500 KB.
- Gallery images: usually 1200–2000 pixels wide, under 300–600 KB when possible.
- Audio: MP3 at an appropriate bitrate; aim below 10 MB per track. Split very long recordings or use external hosting.
- Keep original high-resolution masters elsewhere. The CMS does not automatically compress uploads.

GitHub has repository and Pages limits; check [current GitHub Pages limits](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits) before growing a large media archive. Git LFS is not configured. When assets become too large, project media fields also accept full HTTPS URLs. Move the files to object storage/CDN and replace their paths; the frontend can stay the same. The initial CMS media pickers are configured for GitHub uploads, so switching them to an external library would require a small CMS configuration change or editing those URL fields in source mode.

## 11. Backups and future changes

Git history records every saved version. Keep a second local clone and periodically back up the whole repository. Downloading a GitHub ZIP backs up the current source and media but does not include Git history. Back up original creative assets separately.

The structure is deliberately small:

```text
src/content/projects/    Project Markdown
src/content/categories/ Editable category definitions
src/data/               Website settings and About information
src/components/         Shared cards, media players, navigation
src/pages/              Public pages and one reusable project template
src/styles/global.css   Central visual styling
public/media/           Images, audio, PDFs
.pages.yml              Visual editor configuration
.github/workflows/      Automatic GitHub Pages deployment
```

To make future design changes, edit the shared components and stylesheet; the content editor does not need rebuilding.

## 12. Add a custom domain later

1. Configure the domain in repository **Settings → Pages** and follow GitHub's DNS instructions.
2. Add `public/CNAME` containing just the domain, such as `portfolio.example.com`.
3. Set repository variable `SITE_URL` to `https://portfolio.example.com` and `BASE_PATH` to `/`.
4. Redeploy. Canonical URLs, sitemap, media, and navigation use the new configuration.

## Validation and remaining account setup

See `VERIFICATION.md` for checks performed on this initial version. Local builds do not prove a live GitHub deployment or CMS account connection. You must complete GitHub authorization, Pages enablement, and the first authenticated CMS save. Then create a temporary draft, upload an image/audio track, publish it, verify the live page, and unpublish it to complete the end-to-end check.

Configuration follows the official [Pages CMS field documentation](https://pagescms.org/docs/configuration/content/fields/), [media documentation](https://pagescms.org/docs/configuration/media/), and [Astro GitHub Pages deployment guide](https://docs.astro.build/en/guides/deploy/github/).
