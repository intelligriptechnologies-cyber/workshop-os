"""Reuse the approved allowlisted release packaging in a fresh CI directory."""
import importlib.util
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
spec = importlib.util.spec_from_file_location('packaging', ROOT / 'deploy/stage49/prepare_context.py')
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)
module.DEST = ROOT / '.scratch/pipeline-context'
module.main()
