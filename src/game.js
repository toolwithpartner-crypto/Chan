// game.js: the "Robox" world. Avatars are soft rounded blocks (big rounded head, painted dot face), saturated colour,
// thick outlines: a different look from the watercolour home so the viewer always knows which world they are in.
// Deliberately NOT the look of any real game: no cylinder heads, no yellow/blue/green default.
//
// avatar(x, y, u, o): (x, y) = ground point; ~4.2u tall.
//   skin   'classic' (Nerd's plain starter skin) | 'friendA' | 'friendB' | 'admin'
//   wings  0..1 dragon wings out (friends; Nerd only in his imagination).   flap = wing beat phase (rad).
//   arms   [aL, aR] arm angles from straight down (+ = outward/up).   walk = leg phase.   view 'front' | 'side'.
//   face   'dot' | 'happy' | 'smug' | 'sad' | 'ko'.   badge true = the fake check mark the admin wears.
//   aura   0..1 glow behind (admin).   id = boil key.
const SKINS = {
  classic: { head: '#D9D3C7', body: ST.classic, arm: ST.classicDk, leg: ST.classicLeg },
  friendA: { head: '#F3D9B8', body: ST.violet, arm: '#5B3FB0', leg: '#2E2A4A', wing: ST.teal, wingDk: '#1E7C72', trim: ST.lime },
  friendB: { head: '#E7C29E', body: ST.pink, arm: '#C94A82', leg: '#3A2440', wing: ST.gold, wingDk: ST.goldDk, trim: ST.neon },
  admin: { head: '#F6EAD8', body: ST.admin, arm: '#E9DFCB', leg: '#D8CDB6', trim: ST.adminTrim },
};
function dragonWing(sx, sy, u, s, k, flap, col, colDk, sw) {
  // one bat-like wing from the shoulder blade: an arm bone and three finger tips, scalloped membrane between them
  const a0 = -.5 + Math.sin(flap) * .35, L = 2.4 * u * k;
  const tips = [0, 1, 2].map(i => { const a = a0 - .55 + i * .55; return [sx + s * Math.cos(a) * L * (1 - i * .12), sy + Math.sin(a) * L * (1 - i * .12) - .4 * u * k]; });
  const elbow = [sx + s * .9 * u * k, sy - .9 * u * k + Math.sin(flap) * .2 * u];
  const P = [[sx, sy], elbow, tips[0]];
  for (let i = 0; i < 2; i++) { const a = tips[i], b = tips[i + 1]; P.push([lerp(a[0], b[0], .5) - s * .25 * u * k, lerp(a[1], b[1], .5) + .35 * u * k], b); }
  P.push([sx + s * .3 * u * k, sy + .5 * u * k]);
  paint(P, { wash: col, ink: ST.ink, sw, curv: .15 });
  for (const tp of tips) inkLine([elbow, tp], sw * .6, colDk, 'ink', .2);
}
function avatar(x, y, u, o = {}) {
  const t = o.t ?? T, S = SKINS[o.skin || 'classic'], id = 'av' + (o.id || o.skin || ''), side = o.view === 'side';
  const sw = clamp(u / 30, .5, 2.2) * 1.2, dir = o.flip ? -1 : 1, sq = o.sq || 0;
  const bob = Math.abs(Math.sin(t * TAU * BPM / 120)) * .05 * u;
  push(); translate(x, y - (o.dy || 0) * u - bob); scale(dir * (1 + sq * .5), 1 - sq);
  const legH = 1.2 * u, bodyH = 1.4 * u, bodyW = (side ? .8 : 1.3) * u, headS = 1.45 * u;
  const hipY = -legH, shY = hipY - bodyH, headCy = shY - headS * .55;
  if (o.aura) { glow(0, shY, 3.2 * u, ST.adminTrim, .6 * o.aura); glow(0, shY, 1.8 * u, '#FFFFFF', .3 * o.aura); }
  // wings behind everything
  if (o.wings && S.wing) { boilSeed(id + 'wing'); const k = clamp(o.wings), fl = o.flap ?? t * 7; glow(0, shY + .3 * u, 2.6 * u * k, S.wing, .35 * k); for (const s of side ? [-1] : [-1, 1]) dragonWing(s * .3 * u, shY + .35 * u, u, s, k, fl + (s > 0 ? .3 : 0), S.wing, S.wingDk, sw * .8); }
  // legs
  boilSeed(id + 'legs');
  const wp = (o.walk || 0) * Math.PI;
  for (const s of [-1, 1]) {
    const sx = side ? 0 : s * .32 * u, sw2 = side ? Math.sin(wp) * s * .5 * u : 0;
    push(); translate(sx, hipY); rotate(side ? Math.sin(wp) * s * .5 : 0);
    paint(rrPts(-.28 * u, 0, .56 * u, legH, .1 * u), { wash: s < 0 && side ? mixCol(S.leg, ST.ink, .3) : S.leg, ink: ST.ink, sw });
    pop();
  }
  // body (admin: a long robe with a gold hem)
  boilSeed(id + 'body');
  if (o.skin === 'admin') {
    paint([[-bodyW * .45, shY], [bodyW * .45, shY], [bodyW * .62, -.15 * u], [-bodyW * .62, -.15 * u]], { wash: S.body, ink: ST.ink, sw, curv: .1 });
    paint(rectPts(-bodyW * .62, -.45 * u, bodyW * 1.24, .3 * u), { wash: S.trim, ink: ST.ink, sw: sw * .7 });
    paint(rectPts(-.12 * u, shY, .24 * u, bodyH + legH * .6), { wash: S.trim, washOp: 230, ink: null });
  } else {
    paint(rrPts(-bodyW / 2, shY, bodyW, bodyH + .1 * u, .18 * u), { wash: S.body, ink: ST.ink, sw });
    if (S.trim) paint(rectPts(-bodyW / 2 + .05 * u, hipY - .25 * u, bodyW - .1 * u, .2 * u), { wash: S.trim, ink: null });
  }
  // arms (pivot at the shoulder)
  const A = o.arms || [.15, .15];
  const arm = (s, key) => {
    boilSeed(id + 'arm' + key);
    push(); translate(side ? 0 : s * (bodyW / 2 + .2 * u), shY + .15 * u); rotate(-s * (A[s < 0 ? 0 : 1] || 0) * (side ? -1 : 1) + (side ? Math.sin(wp) * s * .5 : 0));
    paint(rrPts(-.22 * u, -.12 * u, .44 * u, 1.35 * u, .14 * u), { wash: S.arm, ink: ST.ink, sw });
    if (o.sword && s > 0) { paint(rectPts(-.07 * u, 1.2 * u, .14 * u, 1.6 * u), { wash: o.sword === 'gold' ? ST.gold : '#B88A5A', ink: ST.ink, sw }); paint(rectPts(-.3 * u, 1.15 * u, .6 * u, .12 * u), { wash: ST.inkSoft, ink: ST.ink, sw: sw * .6 }); if (o.sword === 'gold') glow(0, 2 * u, 1.2 * u, ST.gold, .5); }
    pop();
  };
  if (side) arm(-1, 'b');
  // head
  boilSeed(id + 'head');
  paint(rrPts(-headS / 2 - (side ? .05 * u : 0), headCy - headS / 2, headS, headS, .38 * u), { wash: S.head, ink: ST.ink, sw: sw * 1.1 });
  if (o.skin === 'admin') paint([[-headS * .55, headCy - headS * .35], [-headS * .3, headCy - headS * .78], [0, headCy - headS * .55], [headS * .3, headCy - headS * .78], [headS * .55, headCy - headS * .35], [headS * .55, headCy - headS * .5], [-headS * .55, headCy - headS * .5]], { wash: S.trim, ink: ST.ink, sw: sw * .8 });
  if (o.skin === 'friendA' || o.skin === 'friendB') paint(rrPts(-headS * .52, headCy - headS * .58, headS * 1.04, headS * .3, .12 * u), { wash: S.body, ink: ST.ink, sw: sw * .8 });
  // painted face
  const f = o.face || 'dot', fx = side ? headS * .2 : 0, ey = headCy + .02 * u, er = .1 * u;
  for (const s of side ? [1] : [-1, 1]) {
    const ex = fx + s * .3 * u;
    if (f === 'happy' || f === 'smug') inkLine([[ex - er * 1.3, ey + er * .4], [ex, ey - er * .6], [ex + er * 1.3, ey + er * .4]], sw * .8, ST.ink, 'ink', .6);
    else if (f === 'ko') { inkLine([[ex - er, ey - er], [ex + er, ey + er]], sw * .7, ST.ink, 'ink', 0); inkLine([[ex + er, ey - er], [ex - er, ey + er]], sw * .7, ST.ink, 'ink', 0); }
    else paint(ellPts(ex, ey, er, er * 1.3, 10), { wash: ST.ink, ink: null });
    if (f === 'sad') inkLine([[ex - s * er * 1.4, ey - er * 2.2], [ex + s * er * .8, ey - er * 1.6]], sw * .6, ST.ink, 'ink', 0);
  }
  const my = headCy + .38 * u;
  if (f === 'smug') inkLine([[fx - .2 * u, my], [fx + .05 * u, my + .05 * u], [fx + .25 * u, my - .08 * u]], sw * .8, ST.ink, 'ink', .6);
  else if (f === 'sad' || f === 'ko') inkLine([[fx - .18 * u, my + .06 * u], [fx, my - .03 * u], [fx + .18 * u, my + .06 * u]], sw * .8, ST.ink, 'ink', .6);
  else inkLine([[fx - .2 * u, my - .03 * u], [fx, my + .08 * u], [fx + .2 * u, my - .03 * u]], sw * .8, ST.ink, 'ink', .6);
  // the fake "verified" mark: a green disc with a tick, floating over the head
  if (o.badge) { boilSeed(id + 'badge'); const by = headCy - headS * 1.05 + Math.sin(t * 3) * .06 * u; glow(0, by, .9 * u, ST.badge, .5); paint(ellPts(0, by, .32 * u, .32 * u, 16), { wash: ST.badge, ink: ST.ink, sw: sw * .7 }); inkLine([[-.14 * u, by], [-.03 * u, by + .11 * u], [.16 * u, by - .12 * u]], sw * 1.1, ST.cream, 'ink', 0); }
  arm(1, 'f'); if (!side) arm(-1, 'l');
  pop();
  return { head: [x, y - (o.dy || 0) * u + headCy], top: [x, y + headCy - headS] };
}

