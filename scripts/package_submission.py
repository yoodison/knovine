"""Package only the explicit public-source allowlist. Never include runtime data."""
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
import hashlib

root = Path(__file__).resolve().parent.parent
files = [root / p for p in ['package.json', 'package-lock.json', 'vite.config.js', 'index.html', 'README.md', '.gitignore', '.env.example']]
for folder in ['src', 'server', 'tests', 'docs', 'scripts']:
    files.extend(p for p in (root / folder).rglob('*') if p.is_file() and not p.is_symlink() and p.suffix in {'.js', '.jsx', '.css', '.md', '.py'})
files = sorted(set(p for p in files if p.is_file() and not p.is_symlink()))
out = root / 'output' / 'knovine-source-review.zip'
out.parent.mkdir(exist_ok=True)
with ZipFile(out, 'w', ZIP_DEFLATED) as archive:
    for path in files:
        archive.write(path, 'knovine/' + path.relative_to(root).as_posix())
with ZipFile(out) as archive:
    for name in archive.namelist():
        parts = Path(name).parts
        assert not any(p in {'data', 'node_modules', 'dist', '.git'} for p in parts)
        assert not Path(name).name.startswith('.env') or Path(name).name == '.env.example'
print(f'Created {out.name}: {len(files)} source files, {out.stat().st_size} bytes')
print('SHA-256:', hashlib.sha256(out.read_bytes()).hexdigest())
