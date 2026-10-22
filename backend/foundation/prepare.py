"""Materialize ONLY the pinned backend into an ignored, isolated build context."""
import hashlib
import json
from pathlib import Path
import secrets
import subprocess

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent.parent
REVISION = "50c8aab1766b61c914e2829b460bfd1697723ec2"


def git(*args):
    return subprocess.check_output(["git", *args], cwd=ROOT)


def main():
    destination = HERE / ".generated" / "candidate"
    paths = git("ls-tree", "-r", "--name-only", REVISION, "backend").decode().splitlines()
    manifest = []
    for path in paths:
        allowed = (path.startswith("backend/app/") or path.startswith("backend/alembic/")) and path.endswith(".py")
        if not allowed and path not in {"backend/alembic.ini", "backend/requirements.txt"}:
            continue
        if "__pycache__" in path:
            continue
        data = git("show", f"{REVISION}:{path}")
        relative = Path(path).relative_to("backend")
        target = destination / relative
        if target.exists() and target.read_bytes() != data:
            raise SystemExit(f"Refusing to overwrite changed generated source: {relative}")
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_bytes(data)
        manifest.append({"path": str(relative).replace("\\", "/"), "sha256": hashlib.sha256(data).hexdigest()})
    (destination / "source-manifest.json").write_text(json.dumps({"revision": REVISION, "files": manifest}, indent=2), encoding="utf-8")
    env = HERE / ".local.env"
    if not env.exists():
        values = {key: secrets.token_hex(24) for key in (
            "DEV_OWNER_PASSWORD", "DEV_RUNTIME_PASSWORD", "TEST_OWNER_PASSWORD", "TEST_RUNTIME_PASSWORD"
        )}
        env.write_text("\n".join(f"{k}={v}" for k, v in values.items()) + "\n", encoding="utf-8")
    print(f"Prepared {len(manifest)} pinned backend files; local credentials retained without printing.")


if __name__ == "__main__":
    main()
