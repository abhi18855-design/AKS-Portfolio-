# ASTRA — AKS-Portfolio-

Read **START HERE.txt** for the one-time replacement upload. This package replaces the old public entry points and provides the full browser editor.

Source: src/, content/, media/, scripts/. GitHub Actions rebuilds dist/ and deploys it. The ready-built root and docs copies are for initial manual upload; after switching to Actions the workflow output is authoritative.

Run `node --test tests/*.test.mjs` and `node scripts/build.mjs` with Node 22+. No dependencies required.
