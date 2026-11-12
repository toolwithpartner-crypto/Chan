// cast.js: the people. person(x, y, u, o) draws Nerd, Mom, or a mini Nerd (an inner voice). (x, y) is the ground point
// between the feet; u is the body unit (Nerd stands ~4.7u, Mom ~6.3u at the same u, so keep u equal in two-shots).
//
// Options (all optional):
//   who        'nerd' | 'mom'.   mini: 'angel' | 'devil' turns Nerd into a floating inner voice (halo / horns, no legs).
//   view       'front' | 'side' | 'back'. Side faces right; flip: true mirrors.   turn -1..1 slides the face (front).
//   walk       distance walked (drives legs/arms in side view).   sit 0..1 sits on a seat of height `seat` (u).
//   arms       [[a, b], [a, b]] left/right: a = swing from straight down (+ = outward/forward), b = elbow bend.
//   reach      [[x, y] | null, [x, y] | null] world points for the hands (two-bone IK; overrides arms).
//   hands      [l, r]: 'open' | 'fist' | 'point' | 'hold' | 'thumb'.
//   eyes       'dot' | 'wide' | 'happy' | 'shut' | 'sad' | 'squint' | 'half' | 'star' | 'teary'.   look [dx, dy].
//   brow       'up' | 'worry' | 'angry' | 'sad' | 'flat' | null.
//   mouth      'smile' | 'grin' | 'o' | 'flat' | 'frown' | 'wobble' | 'open' | 'smirk' | 'tight'.  mouthOpen 0..1.
//   tilt, lean, sq, dy, shake 0..1, shrug 0..1, blush 0..1, tears 0..1, sweat 0..1, screen 0..1 (blue screen light),
//   tuft -1..1 (Nerd's cowlick: 1 = up and proud, -1 = flat and guilty), headOnly (head + collar, for face sheets),
//   id (boil key, so two characters never share one stream).
// Returns { head, hand, handB, shoulder, shoulderB } in world coordinates (hand = right/front).
const DESIGN = {
  nerd: { leg: 1.45, torso: 1.45, head: .82, sh: .52, hip: .5, skin: 'skin', skinDk: 'skinDk', hair: 'hair', hairHi: 'hairHi' },
  mom: { leg: 2.45, torso: 2.05, head: .66, sh: .62, hip: .64, skin: 'skinMom', skinDk: 'skinMomDk', hair: 'hairMom', hairHi: 'hairMomHi' },
};

