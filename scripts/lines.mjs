// lines.mjs: exports the spoken lines from src/script.js to out/voice/lines.json for the TTS batch.
//   node scripts/lines.mjs   →  {"h01": {"voice": "Sulafat", "who": "mom", "text": "...", "style": "..."}, ...}
import fs from 'fs';
import vm from 'vm';
const ctx = { SUBCOL: {}, module: undefined };
vm.createContext(ctx);
vm.runInContext(fs.readFileSync('src/script.js', 'utf8') + '\n;this.__L = LINES; this.__V = VOICES;', ctx);
const out = {};
for (const L of ctx.__L) out[L.id] = { voice: ctx.__V[L.who], who: L.who, at: L.at, text: L.text, style: L.style };
fs.mkdirSync('out/voice', { recursive: true });
fs.writeFileSync('out/voice/lines.json', JSON.stringify(out, null, 1));
console.log(`out/voice/lines.json: ${Object.keys(out).length} lines, voices: ${[...new Set(Object.values(out).map(l => l.voice))].join(', ')}`);
