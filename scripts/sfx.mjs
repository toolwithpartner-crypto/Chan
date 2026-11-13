// sfx.mjs: every sound effect, synthesized and placed on the film's timeline → out/audio/sfx.wav. usage: node scripts/sfx.mjs
import { buf, add, PACING, beep, square, bell, whoosh, noise, tick, kick, writeWav } from './audiolib.mjs';
const B = buf();
const tap = t => { add(B, t, .06, beep(1800, .06), .25); add(B, t + .07, .08, beep(2400, .08), .2); };
const declined = t => { add(B, t, .18, square(330, .18), .35); add(B, t + .22, .3, square(247, .3), .35); };
const pop = (t, g = .35) => { add(B, t, .12, beep(880, .12), g); add(B, t + .05, .15, beep(1320, .15), g * .7); };   // chat bubble
const ding = (t, g = .4) => { add(B, t, 1.2, bell(1318), g); add(B, t + .12, 1.2, bell(1760), g * .8); };
const click = (t, g = .2) => add(B, t, .03, noise(.012, .9), g, (Math.random() - .5) * .3);
const typing = (a, b, rate = 9, g = .18) => { for (let t = a; t < b; t += 1 / rate * (0.7 + Math.random() * .6)) click(t, g); };
const step = (t, g = .35) => { add(B, t, .15, kick(), g * .6); add(B, t, .08, noise(.03, .3), g * .3); };
const kaching = t => { add(B, t, .9, bell(1975, .5), .35); add(B, t + .06, .9, bell(2637, .45), .3); add(B, t, .2, noise(.05, .7), .15); };

// Hook
tap(.95); declined(1.25); tap(2.05); declined(2.3);
add(B, 3.25, .8, (i, t) => Math.sign(Math.sin(2 * Math.PI * 150 * t)) * .12 * (Math.sin(2 * Math.PI * 11 * t) > 0 ? 1 : .2), .8);   // phone buzz
add(B, 5.15, .25, kick(), .5);                       // the shock beat
for (const t of [6.15, 7.9, 9.7]) ding(t, .35);       // each panel lights
add(B, 10.65, .7, whoosh(.7), .35); add(B, 11.6, .8, whoosh(.8, false), .5);   // panel grows, brush wipe
// Act 1
for (let t = 12.3; t < 16; t += .42) add(B, t, .3, whoosh(.3), .12, Math.sin(t) * .6);   // wing beats
add(B, 16.2, .5, noise(.3, .05), .2);                // bed creak / settle
for (let t = 20.1; t < 21.3; t += .32) step(t);      // Mom's steps to the door
for (const t of [24.8, 25.5, 26.2]) pop(t, .3);      // the account rows
add(B, 26.6, .7, whoosh(.7, false), .4);
add(B, 29.8, .6, whoosh(.6), .25);
ding(33.2, .45);                                     // the friend request
add(B, 35.6, 2.4, whoosh(2.4), .3);                  // push into the card
// inserted flashback 'ask' (times inside that shot)
{ const A = PACING.shots.find(x => x.ins === 'ask').a2, at = x => A + x;
  add(B, at(.95), .12, beep(880, .12), .3, 0, true); add(B, at(1.35), .5, whoosh(.5), .25, 0, true);
  add(B, at(1.6), 1, bell(1046, .5), .25, 0, true);
  for (let x = 2.6; x < 3.5; x += .18) add(B, at(x), .1, kick(), .25, 0, true);   // running steps
}
// Act 2: chat pops at each bubble
for (const t of [38.6, 39.6, 52.1, 52.8, 56.1, 56.7, 57.3, 60.0, 63.2, 64.1, 73.5, 74.3]) pop(t);
add(B, 40.75, .3, whoosh(.3), .2);
ding(65.0, .35);                                     // "don't tell anyone" lands
for (let i = 0; i < 6; i++) add(B, 46.4 + i * .28, .14, kick(), .25);    // admin walks up in the game
for (let i = 0; i < 8; i++) add(B, 48.3 + i * .07, .4, bell(2000 + i * 180, .3), .08);   // free sparkle
typing(58.2, 59.9);
for (let i = 0; i < 6; i++) add(B, 66.6 + i * .48, .2, noise(.12, .08), .2);   // bed bounces
for (let t = 76; t < 78; t += .5) add(B, t, .1, tick(), .5);                    // the wall clock
// Act 3
pop(82.2); pop(82.7); add(B, 83.5, .4, whoosh(.4), .3);
typing(87.1, 89.6, 11);
pop(92.3); add(B, 94.0, 1.2, bell(1046, .6), .35); add(B, 94.05, 1.2, bell(1568, .5), .25);   // device code chime
add(B, 95.6, .5, whoosh(.5), .2);                                                                // thumb swipe
for (const t of [99.2, 99.58, 99.92, 100.22, 100.48, 100.7, 100.9, 101.1]) pop(t, .4);       // the pings pile up
typing(102.2, 103.6, 5, .25); add(B, 104.0, .5, whoosh(.5), .3);                               // send
ding(106.2, .35);
for (let t = 107.7; t < 109.2; t += .38) click(t, .25);                                       // refresh, refresh
typing(110.3, 115.5, 14, .22);                                                                  // the scammer's keyboard
for (const t of [110.6, 111.3, 112.0, 112.7, 113.4]) kaching(t);
add(B, 114.4, 1.2, (i, t) => Math.exp(-t * 2) * Math.sin(2 * Math.PI * 58 * t), .6);         // the total lands, low
// Act 4
add(B, 118.0, 4.8, noise(4, .02), .08);                                                         // parking-lot air
add(B, 123.3, .9, (i, t) => Math.exp(-t * 3) * Math.sin(2 * Math.PI * (180 + 60 * Math.sin(t * 9)) * t) * .4, .5);   // door creak
for (let t = 123.8; t < 125.4; t += .4) step(t, .3);
add(B, 125.8, .25, kick(), .3); add(B, 125.85, .3, beep(660, .3), .2);                          // lid pops
add(B, 126.3, .5, beep(196, .5), .25);                                                          // nothing inside
add(B, 126.7, .18, square(220, .18), .25); add(B, 126.9, .25, square(185, .25), .25);          // user not found
for (const t of [137.1, 141.0]) add(B, t, .6, whoosh(.6, false), .2);                           // scrolling

