#!/usr/bin/env python3
"""Check exported portfolio files before deployment. Standard library only."""
import base64
import json
from pathlib import Path
import sys

MIB = 1024 * 1024


def strings(value):
    if isinstance(value, str):
        yield value
    elif isinstance(value, dict):
        for child in value.values():
            yield from strings(child)
    elif isinstance(value, list):
        for child in value:
            yield from strings(child)


def check(root):
    root = Path(root).resolve()
    errors = []
    for name in ['index.html', '.nojekyll', 'content.json', 'export-seed.json']:
        if not (root / name).is_file():
            errors.append(f'Missing required file: {name}')
    if errors:
        raise ValueError('\n'.join(errors))
    files = [f for f in root.rglob('*') if f.is_file()]
    for file in files:
        if file.stat().st_size >= 25 * MIB:
            errors.append(f'File reaches browser-upload safety limit of 25 MiB: {file.relative_to(root)}. Use a hosted video link or optimize the image.')
    total = sum(f.stat().st_size for f in files)
    # Deliberate project budget, well below the Pages 1 GB published-site limit.
    if total > 200 * MIB:
        errors.append('Website exceeds the chosen 200 MiB budget. Move large media to external hosting.')
    content = json.loads((root / 'content.json').read_text())
    seed = json.loads((root / 'export-seed.json').read_text())
    for path in set(seed['assets']) | {s for s in strings(content) if s.startswith(('media/', 'images/', 'videos/'))}:
        target = (root / path).resolve()
        if not target.is_relative_to(root) or not target.is_file():
            errors.append(f'Missing or unsafe local asset: {path}')
    for section, name in [('source', 'src/data/content.json'), ('website', 'content.json')]:
        if json.loads(base64.b64decode(seed[section][name])) != content:
            errors.append(f'Editor export template is out of sync: {section}/{name}')
    if errors:
        raise ValueError('\n'.join(errors))
    if len(files) > 100:
        print('NOTE: More than 100 files. Use GitHub Desktop or separate browser upload batches.')
    print(f'PASS: {len(files)} website files, {total / MIB:.2f} MiB; all local project media and export-template references exist.')


if __name__ == '__main__':
    try:
        check(sys.argv[1] if len(sys.argv) > 1 else 'docs')
    except Exception as error:
        print(f'Website check failed: {error}', file=sys.stderr)
        sys.exit(1)