// ---------- props ----------
// The family tablet (logged in to Mom's account). (x, y) = centre; ang = rotation; k = screen brightness 0..1.
// Draw it after the person, at their hand(s), so it sits in front of the fingers.
function tablet(x, y, u, ang = 0, k = 1, o = {}) {
  boilSeed('tablet' + (o.id || ''));
  push(); translate(x, y); rotate(ang);
  const w = 1.35 * u, h = .95 * u;
  if (k > .02 && !o.back) glow(0, 0, w * 1.4, ST.screenGlow, .45 * k);
  paint(rrPts(-w / 2, -h / 2, w, h, .1 * u), { wash: o.back ? '#5A6170' : ST.inkSoft, ink: ST.ink, sw: clamp(u / 40, .4, 1.6) });
  if (!o.back) paint(rrPts(-w / 2 + .07 * u, -h / 2 + .07 * u, w - .14 * u, h - .14 * u, .05 * u), { wash: mixCol('#2B3550', ST.screen, k), ink: null });
  pop();
}
// Mom's phone (also the bank call).
function phone(x, y, u, ang = 0, k = 1, o = {}) {
  boilSeed('phone' + (o.id || ''));
  push(); translate(x, y); rotate(ang);
  const w = .42 * u, h = .82 * u;
  if (k > .02) glow(0, 0, h, ST.screenGlow, .3 * k);
  paint(rrPts(-w / 2, -h / 2, w, h, .07 * u), { wash: ST.inkSoft, ink: ST.ink, sw: clamp(u / 50, .4, 1.4) });
  paint(rrPts(-w / 2 + .04 * u, -h / 2 + .05 * u, w - .08 * u, h - .1 * u, .04 * u), { wash: mixCol('#2B3550', o.col || ST.screen, k), ink: null });
  pop();
}