// ---------- ambience beds: every shot sits in a place you can hear (so no stretch drops to dead silence) ----------
// beds are laid per shot in film time (raw), so they follow the pacing holds and slow-downs exactly
const R = (() => { let s = 777; return () => ((s = (s * 16807) % 2147483647) / 2147483647) * 2 - 1; })();
const fade = (t, d, f = .4) => Math.min(1, t / f, (d - t) / f);
const hum = (d, f0 = 60) => { let y = 0; return (i, t) => { y += .01 * (R() - y); return fade(t, d) * (Math.sin(2 * Math.PI * f0 * t) * .25 + Math.sin(2 * Math.PI * f0 * 2 * t) * .12 + y * 3); }; };
const crickets = d => (i, t) => { const c = Math.floor(t * 2.3), ph = t * 2.3 - c, on = ph < .28 ? Math.sin(Math.PI * ph / .28) * (Math.sin(2 * Math.PI * 30 * t) > 0 ? 1 : 0) : 0; return fade(t, d, .8) * on * Math.sin(2 * Math.PI * 4400 * t) * .22; };
const birds = d => { const ev = []; for (let x = .3; x < d; x += .9 + Math.abs(R()) * 2.2) ev.push([x, 2600 + R() * 600, R() > 0 ? 1 : -1]); return (i, t) => { let v = 0; for (const [x, f, s] of ev) { const u = t - x; if (u > 0 && u < .14) v += Math.sin(2 * Math.PI * (f + s * 1800 * u) * u) * Math.sin(Math.PI * u / .14); } return fade(t, d, .8) * v * .18; }; };
const murmur = d => { let a = 0, b = 0; return (i, t) => { a += .06 * (R() - a); b += .5 * (a - b); return fade(t, d) * (a - b) * 5 * (.7 + .3 * Math.sin(t * 1.7) * Math.sin(t * .6)); }; };
const sparkleBed = d => { const ev = []; for (let x = .2; x < d; x += .35 + Math.abs(R()) * .6) ev.push([x, [2093, 2637, 3136, 3520][Math.floor(Math.abs(R()) * 4)]]); return (i, t) => { let v = 0; for (const [x, f] of ev) { const u = t - x; if (u > 0 && u < .6) v += Math.exp(-u * 8) * Math.sin(2 * Math.PI * f * u); } return fade(t, d) * v * .14; }; };
const PLACE = sh => {
  const a = sh.a, ins = sh.ins;
  if (ins === 'ask') return 'day';
  if (a < 3) return 'store'; if (a < 6) return 'store'; if (a < 12) return 'store';
  if (a < 16) return 'game';
  if (a >= 20 && a < 32) return 'day';                    // the flashback at home
  if ([46].includes(a) || (a >= 52 && a < 58)) return 'game';   // s12 mixes chat + game beats: game bed plus room under it
  if (a === 110) return 'dark';
  if (a === 118) return 'lot';
  if (a >= 123) return 'afternoon';
  return 'night';                                           // Nerd's bedroom at night, chats included
};
for (const sh of PACING.shots) {
  const t0 = sh.a2, d = sh.b2 - sh.a2 + .5, p = PLACE(sh);
  if (p === 'store') { add(B, t0, d, murmur(d), .35, 0, true); add(B, t0, d, hum(d, 120), .05, 0, true); }
  if (p === 'game') { add(B, t0, d, sparkleBed(d), .5, .3, true); add(B, t0, d, hum(d, 98), .05, 0, true); }
  if (p === 'day') { add(B, t0, d, birds(d), .45, .5, true); add(B, t0, d, hum(d, 50), .04, 0, true); }
  if (p === 'night') { add(B, t0, d, crickets(d), .3, -.5, true); add(B, t0, d, hum(d, 60), .07, 0, true); }
  if (p === 'dark') add(B, t0, d, hum(d, 45), .2, 0, true);
  if (p === 'afternoon') { add(B, t0, d, birds(d), .35, -.4, true); add(B, t0, d, hum(d, 55), .06, 0, true); }
  if (p === 'lot') add(B, t0, d, murmur(d), .25, 0, true);
}
// ---------- extra spot effects for the shots that had none ----------
const poof = (t, g = .3) => { add(B, t, .5, whoosh(.5), g * .6); add(B, t + .1, .9, bell(1568, .5), g * .6); add(B, t + .16, .9, bell(2093, .45), g * .4); };   // the little voice appears
const rustle = (t, d = .6, g = .25) => add(B, t, d, noise(d * .5, .25), g, R() * .4);
const carPass = (t, pan = 1) => { const d = 3; add(B, t, d, (i, u) => { const k = u / d; return Math.sin(Math.PI * k) ** 2 * (Math.sin(2 * Math.PI * (70 - 20 * k) * u) * .4 + R() * .15); }, .35, pan); };
const zip = t => { for (let i = 0; i < 14; i++) add(B, t + i * .025, .03, noise(.01, .9), .25); };
const keys = t => { for (let i = 0; i < 6; i++) add(B, t + i * .05 + Math.abs(R()) * .03, .4, bell(3000 + Math.abs(R()) * 2500, .15), .08, .3); };
const heartbeat = (t, n = 4, g = .35) => { for (let i = 0; i < n; i++) { add(B, t + i * .9, .2, kick(), g); add(B, t + i * .9 + .22, .2, kick(), g * .7); } };
// hook: the shock lands, the panels are slower now
heartbeat(6.3, 4, .28);
// 'ask' flashback: zipper, keys, Mom's watch, the begging
{ const A = PACING.shots.find(x => x.ins === 'ask').a2, at = x => A + x;
  zip(at(2.7)); keys(at(3.3)); add(B, at(3.8), .5, tick(), .3, 0, true);
  for (let x = 4.3; x < 5.5; x += .25) add(B, at(x), .1, kick(), .18, 0, true);
  rustle(at(6.2), .6); keys(at(7.6)); }
