"""Generate ignored local rehearsal credentials without displaying them."""
from pathlib import Path
import secrets

root = Path(__file__).resolve().parent
path = root / '.local.env'
if not path.exists():
    path.write_text('REHEARSAL_PASSWORD=' + secrets.token_hex(24) + '\n', encoding='utf-8')
(root / 'artifacts').mkdir(exist_ok=True)
print('Local rehearsal configuration ready; credentials not displayed.')
