# Simple portfolio editor

## Install this upgrade once
Extract the complete website ZIP. Upload its contents to the repository root, preserving `src`, `public`, `scripts` and the other folders. Include the updated `package.json`. On Mac, press Command + Shift + . to show `.pages.yml` and `.github`. Keep those deployment files in GitHub. Commit and wait for Actions to succeed.

Open https://abhi18855-design.github.io/Netflix-Portfolio-Site/editor.html

The editor's content snapshot is regenerated during every build, so project-only uploads also refresh the editor. No backend or GitHub login is required by the editor.

## Everyday workflow
1. Choose Site Content, Projects, Media / Images, or Settings.
2. Make edits and inspect media previews.
3. Click **Save Changes**. This stores edits in this browser, not on the live website.
4. Download the full website ZIP or the selected project's update ZIP.
5. Extract the ZIP, upload its contents at the GitHub repository root, and commit. Do not upload the ZIP itself or its enclosing folder.
6. Wait for Actions to finish, then refresh your site and editor.

Download a saved editing backup in Settings before clearing browser data or switching devices. A new deployment starts from its freshly built content; backups let you recover older unpublished changes. Keep one editor tab open to avoid overwriting your own saved drafts.

## Project packages
Existing Markdown paths stay unchanged. New projects use `src/content/projects/<project>/index.md`; new project assets use `public/media/projects/<project>/`. The package contains that project's Markdown, referenced local assets and its category data. Astro's existing recursive collection loader is the project index: adding a Markdown file automatically adds the project to listings and routes. Other project data files are not exported.

Project deletion exports an unpublished, deleted record at the original path. This removes the project on the next build without requiring file deletion in GitHub. Restore it from its project selector entry if needed. Media removed from a gallery stays available in the library until safely removed.

If you edit shared site text or other projects, export them separately or use the complete ZIP. A single project package does not publish other saved edits. To actually reclaim space after removing unused media, manually delete the paths listed in `REMOVED-MEDIA.txt` from GitHub; ordinary file uploads cannot delete existing files.

## Media
JPEG, PNG, WebP and AVIF uploads are supported. Large images are resized to at most 1920px on the long edge and usually exported as WebP; aspect ratio and transparency are preserved. Images already below 350 KB and within that size are kept. Compression targets visual quality rather than a guaranteed size. PNG/JPEG replacements should use a newly uploaded path if optimization changes the file format. SVG and animated uploads are not optimized by this editor; existing SVG assets remain untouched.

YouTube URLs use the existing click-to-play player. Direct HTTPS MP4/WebM URLs and uploaded MP4/WebM videos are also supported. Uploaded videos are limited to 24 MB and are not transcoded. Use YouTube for larger files. External image links must point directly to a publicly accessible HTTPS image; Drive sharing pages are not direct images.

Use Site Content's optional hero fields to override the featured project's headline/description. Blank fields keep the existing hero. Optional Services appear on About only when added. The public website's existing CSS, animations, routes, text and project content are preserved by this upgrade.

The editor and its source snapshot are public, like the repository. Do not store private project drafts or credentials in a public repository. Visitors cannot publish changes without your GitHub access.


## Selected Work and optional categories

Published controls whether a project page exists. Show in Selected Work independently controls homepage inclusion. Use the arrows in Selected Work to set its persistent sequence; the existing Display order controls the archive and does not change the Main Highlight. New projects start uncategorised and excluded from Selected Work.

Manage optional categories in Settings. Rename a category without changing its ID. Delete category clears its project assignments and preserves every project; a deleted category record is retained internally so upload-based updates can apply the deletion reliably. Existing categories are retained as editable entries, not enforced presets.

Save Changes persists the draft in this browser. Currently published Selected Work shows the deployed source, separately from the saved draft. Reopening after deployment merges nonconflicting saved edits with new published content; conflicts download a backup and ask which version to retain.

Install these fixes once using the complete website source. Thereafter Download Project Update includes all saved content records (including ordering and category changes) and pending uploads. Extract into the repository root, commit and wait for the existing GitHub Pages deployment. Saving alone does not publish. No publishing credentials or backend have been added.
