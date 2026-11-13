// a00_hook.js: Hook, sentences 1–3 (0:00–0:12).
//  1  0.0–3.0  CU card terminal: Mom taps her card, declined; taps again, declined again.
//  2  3.0–6.0  MCU Mom at the checkout: her phone buzzes, the bank says the card is suspended; the queue leans in.
//  3  6.0–12.0 Three panels, lit one per phrase of the VO: card safe in the wallet / Nerd doing homework / the gift chat.
//              Panel 3 grows to fill the frame, then a brush wipe goes back one week.
(() => {
  const SKY = '#DCE6E4';

  // ---------- shared pieces ----------
  function store(t, o = {}) {   // a bright supermarket, kept soft so the characters read in front of it
    boilSeed('st-bg'); paint(rectPts(-300, -300, W + 600, H + 600), { wash: '#E9E4D6', ink: null });
    paint(ellPts(960, 160, 1200, 260, 24, 8), { fill: '#FFF6DA', fillOp: 120, bleed: .3, tex: .4, ink: null });
    for (let i = 0; i < 5; i++) { boilSeed('lamp' + i); const x = -200 + i * 560; glow(x, 40, 220, '#FFF2C8', .35); paint(rectPts(x - 120, 20, 240, 22, 1), { wash: '#FFFBEA', ink: ST.inkSoft, sw: .6 }); }
    for (let r = 0; r < 3; r++) for (let i = 0; i < 9; i++) {
      boilSeed('shelf' + r + '-' + i);
      const x = -260 + i * 300, y = 300 + r * 170;
      paint(rectPts(x, y + 120, 280, 14), { wash: '#B9B2A2', ink: null });
      for (let k = 0; k < 6; k++) { const c = ['#E38B6B', '#F2C96B', '#7FB7A6', '#9DB4E0', '#E7A3B8', '#C9D97A'][Math.floor(hash(r * 31 + i * 7 + k) * 6)]; const h = 60 + 50 * hash(i + k * 3 + r); paint(rrPts(x + 10 + k * 45, y + 120 - h, 38, h, 6), { wash: mixCol(c, '#E9E4D6', .35), ink: null }); }
    }
  }
  function bystander(x, y, s, col, lean, id) {   // simple soft figure in the queue, no face detail
    boilSeed('by' + id);
    push(); translate(x, y); rotate(lean);
    paint(rrPts(-s * .55, -s * 2.6, s * 1.1, s * 1.9, s * .4), { wash: col, ink: ST.inkSoft, sw: .8 });
    paint(ellPts(0, -s * 3.05, s * .45, s * .5, 18), { wash: '#D8B49A', ink: ST.inkSoft, sw: .8 });
    paint(ellPts(0, -s * 3.25, s * .47, s * .32, 16), { wash: '#4A3B3A', ink: null });
    paint(ellPts(s * .18, -s * 3.0, s * .05, s * .07, 6), { wash: ST.ink, ink: null });
    pop();
  }
  function card(x, y, w, ang = 0) {
    push(); translate(x, y); rotate(ang);
    paint(rrPts(-w / 2, -w * .31, w, w * .62, w * .06), { wash: '#3E6FB0', ink: ST.ink, sw: 1.1 });
    paint(rrPts(-w * .36, -w * .12, w * .18, w * .14, w * .02), { wash: ST.gold, ink: ST.ink, sw: .5 });
    paint(rectPts(-w / 2, w * .1, w, w * .06), { wash: '#26497A', ink: null });
    pop();
  }
  function momHand(hx, hy, from, s, id) {   // Mom's arm coming into a close-up from off screen, hand at (hx, hy)
    boilSeed('mh' + id);
    paint(ribbon([from, [lerp(from[0], hx, .55), lerp(from[1], hy, .55) + 30], [hx + s * .35, hy + s * .05]], s * .62, s * .5), { wash: ST.cardi, ink: ST.ink, sw: 1.4 });
    paint(ellPts(hx + s * .1, hy, s * .32, s * .27, 16), { wash: ST.skinMom, ink: ST.ink, sw: 1.1 });
    for (let k = 0; k < 3; k++) paint(ribbon([[hx - s * .05, hy - s * .12 + k * s * .11], [hx - s * .34, hy - s * .16 + k * s * .12]], s * .1, s * .09), { wash: ST.skinMom, ink: ST.ink, sw: .8 });
    paint(ribbon([[hx + s * .05, hy + s * .2], [hx - s * .25, hy + s * .22]], s * .11, s * .09), { wash: ST.skinMom, ink: ST.ink, sw: .8 });
  }

  // ---------- 1: the terminal ----------
  function shotTerminal(t, lt, dur) {
    const push2 = ease(seg(lt, dur - .35, dur));
    camBegin(930 + 260 * push2, 540, 1.3 + .03 * lt + .3 * push2);
    boilSeed('counter'); paint(rectPts(-300, -300, W + 600, H + 600), { wash: '#DCD5C4', ink: null });
    paint(ellPts(400, 200, 900, 420, 24, 8), { fill: '#F7F0DD', fillOp: 140, bleed: .3, tex: .5, ink: null });
    paint(rectPts(-300, 640, W + 600, 700), { wash: '#8FA7A0', ink: ST.ink, sw: 1.2 });
    paint(rectPts(-300, 640, W + 600, 26), { wash: '#B9CBC4', ink: null });
    // groceries waiting on the belt (left)
    boilSeed('groc');
    paint(rrPts(120, 420, 120, 230, 10), { wash: '#F4F1EA', ink: ST.ink, sw: 1 }); paint(rectPts(120, 470, 120, 60), { wash: '#6FA8C9', ink: null });
    paint(ellPts(330, 600, 70, 60, 18), { wash: '#D9534F', ink: ST.ink, sw: 1 }); paint(ellPts(420, 610, 62, 55, 18), { wash: '#E0694F', ink: ST.ink, sw: 1 });
    paint(rrPts(470, 520, 230, 120, 50), { wash: '#D9A35E', ink: ST.ink, sw: 1 });
    // terminal
    const bang = [lt > 1.25 && lt < 1.6, lt > 2.3 && lt < 2.65], sh = (bang[0] ? spring(lt, 1.25, 9, 40) : 0) + (bang[1] ? spring(lt, 2.3, 9, 40) : 0);
    const TX = 860 + sh * 10, TY = 520;
    boilSeed('term');
    push(); translate(TX, TY); rotate(-.05);
    paint(rrPts(-170, -250, 340, 520, 40), { wash: '#3A3F4A', ink: ST.ink, sw: 1.6 });
    for (let r = 0; r < 4; r++) for (let c = 0; c < 3; c++) paint(rrPts(-105 + c * 75, 70 + r * 46, 60, 34, 8), { wash: r === 3 ? ['#D9534F', '#E9C46A', '#5BAE6A'][c] : '#5A606C', ink: ST.ink, sw: .6 });
    const state = lt < .95 ? 'idle' : lt < 1.25 ? 'busy' : lt < 1.9 ? 'no' : lt < 2.05 ? 'idle' : lt < 2.3 ? 'busy' : 'no';
    const scr = state === 'no' ? '#F2B8B0' : '#BFE3F2';
    paint(rrPts(-135, -215, 270, 210, 16), { wash: scr, ink: ST.ink, sw: 1 });
    if (state === 'no') glow(0, -110, 260, '#FF6B5B', .5);
    pop();
    // screen content (text belongs to the world: the one word the viewer must read)
    const sx = TX - 4, sy = TY - 112;
    if (state === 'idle') { boilSeed('scr-i'); for (let k = 0; k < 3; k++) inkLine([[sx - 20 + k * 22, sy - 30 - k * 6], [sx - 5 + k * 22, sy - 45 - k * 6]], 1.2, '#3E6FB0', 'ink', .5); card(sx, sy + 30, 90, -.05); }
    if (state === 'busy') { boilSeed('scr-b'); for (let k = 0; k < 3; k++) paint(ellPts(sx - 40 + k * 40, sy, 11 + 5 * Math.max(0, Math.sin(lt * 14 - k)), 11 + 5 * Math.max(0, Math.sin(lt * 14 - k)), 10), { wash: '#3E6FB0', ink: null }); }
    if (state === 'no') {
      const k0 = state === 'no' ? backOut(seg(lt, lt < 1.9 ? 1.25 : 2.3, (lt < 1.9 ? 1.25 : 2.3) + .2)) : 0;
      boilSeed('scr-n'); push(); translate(sx, sy - 30); scale(k0);
      paint(ellPts(0, 0, 38, 38, 18), { wash: '#D9534F', ink: ST.ink, sw: 1 });
      inkLine([[-15, -15], [15, 15]], 2.6, ST.cream, 'ink', 0); inkLine([[15, -15], [-15, 15]], 2.6, ST.cream, 'ink', 0);
      pop();
      thai('DECLINED', sx, sy + 50, 44, '#8E2420', { align: 'center', w: 700, pop: k0 });
    }
    // Mom's hand with the card: in, tap, back a little, tap harder, pull back and tremble
    const P = kf(lt, [[0, [1700, 820]], [.45, [1190, 700]], [.8, [1030, 640]], [.95, [985, 560]], [1.4, [1080, 640]], [1.85, [1060, 620]], [2.05, [985, 548]], [2.3, [990, 552]], [2.75, [1140, 700]]]);
    const tr = lt > 2.75 ? Math.sin(lt * 40) * 3 : 0;
    const cx = P[0] - 60, cy = P[1] + tr, ang = -.35 + .2 * seg(lt, .4, .95);
    card(cx, cy, 170, ang);
    momHand(cx + 70, cy + 10, [1990, 1080], 120, 'a');
    camEnd();
    if (lt < .45) flash(1 - ease(lt / .45), ST.cream);
  }

  // ---------- 2: the bank call ----------
  function shotCall(t, lt, dur) {
    const z = 2.25 + .08 * ease(seg(lt, 0, dur)), settle = 1 - easeOut(seg(lt, 0, .35));
    camBegin(1000 - 160 * settle, 790, z);
    store(t);
    // queue behind her
    const leanIn = ease(seg(lt, 2.2, 2.7));
    bystander(800, 1060, 62, '#9DB4C0', -.04 - .14 * leanIn, 'p1');
    bystander(660, 1060, 58, '#C9A46B', .03 - .07 * leanIn, 'p2');
    boilSeed('cart'); paint([[520, 1000], [760, 1000], [740, 1080], [540, 1080]], { wash: null, ink: ST.inkSoft, sw: 1, hatch: { d: 14, a: .8, b: 'HB', c: ST.inkSoft, w: .6 } });
    // Mom
    const U = 110, mx = 1040, my = 1300, buzz = lt > .25 && lt < 1.05;
    const talk = lt > 1.15 && lt < 2.05, flap = talk ? .25 + .5 * Math.abs(Math.sin(lt * 15)) : 0;
    const head = [mx - 4, my - (2.45 + 2.05) * U - .66 * U * .92];
    const P = pose(lt, [
      [0, { eyes: 'dot', look: [-.5, .5], brow: 'worry', mouth: 'tight', tilt: .05, sweat: 0, shake: 0 }],
      [.3, { look: [.5, .9], eyes: 'dot', mouth: 'flat', _d: .2 }],
      [.85, { look: [-.3, 0], brow: 'flat', tilt: -.04, _d: .25 }],
      [1.15, { brow: 'worry' }],
      [2.15, { eyes: 'wide', brow: 'up', mouth: 'o', sweat: .9, tilt: .06, shake: .25, _snap: true, _d: .15 }],
    ]);
    const toEar = ease(seg(lt, .7, 1.05)), ear = [head[0] + .78 * U, head[1] + .05 * U];
    const low = [mx + .55 * U, my - 2.75 * U];
    const midp = [mx + .3 * U, my - 3.7 * U], hand = toEar < .5 ? [lerp(low[0], midp[0], ease(toEar * 2)), lerp(low[1], midp[1], ease(toEar * 2))] : [lerp(midp[0], ear[0], ease(toEar * 2 - 1)), lerp(midp[1], ear[1], ease(toEar * 2 - 1))];
    const r = person(mx, my, U, { who: 'mom', id: 'h2', turn: -.35, ...P, mouth: talk ? 'open' : P.mouth, mouthOpen: flap,
      reach: [[mx - .5 * U, my - 2.55 * U], hand], hands: ['hold', 'hold'], sq: -.03 * ring(lt, [2.15], 8, 20) });
    const bz = buzz ? Math.sin(lt * 90) * 4 : 0;
    phone(r.hand[0] + bz - 6, r.hand[1] - 10, U, lerp(.2, -.25, toEar), buzz ? 1 : .3, { id: 'h2' });
    if (buzz) { boilSeed('buzz'); for (const s of [-1, 1]) inkLine([[r.hand[0] + s * 48, r.hand[1] - 30], [r.hand[0] + s * 58, r.hand[1] - 5], [r.hand[0] + s * 48, r.hand[1] + 20]], 1.2, ST.inkSoft, 'ink', .6); }
    card(r.handB[0] + 10, r.handB[1] + 8, 70, .3);
    // counter in the foreground
    boilSeed('fg'); paint(rectPts(560, 1060, 1100, 300), { wash: '#8FA7A0', ink: ST.ink, sw: 1.2 });
    camEnd();
    if (lt > dur - .3) flash(ease(seg(lt, dur - .3, dur)), ST.cream);
  }

  // ---------- 3: three panels ----------
  const PANELS = [[90, 170, 560, 640], [680, 170, 560, 640], [1270, 170, 560, 640]];
  function frameBox(b, lit, id) {
    boilSeed('pf' + id);
    paint(rrPts(b[0] - 8, b[1] - 8, b[2] + 16, b[3] + 16, 18), { wash: lit ? ST.cream : '#9C968A', ink: ST.ink, sw: 1.6 });
  }
  function panelWallet(b, t, k) {   // the card is right there in her wallet
    const [x, y, w, h] = b; boilSeed('p1');
    paint(rrPts(x, y, w, h, 12), { wash: '#E8DCC4', ink: null });
    paint(rrPts(x + 60, y + 170, w - 120, 330, 30), { wash: '#7A4E3A', ink: ST.ink, sw: 1.4 });
    paint(rrPts(x + 60, y + 330, w - 120, 170, 20), { wash: '#8E5C45', ink: ST.ink, sw: 1.2 });
    card(x + w / 2, y + 300 - 14 * k, 300, -.04);
    paint(rrPts(x + 60, y + 330, w - 120, 170, 20), { wash: '#8E5C45', washOp: 255, ink: ST.ink, sw: 1.2 });
    if (k > .1) { boilSeed('p1s'); for (let i = 0; i < 3; i++) { const a = -1.2 + i * .6; inkLine([[x + w / 2 + Math.cos(a) * 190, y + 250 + Math.sin(a) * 120], [x + w / 2 + Math.cos(a) * 220, y + 250 + Math.sin(a) * 140]], 1.6 * k, ST.gold, 'ink', 0); } }
  }
  function panelHomework(b, t, k, lt) {   // Nerd at the table, homework, nothing to hide
    const [x, y, w, h] = b; boilSeed('p2');
    paint(rrPts(x, y, w, h, 12), { wash: '#E6E0CF', ink: null });
    paint(ellPts(x + w * .5, y + h * .35, w * .5, h * .3, 20, 6), { fill: '#F6EED8', fillOp: 140, bleed: .25, tex: .4, ink: null });
    const tap = Math.abs(Math.sin(lt * 7)) * k;
    person(x + w * .5, y + h + 40, 95, { who: 'nerd', id: 'p2', sit: 1, seat: 1.1, eyes: 'dot', look: [0, .8], mouth: 'flat', brow: k > .5 ? 'flat' : null, tuft: .3, tilt: .05,
      arms: [[.9, .8], [1.0, 1.4 + .2 * tap]], hands: ['open', 'fist'] });
    boilSeed('p2t'); paint(rectPts(x - 10, y + h - 150, w + 20, 170), { wash: '#A7835F', ink: ST.ink, sw: 1.3 });
    paint([[x + 150, y + h - 160], [x + 380, y + h - 165], [x + 400, y + h - 115], [x + 140, y + h - 110]], { wash: '#FBF6EA', ink: ST.ink, sw: 1 });
    for (let i = 0; i < 3; i++) inkLine([[x + 175, y + h - 150 + i * 12], [x + 360, y + h - 152 + i * 12]], .5, '#9DB4E0', 'inkfine', 0);
    boilSeed('p2p'); inkLine([[x + 330, y + h - 150 - 30 * tap], [x + 360, y + h - 230 - 30 * tap]], 3, '#E9C46A', 'ink', 0);
  }
  function panelChat(b, t, k, tr) {   // the tablet, with the gift chat blinking
    const [x, y, w, h] = b; boilSeed('p3');
    paint(rrPts(x, y, w, h, 12), { wash: '#2C3157', ink: null });
    glow(x + w / 2, y + h * .55, 320, ST.screenGlow, .5 * (.4 + .6 * k));
    tablet(x + w / 2, y + h * .58, 330, 0, 1, { id: 'p3' });
    const bl = .5 + .5 * Math.sin(t * 9), bx = x + w / 2 - 190, by = y + h * .58 - 120;
    boilSeed('p3b'); paint(rrPts(bx, by, 380, 140, 26), { wash: ST.cream, ink: ST.ink, sw: 1.2 });
    paint(rrPts(bx + 22, by + 32, 70, 70, 12), { wash: ST.pink, ink: ST.ink, sw: .9 }); paint(rectPts(bx + 52, by + 32, 10, 70), { wash: ST.gold, ink: null });
    paint(ellPts(bx + 47, by + 30, 14, 9, 10), { wash: ST.gold, ink: ST.ink, sw: .6 }); paint(ellPts(bx + 67, by + 30, 14, 9, 10), { wash: ST.gold, ink: ST.ink, sw: .6 });
    { const [qx, qy, qs] = tr(bx + 104, by + 70); thai('A gift from Admin!', qx, qy, 30 * qs, ST.ink, { w: 700, alpha: .55 + .45 * bl, screen: true }); }
    if (k > .2) glow(bx + 57, by + 67, 90, ST.gold, .5 * bl * k);
  }
  function shotPanels(t, lt) {
    const dur = 6;   // the act's last shot computes its own length
    boilSeed('pbg'); paint(rectPts(-40, -40, W + 80, H + 80), { wash: '#3A3546', ink: null });
    paint(ellPts(960, 480, 1000, 520, 24, 8), { fill: '#4A4458', fillOp: 120, bleed: .3, tex: .5, ink: null });
    // which panel is lit: wallet 0.2–1.9, homework 1.9–3.7, chat 3.7–
    const lit = lt < 1.9 ? 0 : lt < 3.7 ? 1 : 2;
    const kIn = i => easeOut(seg(lt, i * .18, i * .18 + .45));
    const grow = ease(seg(lt, 4.7, 5.35));
    for (let i = 0; i < 3; i++) {
      if (grow > .98 && i < 2) continue;
      const b = PANELS[i], drop = (1 - kIn(i)) * 900, on = i === lit;
      const kLit = on ? easeOut(seg(lt, [0, 1.9, 3.7][i], [0, 1.9, 3.7][i] + .3)) : 0;
      let bb = [b[0], b[1] + drop, b[2], b[3]];
      if (i === 2) bb = [lerp(bb[0], -40, grow), lerp(bb[1], -40, grow), lerp(bb[2], W + 80, grow), lerp(bb[3], H + 80, grow)];
      push(); translate(bb[0], bb[1]); scale(bb[2] / b[2], bb[3] / b[3]); translate(-b[0], -b[1]);
      if (grow < .5 || i < 2) frameBox(b, on, i);
      if (i === 0) panelWallet(b, t, kLit); else if (i === 1) panelHomework(b, t, kLit, lt); else panelChat(b, t, kLit, (px, py) => [bb[0] + (px - b[0]) * bb[2] / b[2], bb[1] + (py - b[1]) * bb[3] / b[3], Math.min(bb[2] / b[2], bb[3] / b[3])]);
      if (!on && !(i === 2 && grow > 0)) paint(rrPts(b[0], b[1], b[2], b[3], 12), { wash: '#2A2533', washOp: 120, ink: null });
      pop();
    }
    flushLetters();
    if (lt > dur - .35) brushWipe((lt - (dur - .35)) / .7, ['#3A3F7A', '#5A4A7A']);
    if (lt < .25) flash(1 - lt / .25, ST.cream);
  }

  shots([[0, shotTerminal], [3, shotCall], [6, shotPanels]]);
})();
