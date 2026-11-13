// music.mjs: the score, written as code and synthesized offline → out/audio/music.wav. usage: node scripts/music.mjs
// An original little theme in C (four bars: C–G–Am–F) that changes with the story:
//   0–12 hook, unsettled (low pulse, a music box asking a question) · 12–38 playful plucks; music-box flashback
//   38–82 warm and a bit too sweet (the admin) · 82–118 the same theme turned minor, a ticking pulse that tightens
//   118–150 sad piano, slower, ending unresolved and then resolving softly.
import { buf, add, n, mtof, pluck, box, piano, pad, bass, kick, tick, writeWav } from './audiolib.mjs';
const B = buf(), BEAT = 60 / 96;
const chord = { C: ['C3', 'E3', 'G3'], G: ['G2', 'B2', 'D3'], Am: ['A2', 'C3', 'E3'], F: ['F2', 'A2', 'C3'], Em: ['E2', 'G2', 'B2'], Dm: ['D3', 'F3', 'A3'], E: ['E2', 'G#2', 'B2'] };
const f = s => mtof(n(s)), up = (s, k) => mtof(n(s) + k);
// the theme (in beats from a bar start): note, beat, length
const THEME = [['E5', 0, 1], ['G5', 1, .5], ['A5', 1.5, .5], ['G5', 2, 1], ['E5', 3, 1], ['D5', 4, 1], ['E5', 5, .5], ['G5', 5.5, .5], ['D5', 6, 2],
  ['C5', 8, 1], ['E5', 9, .5], ['A5', 9.5, .5], ['G5', 10, 1], ['E5', 11, 1], ['F5', 12, 1], ['E5', 13, .5], ['D5', 13.5, .5], ['C5', 14, 2]];
const theme = (t0, inst, g, shift = 0, minor = false) => THEME.forEach(([s, b, l]) => { let m = n(s) + shift; if (minor && [4, 9].includes(((m % 12) + 12) % 12)) m -= 1; add(B, t0 + b * BEAT, l * BEAT + 1.2, inst(mtof(m), l * BEAT), g, .15); });
const chords = (t0, seq, beatsEach, g, inst = 'pad') => seq.forEach((c, k) => chord[c].forEach((s, j) => {
  const t = t0 + k * beatsEach * BEAT, d = beatsEach * BEAT;
  if (inst === 'pad') add(B, t, d + .4, pad(f(s), d + .4), g, j - 1); else add(B, t + j * .04, d + 1.5, piano(f(s), 1.8), g, j * .3 - .3);
}));
const bassline = (t0, seq, beatsEach, g, pattern = [0]) => seq.forEach((c, k) => pattern.forEach(b => add(B, t0 + (k * beatsEach + b) * BEAT, .6, bass(up(chord[c][0], -12), .35), g)));

