"""Carga las variables de entorno en el proyecto de Pages (sin imprimir valores)."""
import json, pathlib, urllib.request

ACC = '7656f046e12521c98f381f463424a4d3'
PROJ = 'pepitos-house-251'
TOKEN = pathlib.Path('/root/.cf-api-token').read_text().strip()
DB = pathlib.Path('/root/.pepitos-neon-url').read_text().strip()
PW = pathlib.Path('/root/.pepitos-admin-pass').read_text().strip()
SS = pathlib.Path('/root/.pepitos-session-secret').read_text().strip()

def cfg():
    return {
        'env_vars': {
            'DATABASE_URL': {'type': 'secret', 'value': DB},
            'ADMIN_PASSWORD': {'type': 'secret', 'value': PW},
            'ADMIN_SESSION_SECRET': {'type': 'secret', 'value': SS},
            'SITE_URL': {'value': 'https://pepitos-house-251.pages.dev'},
        },
        # El adaptador de Cloudflare avisa que puede pedir un KV para sesiones.
        'compatibility_flags': ['nodejs_compat'],
    }

body = json.dumps({'deployment_configs': {'production': cfg(), 'preview': cfg()}}).encode()
req = urllib.request.Request(
    f'https://api.cloudflare.com/client/v4/accounts/{ACC}/pages/projects/{PROJ}',
    data=body, method='PATCH',
    headers={'Authorization': f'Bearer {TOKEN}', 'Content-Type': 'application/json'},
)
with urllib.request.urlopen(req, timeout=45) as r:
    d = json.load(r)

print('success:', d.get('success'))
for e in (d.get('errors') or [])[:4]:
    print('  error:', e.get('code'), e.get('message'))

dc = ((d.get('result') or {}).get('deployment_configs') or {}).get('production', {})
print('variables cargadas en producción:')
for k, v in (dc.get('env_vars') or {}).items():
    shown = '(secreto)' if v.get('type') == 'secret' else v.get('value')
    print(f'  {k}: {shown}')