// Act 1: settling, the account rows, the rule
rustle(16.6); rustle(18.2, .4); pop(25.0, .25); tap(27.4); rustle(30.2, .5);
// Act 2: the voice appears, the bed, the head turns
add(B, 40.9, .5, whoosh(.5), .2); poof(42.6); rustle(44.2); poof(69.35); add(B, 70.7, .4, whoosh(.4, false), .25); rustle(79, .5); poof(78.1, .2);
// Act 3
pop(84.5, .25); poof(89.9, .2); add(B, 91.0, .25, kick(), .2); for (const t of [98.3, 98.9, 99.5]) add(B, t, .3, square(500 + 80 * (t % 1), .12), .12);
heartbeat(102.3, 4, .25); rustle(108.8, .8, .2);
// Act 4
carPass(118.6, -1); carPass(121.2, 1); add(B, 119.4, .8, (i, t) => Math.sign(Math.sin(2 * Math.PI * 150 * t)) * .1 * (Math.sin(2 * Math.PI * 11 * t) > 0 ? 1 : .2), .5);
add(B, 128.3, .6, noise(.3, .08), .3); rustle(129.2, .7, .2); heartbeat(129.6, 3, .2);
add(B, 132.6, .5, noise(.25, .15), .25); add(B, 134.6, .6, whoosh(.6), .2);
pop(139.2, .3); add(B, 139.25, 1.5, bell(523, 1), .2); pop(142.2, .3); add(B, 142.25, 1.5, bell(494, 1), .2);
rustle(144.3, 1.2, .3); heartbeat(145.2, 4, .22);
writeWav(B, 'out/audio/sfx.wav', 1);
console.log('out/audio/sfx.wav');
