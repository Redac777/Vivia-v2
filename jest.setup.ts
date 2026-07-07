// Charge le fichier .env dans process.env AVANT les tests, sans dépendance externe.
// Utilité : les tests d'intégration lisent les identifiants Supabase depuis process.env.
// En CI, il n'y a pas de .env → les variables restent absentes → les tests réseau se skippent.
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

// @supabase/supabase-js instancie un client realtime qui exige un WebSocket global (absent en Node < 22).
// L'auth (gotrue) n'utilise QUE fetch, jamais le websocket : un stub inerte suffit pour que
// createClient ne lève pas au démarrage en test. En production React Native, WebSocket existe déjà.
const globalWithWs = globalThis as unknown as { WebSocket?: unknown };
if (typeof globalWithWs.WebSocket === 'undefined') {
  globalWithWs.WebSocket = class {};
}

const envPath = resolve(__dirname, '.env');
if (existsSync(envPath)) {
  for (const rawLine of readFileSync(envPath, 'utf8').split('\n')) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const eq = line.indexOf('=');
    if (eq === -1) continue;
    const key = line.slice(0, eq).trim();
    const value = line.slice(eq + 1).trim();
    // Ne pas écraser une variable déjà définie dans l'environnement réel.
    if (!(key in process.env)) process.env[key] = value;
  }
}
