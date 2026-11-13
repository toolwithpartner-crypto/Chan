// dialog.mjs: places every voice file (out/voice/raw/<id>.wav) on the film so its first syllable lands at the line's `at`
// (src/script.js), levels them all to one loudness, and writes
//   out/audio/dialogue.wav   48 kHz stereo, the film's length
//   src/dialog.js            DIALOG rows [t0, who, env, id] (env = mouth level 0-9 per 1/24 s) + SPEAK(who, t) for lip-sync
// It also warns when a line runs into the next line of a different speaker.   usage: node scripts/dialog.mjs
import fs from 'fs';
import { execFileSync } from 'child_process';
const lines = JSON.parse(fs.readFileSync('out/voice/lines.json', 'utf8'));
const DUR = 150, FPS = 24, SR = 24000, TARGET = -20;
const rows = [], inputs = [], filt = [], meas = [];
let i = 0;
for (const [id, L] of Object.entries(lines)) {
  const f = `out/voice/raw/${id}.wav`;
  if (!fs.existsSync(f)) { console.log('missing', f); continue; }
  const pcm = execFileSync('ffmpeg', ['-loglevel', 'error', '-i', f, '-f', 'f32le', '-ac', '1', '-ar', String(SR), '-'], { maxBuffer: 1 << 28 });
  const x = new Float32Array(pcm.buffer, pcm.byteOffset, pcm.length / 4), hop = SR / FPS, env = [];
  for (let s = 0; s < x.length; s += hop) { let e = 0; for (let j = s; j < Math.min(s + hop, x.length); j++) e += x[j] * x[j]; env.push(Math.sqrt(e / hop)); }
  const p90 = [...env].sort((a, b) => a - b)[Math.floor(env.length * .9)] || 1e-6;
  let lv = env.map(v => Math.min(9, Math.round(9 * Math.min(1, v / p90))));
  const on = Math.max(0, lv.findIndex(v => v >= 2)), end = lv.length - [...lv].reverse().findIndex(v => v >= 2);
  lv = lv.slice(on, end);                        // trim silence at both ends
  const trimS = on / FPS, keepS = lv.length / FPS;
  let mean = 0, n = 0; for (let j = on * hop; j < end * hop && j < x.length; j++) { mean += x[j] * x[j]; n++; } mean = 10 * Math.log10(mean / Math.max(1, n) + 1e-12);
  meas.push({ id, L, f, lv, trimS, keepS, mean });
}
meas.sort((a, b) => a.L.at - b.L.at);
let prevEnd = -1;
for (const m of meas) {
  let t0 = m.L.at;
  if (t0 < prevEnd + .12) { const d = prevEnd + .12 - t0; if (d > .6) console.log(`moved ${m.id} later by ${d.toFixed(2)} s (would talk over the previous line)`); t0 = prevEnd + .12; }
  t0 = +t0.toFixed(3); prevEnd = t0 + m.keepS;
  rows.push([t0, m.L.who, m.lv.join(''), m.id]);
  inputs.push('-i', m.f);
  filt.push(`[${i}:a]atrim=${m.trimS.toFixed(3)}:${(m.trimS + m.keepS + .12).toFixed(3)},asetpts=PTS-STARTPTS,aresample=48000,volume=${(TARGET - m.mean).toFixed(2)}dB,adelay=${Math.round(t0 * 1000)}:all=1[a${i}]`);
  i++;
}
for (let k = 0; k + 1 < rows.length; k++) { const e = rows[k][0] + rows[k][2].length / FPS; if (e > rows[k + 1][0] + .05) console.log(`overlap: ${rows[k][3]} ends ${e.toFixed(2)} > ${rows[k + 1][3]} starts ${rows[k + 1][0]}`); }
filt.push(`${Array.from({ length: i }, (_, k) => `[a${k}]`).join('')}amix=inputs=${i}:normalize=0,apad=whole_dur=${DUR},atrim=0:${DUR},aformat=channel_layouts=stereo[out]`);
fs.mkdirSync('out/audio', { recursive: true });
execFileSync('ffmpeg', ['-loglevel', 'error', '-y', ...inputs, '-filter_complex', filt.join(';'), '-map', '[out]', '-ar', '48000', '-c:a', 'pcm_s16le', 'out/audio/dialogue.wav'], { stdio: 'inherit' });
fs.writeFileSync('src/dialog.js', `// dialog.js: written by scripts/dialog.mjs (do not edit). DIALOG rows [t0, who, env, id]; env = mouth level 0-9 per
// 1/24 s from t0. SPEAK(who, t): that speaker's level 0..1 at video time t, held for 1/12 s so the mouth moves like drawings.
const DIALOG = ${JSON.stringify(rows)};
function SPEAK(who, t) {
  const q = Math.floor(t * 12) / 12;
  for (const [t0, w, env] of DIALOG) {
    if (w !== who || q < t0) continue;
    const i = Math.floor((q - t0) * 24);
    if (i < env.length) return Math.max(+env[i], +(env[i + 1] || 0)) / 9;
  }
  return 0;
}
`);
console.log(`out/audio/dialogue.wav + src/dialog.js: ${i} lines placed`);