// ---- hook 0–12: low pulse, music box asks a question
for (let b = 0; b < 9; b++) add(B, b * BEAT, .5, bass(f('A1'), .3), .5);
chords(3, ['Dm', 'E'], 2.4, .5);
['A4', 'C5', 'E5', 'D5', 'A4', 'C5', 'F5', 'E5', 'A4', 'C5', 'E5', 'G#4'].forEach((s, k) => add(B, 6 + k * BEAT * .75, 1.2, box(f(s)), .35, .3));
// ---- act 1 12–20: playful plucks
const P1 = 12;
chords(P1, ['C', 'G', 'Am', 'F'], 4, .28); bassline(P1, ['C', 'G', 'Am', 'F'], 4, .4, [0, 2.5]);
theme(P1, (fr, l) => pluck(fr, .9), .45);
// flashback 20–32: music box alone, soft
['C', 'G', 'Am', 'F', 'C'].forEach((c, k) => chord[c].forEach((s, j) => add(B, 20 + k * 2.4 + j * .25, 1.5, box(up(s, 24)), .22, j * .4 - .4)));
theme(25.6, (fr) => box(fr), .3);
// 32–38: curiosity, rising arpeggio
['C5', 'E5', 'G5', 'C6', 'E6', 'G6', 'C7'].forEach((s, k) => add(B, 33.2 + k * .22, 1.2, box(f(s)), .25, .5));
chords(34, ['F', 'G'], 3, .25);
// ---- act 2 38–82: warm, a bit too sweet
for (let r = 0; r < 4; r++) { const t0 = 38 + r * 16 * BEAT * 1; chords(t0, ['F', 'G', 'Em', 'Am'], 4, .25); bassline(t0, ['F', 'G', 'Em', 'Am'], 4, .32, [0, 2]); }
theme(38.2, (fr, l) => pluck(fr, 1.1), .3);
theme(48.2, (fr, l) => box(fr), .25, 0);
theme(58.2, (fr, l) => pluck(fr, 1.1), .25, 2);              // a step higher while he spills his secret
for (let k = 0; k < 16; k++) add(B, 66.5 + k * BEAT / 2, .8, box(f(['C6', 'E6', 'G6', 'E6'][k % 4])), .25, .4);   // the bounce
// 69–82: doubt; sustained pads with a nagging minor second; the clock
chords(69, ['Am', 'Dm', 'Am', 'E'], 4, .3);
for (let k = 0; k < 10; k++) add(B, 69 + k * 1.3, 1.2, box(f(k % 2 ? 'B4' : 'C5')), .2, -.3);
// ---- act 3 82–118: the theme turned minor, ticking, tightening
for (let b = 0; b < 52; b++) { const t = 82 + b * BEAT / 2; if (t > 104) break; add(B, t, .1, tick(), .18 + .2 * (t - 82) / 22); if (b % 2 === 0) add(B, t, .5, bass(f(b % 8 < 4 ? 'A1' : 'F1'), .25), .45); }
chords(82, ['Am', 'F', 'Dm', 'E', 'Am', 'F', 'Dm', 'E'], 4, .28);
theme(86, (fr, l) => pluck(fr, .8), .3, -3, true);
for (let b = 0; b < 12; b++) add(B, 98 + b * BEAT / 3, .2, kick(), .25 + .03 * b);       // the argument: heartbeat speeds up
// 104–106 silence (the send), 106–110 a lullaby fragment as he falls asleep
['E5', 'D5', 'C5', 'D5', 'E5', 'E5', 'E5'].forEach((s, k) => add(B, 106.4 + k * .5, 1.5, box(f(s)), .22, .2));
// 110–118 the dark room: low drone and pulse
add(B, 110, 8, (i, t) => Math.min(1, t / 1, (8 - t) / 1) * (Math.sin(2 * Math.PI * 55 * t) * .5 + Math.sin(2 * Math.PI * 82.4 * t) * .25 + Math.sin(2 * Math.PI * 55.3 * t) * .3), .4);
for (let b = 0; b < 12; b++) add(B, 110 + b * BEAT, .3, kick(), .3);
// ---- act 4 118–150: sad piano
chords(118.4, ['Am', 'F', 'C', 'G', 'Am', 'F', 'C', 'G'], 4, .3, 'piano');
bassline(118.4, ['Am', 'F', 'C', 'G', 'Am', 'F', 'C', 'G'], 4, .25, [0]);
// the theme, slow and quiet, on piano: first half unresolved (stops on D), then the soft resolve at the hug
THEME.slice(0, 9).forEach(([s, b, l]) => add(B, 132 + b * BEAT * 1.25, 3, piano(f(s), 2.2), .3, .2));
chords(140.4, ['F', 'G', 'C'], 5, .3, 'piano');
['C5', 'E5', 'G5', 'C6'].forEach((s, k) => add(B, 146.5 + k * .45, 3, piano(f(s), 2.5), .22, .3));
writeWav(B, 'out/audio/music.wav', .9);
console.log('out/audio/music.wav');
