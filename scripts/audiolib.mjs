// audiolib.mjs: tiny offline synth for the film's sound effects and score (no samples, everything from math).
import fs from 'fs';
export const SR = 48000, DUR = 150;
export const buf = () => [new Float32Array(SR * DUR), new Float32Array(SR * DUR)];
const rnd = (() => { let s = 12345; return () => ((s = (s * 16807) % 2147483647) / 2147483647) * 2 - 1; })();
export const mtof = m => 440 * Math.pow(2, (m - 69) / 12);
const NOTE = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
export const n = s => { const m = /^([A-G])(#|b)?(-?\d)$/.exec(s); return 12 * (+m[3] + 1) + NOTE[m[1]] + (m[2] === '#' ? 1 : m[2] === 'b' ? -1 : 0); };

// add a mono signal f(i, tSec) for `dur` seconds at time t, panned (-1..1), gain g
export function add(B, t, dur, f, g = 1, pan = 0) {
  const i0 = Math.round(t * SR), len = Math.round(dur * SR), gl = g * Math.cos((pan + 1) * Math.PI / 4), gr = g * Math.sin((pan + 1) * Math.PI / 4);
  for (let i = 0; i < len; i++) { const j = i0 + i; if (j < 0 || j >= B[0].length) continue; const v = f(i, i / SR); B[0][j] += v * gl; B[1][j] += v * gr; }
}
const env = (t, a, d) => (t < a ? t / a : Math.exp(-(t - a) / d));
// ---------- instruments ----------
export const pluck = (f, d = .9) => (i, t) => env(t, .005, d * .35) * (Math.sin(2 * Math.PI * f * t) * .7 + Math.sin(4 * Math.PI * f * t) * .25 * Math.exp(-t * 6) + Math.sin(6 * Math.PI * f * t) * .12 * Math.exp(-t * 9));
export const box = f => (i, t) => env(t, .003, .55) * (Math.sin(2 * Math.PI * f * t) + .3 * Math.sin(2 * Math.PI * f * 3.01 * t) * Math.exp(-t * 8)) * .6;
export const piano = (f, d = 1.6) => (i, t) => env(t, .006, d) * (Math.sin(2 * Math.PI * f * t) * .6 + Math.sin(4 * Math.PI * f * t) * .22 * Math.exp(-t * 3) + Math.sin(6 * Math.PI * f * t) * .1 * Math.exp(-t * 5) + Math.sin(2 * Math.PI * f * 1.003 * t) * .2);
export const pad = (f, dur) => (i, t) => Math.min(1, t / .6, (dur - t) / .8) * (Math.sin(2 * Math.PI * f * t) + .5 * Math.sin(2 * Math.PI * f * 1.005 * t + 1) + .25 * Math.sin(4 * Math.PI * f * t)) * .25;
export const bass = (f, d = .5) => (i, t) => env(t, .01, d) * Math.sin(2 * Math.PI * f * t) * (1 + .3 * Math.sin(4 * Math.PI * f * t));
export const kick = () => (i, t) => Math.exp(-t * 18) * Math.sin(2 * Math.PI * (55 + 90 * Math.exp(-t * 30)) * t);
export const tick = () => (i, t) => Math.exp(-t * 300) * rnd() * .8 + Math.exp(-t * 120) * Math.sin(2 * Math.PI * 2400 * t) * .4;
export const noise = (d, lp = .2) => { let y = 0; return (i, t) => { y += lp * (rnd() - y); return y * env(t, .01, d); }; };
export const beep = (f, dur) => (i, t) => Math.min(1, t / .005, (dur - t) / .01) * Math.sin(2 * Math.PI * f * t) * .5;
export const square = (f, dur) => (i, t) => Math.min(1, t / .01, (dur - t) / .02) * Math.sign(Math.sin(2 * Math.PI * f * t)) * .25;
export const bell = (f, d = .8) => (i, t) => env(t, .002, d) * (Math.sin(2 * Math.PI * f * t) * .6 + Math.sin(2 * Math.PI * f * 2.76 * t) * .25 * Math.exp(-t * 4) + Math.sin(2 * Math.PI * f * 5.4 * t) * .12 * Math.exp(-t * 8));
export const whoosh = (dur, up = true) => { let y = 0; return (i, t) => { const k = t / dur, c = up ? .02 + .3 * k : .32 - .3 * k; y += c * (rnd() - y); return y * Math.sin(Math.PI * Math.min(1, k)) * 1.4; }; };

export function writeWav(B, path, gain = 1) {
  const L = B[0].length, out = Buffer.alloc(44 + L * 4);
  out.write('RIFF', 0); out.writeUInt32LE(36 + L * 4, 4); out.write('WAVE', 8); out.write('fmt ', 12); out.writeUInt32LE(16, 16); out.writeUInt16LE(1, 20); out.writeUInt16LE(2, 22);
  out.writeUInt32LE(SR, 24); out.writeUInt32LE(SR * 4, 28); out.writeUInt16LE(4, 32); out.writeUInt16LE(16, 34); out.write('data', 36); out.writeUInt32LE(L * 4, 40);
  let peak = 1e-9; for (const ch of B) for (const v of ch) peak = Math.max(peak, Math.abs(v * gain));
  const norm = peak > .95 ? .95 / peak : 1;
  for (let i = 0; i < L; i++) for (let c = 0; c < 2; c++) out.writeInt16LE(Math.max(-32767, Math.min(32767, Math.round(B[c][i] * gain * norm * 32767))), 44 + i * 4 + c * 2);
  fs.mkdirSync(path.replace(/\/[^/]+$/, ''), { recursive: true }); fs.writeFileSync(path, out);
}
