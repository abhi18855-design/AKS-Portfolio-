# Portfolio website + visual editor

## Files
- `index.html` — portfolio website
- `editor.html` — visual content editor
- `content.json` — editable site content used by both pages

## Publish on GitHub Pages
1. Extract this ZIP.
2. Open your GitHub repository.
3. Upload **all files and folders inside** this folder to the repository's root (not the ZIP itself).
4. Commit the changes.
5. In GitHub, open **Settings → Pages** and publish from the `main` branch and `/ (root)` if Pages is not already enabled.
6. Open the published site URL. Use `/editor.html` to access the editor.

## Editing content
Use the visual editor to change project/site content, then click **Download content.json**. Replace the existing `content.json` in your GitHub repository with the downloaded file and commit the change to publish the updates.

## Important
The original uploads contained HTML source displayed as formatted text, so the files have been reconstructed as actual HTML documents. The source references an `images/` folder, but that folder was not included in the supplied files; add your image assets at the referenced paths if you have them. The site uses external CDN/font resources and therefore needs an internet connection for all styling/icons to load.
