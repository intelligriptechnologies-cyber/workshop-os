from pathlib import Path
import secrets

path = Path(__file__).with_name('.local.env')
if not path.exists():
    path.write_text('\n'.join(f'{key}={secrets.token_hex(24)}' for key in (
        'DEV_PASSWORD', 'TEST_PASSWORD')) + '\n', encoding='utf-8')
Path(__file__).with_name('artifacts').mkdir(exist_ok=True)
print('Stage 4B local credentials ready; values not displayed.')
