# Abhishek Soni portfolio — publishing

The live site is the ready-built `docs/` folder. GitHub Actions publishes it
directly; it does not build the older source folders that may remain in this repo.

1. In repository Settings → Pages, select **GitHub Actions** as the source.
2. Keep `.github/workflows/deploy.yml` and `tools/check_site.py` from this update.
3. Replace `docs/` with the latest prepared docs folder. Use GitHub Desktop to
   review changes, commit to main and Push origin. Preserve the hidden `.nojekyll`.
4. Check Actions for a successful deployment before checking the public site.

For future content updates, use `/#/editor`, save and download the website ZIP.
Unzip it, then run the separately supplied **Prepare Future Update.command**
tool on its docs folder. Upload only the resulting UPLOAD-TO-GITHUB contents.
Do not upload the ZIP itself, dated backups, node_modules or duplicate public media.
Keep original master images and complete editor backups outside this repository.

The preparer removes unused generated uploads, converts referenced PNG images to
WebP, updates export references, and produces a complete editor-importable backup.
Existing WebP and JPEG images are not recompressed. Films should stay on YouTube
or Vimeo and use the editor's external-video option.

The checks use a deliberate 25 MiB per-file safety threshold and 200 MiB website
budget. They do not increase GitHub's limits or remove historical Git objects.
Images can be optimized, and large media can be hosted externally as work grows.

If changing application code, use the matching source from the latest complete
editor backup, rebuild it, and prepare its new docs. Editing old src files alone
does not update the live site under this publishing arrangement.