function person(x, y, u, o = {}) {
  const t = o.t ?? T, who = o.who || 'nerd', D = DESIGN[who], mini = o.mini || null;
  const view = o.view || 'front', dir = o.flip ? -1 : 1, id = who + (mini || '') + (o.id || '');
  const sq = o.sq || 0, sx = 1 + sq * .6, sy = 1 - sq, sw = clamp(u / 44, .3, 2);
  const SK = ST[D.skin], SKD = ST[D.skinDk];
  const breathe = Math.sin(t * TAU * .4 + (who === 'mom' ? 1.3 : 0)) * .03;
  const walkP = (o.walk || 0) * Math.PI * .8, moving = !!o.walk;
  const bob = moving ? Math.abs(Math.sin(walkP)) * .1 : 0;
  const shk = o.shake || 0, jx = shk ? (Math.sin(t * 53) * .05 + Math.sin(t * 31) * .03) * u * shk : 0;
  const sit = clamp(o.sit || 0), seat = o.seat ?? D.leg * .62;
  const hipY = mini ? -D.leg * .35 * u : -u * lerp(D.leg, seat, sit) - bob * u;
  const neckY = hipY - u * D.torso * (1 + breathe);
  const hr = D.head * u, hc = [0, neckY - hr * .92];
  // headOnly: (x, y) is the centre of the head instead of the ground point
  const lean = o.lean || 0, X = x + jx, Y = y - (o.dy || 0) * u - (o.headOnly ? hc[1] : 0);
  push(); translate(X, Y); scale(dir * sx, sy); rotate(lean);
  const cL = Math.cos(lean), sL = Math.sin(lean);
  const toW = p => [X + dir * sx * (p[0] * cL - p[1] * sL), Y + sy * (p[0] * sL + p[1] * cL)];
  const toL = w => { const qx = (w[0] - X) / (dir * sx), qy = (w[1] - Y) / sy; return [qx * cL + qy * sL, -qx * sL + qy * cL]; };
  const side = view === 'side', back = view === 'back';

  // ---------- legs ----------
  const pantsCol = who === 'mom' ? ST.pants : ST.shorts, shoeCol = who === 'mom' ? ST.momShoe : ST.shoe;
  const legW = (who === 'mom' ? .42 : .26) * u;
  const leg = (P, near, key) => {
    boilSeed(id + 'leg' + key);
    const c = near ? 1 : .82, col = mixCol(pantsCol, ST.ink, near ? 0 : .25);
    if (who === 'nerd') {   // shorts to the knee, then skin and a sock
      const k = Math.min(1, P.length - 1), knee = P[k];
      const upper = [P[0], [lerp(P[0][0], knee[0], .85), lerp(P[0][1], knee[1], .85)]];
      paint(ribbon(P, legW * .7, legW * .6), { wash: mixCol(SK, ST.ink, near ? 0 : .2), ink: ST.ink, sw: sw * .7 });
      paint(ribbon(upper, legW * 1.05, legW * .95), { wash: col, ink: ST.ink, sw: sw * .8 });
    } else paint(ribbon(P, legW * .95, legW * .7), { wash: col, ink: ST.ink, sw: sw * .8 });
    const f = P[P.length - 1], fwd = side ? 1 : 0;
    paint(ellPts(f[0] + (side ? .14 * u : 0), f[1] - .05 * u, (side ? .26 : .17) * u * c, .1 * u, 12), { wash: shoeCol, ink: ST.ink, sw: sw * .6 });
  };
  const drawLegs = () => {
    if (mini) return;
    if (sit > .5) {
      if (side) for (const s of [-1, 1]) { const d = s * .05 * u, th = D.leg * .5 * u, knee = [th + d, hipY - .05 * u], foot = [th + .08 * u + d, 0]; leg([[d, hipY], knee, foot], s > 0, s); }
      else for (const s of [-1, 1]) { const knee = [s * .3 * u, hipY + .18 * u], foot = [s * .32 * u, 0]; leg([[s * .18 * u, hipY], knee, foot], true, s); }
    } else if (side) {
      for (const s of [-1, 1]) {
        const ph = Math.sin(walkP) * s, fx = ph * .42, lift = Math.max(0, Math.cos(walkP) * s) * .22 * (moving ? 1 : 0);
        const L = D.leg, knee = [fx * .5 + .08, -L * .5 - lift * .6];
        leg([[0, hipY], [knee[0] * u, knee[1] * u], [fx * u, -lift * u]], s > 0, s);
      }
    } else for (const s of [-1, 1]) {
      const fx = s * (D.hip * .55 + (moving ? Math.sin(walkP) * s * .04 : 0));
      leg([[s * D.hip * .45 * u, hipY], [s * D.hip * .52 * u, hipY * .5], [fx * u, 0]], true, s);
    }
  };
  if (sit <= .5 && !o.headOnly) drawLegs();

  // ---------- arms ----------
  const arms = o.arms || [[.18, .15], [.18, .15]], reach = o.reach || [];
  const sway = side && moving ? Math.sin(walkP) * .5 : 0;
  const shY = neckY + .22 * u - (o.shrug || 0) * .2 * u;
  const L1 = (who === 'mom' ? .95 : .72) * u, L2 = (who === 'mom' ? .9 : .66) * u;
  const armPts = s => {
    const sh = side ? [0, shY] : [s * D.sh * u, shY], tw = reach[s < 0 ? 0 : 1];
    if (tw) {
      const tl = toL(tw), dx = tl[0] - sh[0], dy = tl[1] - sh[1], d = clamp(Math.hypot(dx, dy), .05 * u, (L1 + L2) * .999);
      const base = Math.atan2(dy, dx), off = Math.acos(clamp((L1 * L1 + d * d - L2 * L2) / (2 * L1 * d), -1, 1));
      const cand = [base + off, base - off].map(a => [sh[0] + Math.cos(a) * L1, sh[1] + Math.sin(a) * L1]);
      const score = e => side ? e[1] : s * e[0] + .3 * e[1];
      const el = score(cand[0]) >= score(cand[1]) ? cand[0] : cand[1];
      return [sh, el, [sh[0] + Math.cos(base) * d, sh[1] + Math.sin(base) * d]];
    }
    const [a, b] = arms[s < 0 ? 0 : 1], ang = side ? a + sway * s : a, dx = side ? 1 : s;
    const el = [sh[0] + dx * Math.sin(ang) * L1, sh[1] + Math.cos(ang) * L1];
    const a2 = ang + b; return [sh, el, [el[0] + dx * Math.sin(a2) * L2, el[1] + Math.cos(a2) * L2]];
  };
  const hands = o.hands || [];
  const drawHand = (h, fa, kind, col) => {
    const r = (who === 'mom' ? .15 : .14) * u, w = sw * .5;
    if (kind === 'point') {
      const q = [h[0] + Math.cos(fa) * r * 2, h[1] + Math.sin(fa) * r * 2];
      paint(ribbon([h, q], r * .55, r * .4), { wash: col, ink: ST.ink, sw: w });
    } else if (kind === 'thumb') {
      const q = [h[0], h[1] - r * 1.7];
      paint(ribbon([h, q], r * .55, r * .45), { wash: col, ink: ST.ink, sw: w });
    } else if (kind === 'open') {
      for (const da of [-.55, -.18, .18, .55]) { const a = fa + da, p = [h[0] + Math.cos(a) * r * .4, h[1] + Math.sin(a) * r * .4]; paint(ribbon([p, [p[0] + Math.cos(a) * r * 1.05, p[1] + Math.sin(a) * r * 1.05]], r * .3, r * .24), { wash: col, ink: ST.ink, sw: w * .8 }); }
    }
    paint(ellPts(h[0], h[1], r * (kind === 'fist' || kind === 'hold' ? 1.05 : .95), r * .95, 12), { wash: col, ink: ST.ink, sw: w });
    if (kind === 'fist') inkLine([[h[0] - r * .4, h[1] - r * .1], [h[0] + r * .3, h[1] - r * .2]], sw * .35, ST.ink, 'ink', 0);
  };
  const sleeve = who === 'mom' ? ST.cardi : ST.tee, sleeveDk = who === 'mom' ? ST.cardiDk : ST.teeDk;
  const drawArm = (s, key, far) => {
    boilSeed(id + 'arm' + key);
    const A = armPts(s), skin = far ? mixCol(SK, ST.ink, .18) : SK;
    if (who === 'mom') paint(ribbon(A, .36 * u, .26 * u), { wash: far ? sleeveDk : sleeve, ink: ST.ink, sw: sw * .7, curv: .3 });
    else {
      paint(ribbon(A, .19 * u, .15 * u), { wash: skin, ink: ST.ink, sw: sw * .6, curv: .3 });
      const e = [lerp(A[0][0], A[1][0], .62), lerp(A[0][1], A[1][1], .62)];
      paint(ribbon([A[0], e], .3 * u, .26 * u), { wash: far ? sleeveDk : sleeve, ink: ST.ink, sw: sw * .7 });
    }
    drawHand(A[2], Math.atan2(A[2][1] - A[1][1], A[2][0] - A[1][0]), hands[s < 0 ? 0 : 1], skin);
  };

  if (!o.headOnly) {
    if (side) drawArm(-1, 'b', true);
    // ---------- torso ----------
    boilSeed(id + 'torso');
    if (mini) {
      const B = [[-.42 * u, neckY], [.42 * u, neckY], [.5 * u, hipY + .1 * u], [0, hipY + .45 * u], [-.5 * u, hipY + .1 * u]];
      paint(B, { wash: mini === 'angel' ? ST.angel : ST.devil, ink: ST.ink, sw, curv: .5 });
    } else if (who === 'nerd') {
      const w0 = D.sh + .06 + (o.shrug || 0) * .04, w1 = D.hip + .14;
      const B = side ? [[-.36 * u, neckY], [.32 * u, neckY], [.42 * u, hipY + .22 * u], [-.46 * u, hipY + .22 * u]]
        : [[-w0 * u, neckY + .06 * u], [w0 * u, neckY + .06 * u], [w1 * u, hipY + .24 * u], [-w1 * u, hipY + .24 * u]];
      paint(B, { wash: ST.tee, ink: ST.ink, sw, curv: .25 });
      if (!side && !back) { // a small game-controller print on the oversized tee
        const cy = neckY + D.torso * .45 * u;
        paint(rrPts(-.22 * u, cy - .08 * u, .44 * u, .17 * u, .08 * u), { wash: ST.cream, washOp: 200, ink: null });
        for (const k of [-1, 1]) paint(ellPts(k * .11 * u, cy, .03 * u, .03 * u, 8), { wash: ST.teeDk, ink: null });
      }
      inkLine(side ? [[-.1 * u, neckY + .02 * u], [.12 * u, neckY + .1 * u]] : [[-.2 * u, neckY + .06 * u], [0, neckY + .18 * u], [.2 * u, neckY + .06 * u]], sw * .6, ST.ink, 'ink', .6);
    } else {
      const w0 = D.sh + .04, w1 = D.hip + .06;
      const B = side ? [[-.3 * u, neckY], [.3 * u, neckY], [.38 * u, hipY + .1 * u], [-.4 * u, hipY + .1 * u]]
        : [[-w0 * u, neckY + .05 * u], [w0 * u, neckY + .05 * u], [w1 * u, hipY + .12 * u], [-w1 * u, hipY + .12 * u]];
      paint(B, { wash: ST.blouse, ink: ST.ink, sw, curv: .2 });
      // open cardigan: two front panels
      if (!back) {
        const pan = side ? [[[-.3 * u, neckY], [.05 * u, neckY], [-.02 * u, hipY + .2 * u], [-.42 * u, hipY + .14 * u]]]
          : [-1, 1].map(s => [[s * w0 * u, neckY + .05 * u], [s * .14 * u, neckY + .05 * u], [s * .2 * u, hipY + .26 * u], [s * (w1 + .04) * u, hipY + .18 * u]]);
        for (const P of pan) paint(P, { wash: ST.cardi, ink: ST.ink, sw, curv: .2 });
      } else paint(B, { wash: ST.cardi, ink: ST.ink, sw, curv: .2 });
    }
    if (sit > .5) drawLegs();
  }

  // ---------- head ----------
  const hj = shk ? [Math.sin(t * 61) * .03 * u * shk, 0] : [0, 0];
  push(); translate(hc[0] + hj[0], hc[1]); rotate(o.tilt || 0);
  const tn = view === 'front' ? clamp(o.turn || 0, -1, 1) : 0, at = Math.abs(tn);
  const rx = hr * (side ? 1 : 1 - .06 * at) * (who === 'nerd' ? 1.04 : .92), ry = hr * (who === 'mom' ? 1.08 : 1);
  const HAIR = ST[D.hair], HAIRHI = ST[D.hairHi];
  // neck
  boilSeed(id + 'neck');
  if (!o.headOnly || true) paint(rectPts(-.13 * u, ry * .6, .26 * u, .35 * u), { wash: SKD, ink: ST.ink, sw: sw * .5 });
  if (o.headOnly && !mini) paint(ellPts(0, ry * 1.05 + .2 * u, .7 * u, .26 * u, 16), { wash: who === 'mom' ? ST.cardi : ST.tee, ink: ST.ink, sw: sw * .7 });

  // back-of-head hair (mom's bun sits behind)
  boilSeed(id + 'hairB');
  if (who === 'mom') {
    const bx = side ? -rx * .75 : (back ? 0 : -tn * rx * .5), by = -ry * (side ? .55 : .95);
    paint(ellPts(bx, by, rx * .42, ry * .38, 16, 1.5), { wash: HAIR, ink: ST.ink, sw: sw * .7 });
    inkLine([[bx - rx * .2, by - ry * .1], [bx + rx * .15, by + ry * .12]], sw * .4, HAIRHI, 'inkfine', .5);
    if (!back) paint(ellPts(0, -ry * .05, rx * 1.08, ry * 1.04, 26), { wash: HAIR, ink: ST.ink, sw: sw * .8 });  // hair mass behind face
  }
  if (who === 'nerd' && !back) paint(ellPts(side ? -rx * .1 : 0, -ry * .12, rx * 1.07, ry * 1.0, 26, 1), { wash: HAIR, ink: ST.ink, sw: sw * .8 });

  // ears + face
  boilSeed(id + 'face0');
  if (!back) {
    const ex = side ? [-rx * .15] : [-1, 1].map(s => s * rx * (1 - .5 * (Math.sign(s) === Math.sign(tn) ? at : 0)) * .97 - tn * rx * .15);
    for (const e of ex) paint(ellPts(e, ry * .05, rx * .17, ry * .22, 12), { wash: SK, ink: ST.ink, sw: sw * .6 });
    const facePts = side ? [...ellPts(0, 0, rx * .92, ry * .95, 26).slice(0, 26)] : ellPts(tn * rx * .06, 0, rx * .95, ry * .96, 28);
    paint(facePts, { wash: SK, ink: ST.ink, sw });
    if (side) paint(ellPts(rx * .9, ry * .08, rx * .12, ry * .12, 10), { wash: SK, ink: ST.ink, sw: sw * .5 });   // nose
  } else paint(ellPts(0, 0, rx, ry, 26), { wash: HAIR, ink: ST.ink, sw });
  if (o.screen) glow(rx * .2, ry * .2, rx * 2.2, ST.screenGlow, .5 * o.screen);

  // ---------- face features ----------
  if (!back) {
    boilSeed(id + 'face');
    const lk = o.look || [0, 0], fx = side ? rx * .5 : tn * rx * .42, er = .085 * u * (who === 'mom' ? .85 : 1);
    const EX = side ? [[.0, 1]] : [-.36, .36].map(e => [e * (1 - .4 * at), Math.sign(e) === -Math.sign(tn) ? 1 - .6 * at : 1]).filter(e => e[1] > .45);
    let eyes = o.eyes || 'dot';
    if (o.blink === 1) eyes = 'shut';
    else if (o.blink !== false && !['shut', 'happy', 'star'].includes(eyes)) {
      let h = 7; for (const c of id) h = (h * 31 + c.charCodeAt(0)) % 9973;
      const per = 2.6 + 1.5 * hash(h), ph = hash(h + 7.7) * per; if ((t + ph) % per < .12) eyes = 'shut';
    }
    const brow = o.brow ?? null, eyeY = ry * .02;
    for (const [e, wk] of EX) {
      const cx = fx + e * rx + lk[0] * er * .9, cy = eyeY + lk[1] * er * .8, ew = er * wk, sg = side ? 1 : Math.sign(e);
      if (eyes === 'shut') inkLine([[cx - ew * 1.3, cy], [cx + ew * 1.3, cy + er * .15]], sw * .8, ST.ink, 'ink', 0);
      else if (eyes === 'happy') inkLine([[cx - ew * 1.3, cy + er * .5], [cx, cy - er * .7], [cx + ew * 1.3, cy + er * .5]], sw * .8, ST.ink, 'ink', .7);
      else if (eyes === 'wide') { paint(ellPts(cx, cy, ew * 1.7, er * 1.9, 12), { wash: ST.cream, ink: ST.ink, sw: sw * .6 }); paint(ellPts(cx + lk[0] * er * .5, cy + lk[1] * er * .5, ew * .6, er * .7, 8), { wash: ST.ink, ink: null }); }
      else if (eyes === 'star') { glow(cx, cy, er * 4, ST.gold, .6); paint(starPts(cx, cy, er * 2, .45, 4, t * 2), { wash: ST.gold, ink: ST.ink, sw: sw * .4 }); }
      else if (eyes === 'squint') { paint(ellPts(cx, cy + er * .1, ew * 1.1, er * .3, 10), { wash: ST.ink, ink: null }); }
      else if (eyes === 'half') { const B = []; for (let i = 0; i <= 8; i++) { const a = i / 8 * Math.PI; B.push([cx + Math.cos(a) * ew, cy - er * .1 + Math.sin(a) * er * 1.05]); } paint(B, { wash: ST.ink, ink: null }); inkLine([[cx - ew * 1.4, cy - er * .15], [cx + ew * 1.4, cy - er * .1]], sw * .65, ST.ink, 'ink', 0); }
      else if (eyes === 'sad') paint(ellPts(cx, cy + er * .25, ew * .85, er, 10), { wash: ST.ink, ink: null });
      else { paint(ellPts(cx, cy, ew, er * 1.25, 10), { wash: ST.ink, ink: null }); paint(ellPts(cx + er * .3, cy - er * .4, er * .28, er * .28, 6), { wash: ST.cream, ink: null }); }
      if (eyes === 'teary' || (o.tears || 0) > 0) paint(ellPts(cx, cy + er * 1.1, ew * 1.2, er * .45, 10), { wash: ST.tear, washOp: 220, ink: null });
      if ((o.tears || 0) > .3) { const L = er * (2 + 5 * o.tears); paint(ribbon([[cx + sg * ew * .5, cy + er], [cx + sg * ew * .8, cy + er + L * .5], [cx + sg * ew * .6, cy + er + L]], er * .35, er * .5), { wash: ST.tear, washOp: 230, ink: null }); }
      if (brow) {
        const by = cy - er * (who === 'nerd' ? 3.4 : 2.6), Hh = { up: [-.6, -.6, -.6], worry: [.3, -.9, -.2], angry: [-.6, .7, 0], sad: [.6, -.4, .1], flat: [0, 0, 0] }[brow] || [0, 0, 0];
        const out = [cx + sg * ew * 1.6, by + Hh[0] * er], inn = [cx - sg * ew * 1.3, by + Hh[1] * er], mid = [cx, by + (Hh[0] + Hh[1]) / 2 * er + Hh[2] * er];
        inkLine([out, mid, inn], sw * .7, ST.ink, 'ink', .6);
      }
    }
    // Nerd's round glasses (the trait that reads at thumbnail size)
    if (who === 'nerd') {
      boilSeed(id + 'glasses');
      const gr = er * 2.6;
      for (const [e, wk] of EX) {
        const cx = fx + e * rx, cy = eyeY;
        paint(ellPts(cx, cy, gr * wk, gr, 18), { wash: ST.lens, washOp: 60, ink: ST.glass, sw: sw * .9 });
        inkLine([[cx - gr * .45 * wk, cy - gr * .5], [cx - gr * .1 * wk, cy - gr * .7]], sw * .4, ST.cream, 'inkfine', 0);
      }
      if (EX.length === 2) inkLine([[fx + EX[0][0] * rx + gr * EX[0][1], eyeY - gr * .1], [fx + EX[1][0] * rx - gr * EX[1][1], eyeY - gr * .1]], sw * .7, ST.glass, 'ink', .5);
      if (side) inkLine([[fx - gr, eyeY], [-rx * .1, eyeY - gr * .1]], sw * .6, ST.glass, 'ink', 0);
    }
    if (o.blush) for (const [e, wk] of EX) paint(ellPts(fx + e * rx * 1.15, eyeY + er * 3.4, er * 1.8 * wk, er * .9, 10), { wash: ST.blush, washOp: 150 * clamp(o.blush), ink: null });
    // mouth
    let m = o.mouth ?? 'smile', mo = o.mouthOpen ?? .5;
    if (o.sing) { const v = typeof VOX === 'function' ? VOX(t) : 0; if (v > .08) { m = 'open'; mo = v; } else m = m ?? 'flat'; }
    const mx = fx + (side ? rx * .25 : tn * rx * .1) + lk[0] * er * .5, my = ry * .5, mw = (side ? .65 : 1 - .3 * at) * u * (who === 'mom' ? .85 : 1);
    if (m === 'smile') inkLine([[mx - .13 * mw, my - .03 * u], [mx, my + .06 * u], [mx + .13 * mw, my - .03 * u]], sw * .7, ST.ink, 'ink', .7);
    else if (m === 'smirk') inkLine([[mx - .1 * mw, my + .01 * u], [mx + .05 * mw, my + .03 * u], [mx + .14 * mw, my - .04 * u]], sw * .7, ST.ink, 'ink', .6);
    else if (m === 'o') paint(ellPts(mx, my + .02 * u, .06 * mw, .08 * u, 10), { wash: ST.ink, ink: null });
    else if (m === 'flat') inkLine([[mx - .1 * mw, my], [mx + .1 * mw, my]], sw * .6, ST.ink, 'ink', 0);
    else if (m === 'tight') { inkLine([[mx - .12 * mw, my + .01 * u], [mx + .12 * mw, my]], sw * .6, ST.ink, 'ink', 0); inkLine([[mx - .05 * mw, my - .03 * u], [mx - .05 * mw, my + .04 * u]], sw * .4, ST.ink, 'ink', 0); }
    else if (m === 'frown') inkLine([[mx - .13 * mw, my + .06 * u], [mx, my - .02 * u], [mx + .13 * mw, my + .06 * u]], sw * .7, ST.ink, 'ink', .7);
    else if (m === 'wobble') { const Wv = []; for (let i = 0; i <= 6; i++) Wv.push([mx + (i / 6 - .5) * .28 * mw, my + (i % 2 ? -.025 : .025) * u]); inkLine(Wv, sw * .6, ST.ink, 'ink', 0); }
    else if (m === 'grin') {
      const G = [[mx - .19 * mw, my - .04 * u]]; for (let i = 0; i <= 8; i++) { const a = i / 8 * Math.PI; G.push([mx + Math.cos(Math.PI - a) * .19 * mw, my - .04 * u + Math.sin(a) * .15 * u]); }
      paint(G, { wash: ST.ink, ink: null }); paint(rectPts(mx - .15 * mw, my - .035 * u, .3 * mw, .04 * u), { wash: ST.cream, ink: null });
    } else if (m === 'open') {
      const k = clamp(mo), hh = .04 + .17 * k, wd = (.08 + .06 * k) * mw;
      paint(ellPts(mx, my + hh * .4 * u, wd, hh * u, 12), { wash: ST.ink, ink: null });
      if (k > .45) paint(ellPts(mx, my + hh * .95 * u, wd * .55, hh * .35 * u, 10), { wash: ST.lip, ink: null });
    }
    if ((o.sweat || 0) > .05) { const sxp = fx + rx * .75, syp = -ry * .35 + o.sweat * .1 * u; paint([[sxp, syp - .16 * u], [sxp + .07 * u, syp], [sxp, syp + .05 * u], [sxp - .07 * u, syp]], { wash: ST.sweat, ink: ST.ink, sw: sw * .4, curv: .6 }); }
  }

  // ---------- front hair ----------
  boilSeed(id + 'hairF');
  if (who === 'nerd') {
    // mop with a jagged fringe; the cowlick tuft is Nerd's mood flag
    const fr = [], n = 9, sh = side ? rx * .25 : tn * rx * .35;
    fr.push([-rx * 1.08 + sh * .3, ry * .05]);
    for (let i = 0; i <= 26; i++) { const a = Math.PI + i / 26 * Math.PI; fr.push([Math.cos(a) * rx * 1.08 + sh * .2, Math.sin(a) * ry * 1.04 - ry * .08]); }
    fr.push([rx * 1.08 + sh * .3, ry * .05]);
    if (!back) for (let i = n; i >= 0; i--) { const k = i / n, xx = lerp(-rx * .95, rx * .95, k) + sh, yy = -ry * (.28 + (i % 2 ? .1 : -.02)) - (side && k < .4 ? ry * .3 : 0); fr.push([xx, yy]); }
    if (side) {   // profile: a cap over the top and the back of the head, a short jagged fringe at the front, behind the ear
      const C = [];
      for (let i = 0; i <= 20; i++) { const a = (160 + i / 20 * 172) * Math.PI / 180; C.push([Math.cos(a) * rx * 1.07, Math.sin(a) * ry * 1.04 - ry * .06]); }
      C.push([rx * .62, -ry * .2], [rx * .48, -ry * .4], [rx * .34, -ry * .22], [rx * .16, -ry * .36], [-rx * .02, -ry * .16], [-rx * .3, ry * .02], [-rx * .5, ry * .48], [-rx * .82, ry * .52]);
      paint(C, { wash: HAIR, ink: ST.ink, sw: sw * .8 });
      paint(ellPts(-rx * .15, ry * .08, rx * .16, ry * .21, 12), { wash: SK, ink: ST.ink, sw: sw * .6 });   // ear in front of the hair
    } else if (!back) paint(fr, { wash: HAIR, ink: ST.ink, sw: sw * .8 });
    inkLine([[-rx * .35 + sh, -ry * .8], [-rx * .05 + sh, -ry * .55]], sw * .45, HAIRHI, 'inkfine', .4);
    const tf = clamp(o.tuft ?? .5, -1, 1), base = [rx * .15 + sh * .5, -ry * 1.08];
    // tf >= 0: the tuft stands up and curls; tf < 0: it flops over and lies on the hair
    const up = Math.max(0, tf), dn = Math.max(0, -tf), sway = Math.sin(t * 5) * .02 * ry;
    const tip = [base[0] + (.35 - .15 * up + .3 * dn) * rx, base[1] - (.3 + .25 * up - .55 * dn) * ry + sway];
    const midp = [base[0] + (.02 + .2 * dn) * rx, base[1] - (.28 + .18 * up - .1 * dn) * ry];
    paint(ribbon([base, midp, tip], .16 * u, .02 * u), { wash: HAIR, ink: ST.ink, sw: sw * .6 });
  } else {
    if (!back) {
      const sh = side ? rx * .3 : tn * rx * .3, P = [];
      for (let i = 0; i <= 24; i++) { const a = Math.PI + i / 24 * Math.PI; P.push([Math.cos(a) * rx * 1.04 + sh * .3, Math.sin(a) * ry * 1.02 - ry * .04]); }
      P.push([rx * .55 + sh, -ry * .42], [rx * .05 + sh, -ry * .62], [-rx * .5 + sh, -ry * .4], [-rx * 1.0 + sh * .3, -ry * .05]);
      paint(P, { wash: HAIR, ink: ST.ink, sw: sw * .8, curv: .4 });
      // loose strands
      for (const s of side ? [-1] : [-1, 1]) inkLine([[s * rx * .9 + sh * .2, -ry * .3], [s * rx * 1.02, ry * .25], [s * rx * .92, ry * .55]], sw * .55, HAIR, 'ink', .6);
      // glasses pushed up on her head
      boilSeed(id + 'mg');
      for (const s of side ? [1] : [-1, 1]) paint(ellPts(s * rx * .3 + sh * .6, -ry * .78, rx * .2, ry * .13, 14), { wash: ST.lens, washOp: 90, ink: ST.glass, sw: sw * .6 });
      if (!side) inkLine([[-rx * .1 + sh * .6, -ry * .8], [rx * .1 + sh * .6, -ry * .8]], sw * .5, ST.glass, 'ink', 0);
    }
  }
  // inner-voice marks
  if (mini === 'angel') { boilSeed(id + 'halo'); glow(0, -ry * 1.5, rx * 1.2, ST.halo, .6); paint(ellPts(0, -ry * 1.45, rx * .7, ry * .16, 20), { wash: null, ink: ST.goldDk, sw: sw * 1.6 }); }
  if (mini === 'devil') { boilSeed(id + 'horns'); for (const s of [-1, 1]) paint([[s * rx * .45, -ry * .75], [s * rx * .8, -ry * 1.35], [s * rx * .75, -ry * .7]], { wash: ST.devil, ink: ST.ink, sw: sw * .6, curv: .3 }); }
  pop();

  if (!o.headOnly) { if (side) drawArm(1, 'f'); else { drawArm(-1, 'l'); drawArm(1, 'r'); } }
  if (mini === 'devil' && !o.headOnly) { boilSeed(id + 'tail'); paint(ribbon([[-.2 * u, hipY + .3 * u], [-.7 * u, hipY + .5 * u + Math.sin(t * 4) * .1 * u], [-.9 * u, hipY + .1 * u]], .07 * u, .03 * u), { wash: ST.devil, ink: ST.ink, sw: sw * .5 }); }
  pop();
  return { head: toW([hc[0] + hj[0], hc[1]]), hand: toW(armPts(1)[2]), handB: toW(armPts(-1)[2]), shoulder: toW(armPts(1)[0]), shoulderB: toW(armPts(-1)[0]) };
}

// Floating inner voice: a mini Nerd with a halo (doubt / warning) or horns (want). (x, y) = where it hovers.
function voice(x, y, u, kind, o = {}) {
  const t = o.t ?? T, bobY = Math.sin(t * TAU * .7 + (kind === 'devil' ? 1.7 : 0)) * .15 * u;
  return person(x, y + bobY, u, { who: 'nerd', mini: kind, arms: [[.6, .3], [.6, .3]], ...o });
}
