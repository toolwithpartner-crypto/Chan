// sfx.mjs: every sound effect, synthesized and placed on the film's timeline → out/audio/sfx.wav. usage: node scripts/sfx.mjs
import { buf, add, beep, square, bell, whoosh, noise, tick, kick, writeWav } from './audiolib.mjs';
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
for (const t of [6.15, 7.9, 9.7]) ding(t, .2);       // each panel lights
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
writeWav(B, 'out/audio/sfx.wav', 1);
console.log('out/audio/sfx.wav');
