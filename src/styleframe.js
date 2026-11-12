// styleframe.js: one frame (sentence 14: night, the "admin" offers a secret gift) drawn in each candidate look.
//   node render.mjs --soft-gl --loop=sf_water  --sheet=1.3 --cols=1 --w=1920 --out=out/check/style_water.jpg
//   (sf_flat, sf_pencil likewise)
(() => {
  const thai = (txt, x, y, size, col, o = {}) => letter(txt, x, y, size, col, { font: `${o.w || 600} ${size}px Mali, Loma, sans-serif`, ink: false, align: o.align || 'left', ...o });

  function room(t) {
    boilSeed('wall');
    paint(rectPts(-40, -40, W + 80, H + 80), { wash: '#2C3157', ink: null });
    paint(ellPts(1250, 380, 900, 520, 30, 10), { fill: '#3B4275', fillOp: 120, bleed: .25, tex: .5, ink: null });
    paint(ellPts(300, 900, 700, 300, 24, 10), { fill: '#1F2342', fillOp: 120, bleed: .25, tex: .5, ink: null });
    // window with the night outside
    boilSeed('win');
    paint(rectPts(110, 120, 400, 430, 2), { wash: '#18204A', ink: ST.ink, sw: 1.6 });
    glow(400, 210, 120, '#F4E7C2', .5);
    paint(ellPts(400, 210, 38, 38, 20, .8), { wash: '#F4E7C2', ink: null });
    for (let i = 0; i < 6; i++) { boilSeed('bld' + i); const bx = 120 + i * 66, bh = 90 + 120 * hash(i * 3.3); paint(rectPts(bx, 550 - bh, 58, bh), { wash: '#232B5C', ink: null }); for (let k = 0; k < 4; k++) if (hash(i * 11 + k) > .55) paint(rectPts(bx + 10 + (k % 2) * 22, 560 - bh + 20 + Math.floor(k / 2) * 30, 12, 14), { wash: '#F2C96B', ink: null }); }
    boilSeed('winf'); inkLine([[310, 120], [310, 550]], 1.6, ST.ink, 'ink', 0); inkLine([[110, 335], [510, 335]], 1.6, ST.ink, 'ink', 0);
    boilSeed('curt'); for (const s of [0, 1]) paint([[s ? 500 : 80, 100], [s ? 560 : 140, 100], [s ? 575 : 125, 590], [s ? 488 : 92, 600]], { wash: '#5A4A7A', ink: ST.ink, sw: 1, curv: .3 });
    // wall clock at 20:45
    boilSeed('clock'); paint(ellPts(700, 200, 52, 52, 24), { wash: ST.cream, ink: ST.ink, sw: 1.4 });
    inkLine([[700, 200], [700 - 38, 200]], 1.2, ST.ink, 'ink', 0); inkLine([[700, 200], [700 - 18, 200 + 16]], 1.8, ST.ink, 'ink', 0); paint(ellPts(700, 200, 4, 4, 8), { wash: ST.ink, ink: null });
    // shelf with game figures
    boilSeed('shelf'); paint(rectPts(1360, 560, 420, 22), { wash: '#7A5A44', ink: ST.ink, sw: 1.2 });
    avatar(1420, 560, 14, { skin: 'friendA', id: 's1', face: 'happy' }); avatar(1500, 560, 12, { skin: 'classic', id: 's2' });
    boilSeed('books'); for (let i = 0; i < 5; i++) paint(rectPts(1600 + i * 30, 470 + 20 * hash(i), 26, 90 - 20 * hash(i)), { wash: [ST.teal, ST.pink, ST.gold, ST.violet, ST.tee][i], ink: ST.ink, sw: .9 });
    // bed
    boilSeed('bed'); paint(rrPts(260, 760, 1300, 360, 40), { wash: '#6E5A7E', ink: ST.ink, sw: 1.5 });
    paint(rrPts(280, 700, 360, 120, 50), { wash: '#E8E0EE', ink: ST.ink, sw: 1.3 });
    // nightstand + lamp (warm, small)
    boilSeed('lamp'); paint(rectPts(1600, 800, 220, 280), { wash: '#7A5A44', ink: ST.ink, sw: 1.3 });
    glow(1700, 700, 220, '#FFC873', .55); paint([[1660, 650], [1740, 650], [1765, 720], [1635, 720]], { wash: '#F2D398', ink: ST.ink, sw: 1.1 }); paint(rectPts(1693, 720, 14, 80), { wash: ST.inkSoft, ink: null });
  }

  function frame(t) {
    room(t);
    const U = 110, nx = 760, ny = 800, tx = 905, ty = 700;
    // Nerd, sitting on the bed, lit by the tablet
    const r = person(nx, ny, U, { who: 'nerd', id: 'sf', sit: 1, seat: .12, eyes: 'star', mouth: 'open', mouthOpen: .45, blush: .7, tuft: 1, screen: 1, look: [.3, .5], tilt: .06,
      reach: [[tx - .62 * U, ty + .12 * U], [tx + .6 * U, ty + .02 * U]], hands: ['hold', 'hold'] });
    boilSeed('blanket'); paint([[430, 800], [1180, 790], [1260, 880], [1500, 900], [1500, 1100], [380, 1100], [360, 880]], { wash: '#3FA39A', ink: ST.ink, sw: 1.5, curv: .4 });
    inkLine([[560, 900], [760, 870], [980, 905]], 1, '#2B7C74', 'ink', .6);
    tablet(tx, ty, U, -.15, 1, { id: 'sf' });
    // the admin avatar steps out of the screen light, holding the gift
    glow(tx + 20, ty - 90, 200, ST.adminTrim, .45);
    avatar(tx + 30, ty - 40, 30, { skin: 'admin', id: 'sfa', face: 'happy', badge: true, aura: .7, arms: [.15, 1.2] });
    boilSeed('gift'); const gx = tx + 110, gy = ty - 120 + Math.sin(t * 3) * 4;
    paint(rrPts(gx - 28, gy - 22, 56, 46, 6), { wash: ST.pink, ink: ST.ink, sw: 1 }); paint(rectPts(gx - 5, gy - 22, 10, 46), { wash: ST.gold, ink: null });
    paint(ellPts(gx - 10, gy - 28, 12, 8, 10), { wash: ST.gold, ink: ST.ink, sw: .7 }); paint(ellPts(gx + 10, gy - 28, 12, 8, 10), { wash: ST.gold, ink: ST.ink, sw: .7 });
    // inner voice of doubt at his shoulder
    voice(560, 470, 36, 'angel', { id: 'sfv', eyes: 'half', brow: 'worry', mouth: 'tight', look: [.6, .3] });
    // the chat bubble (what the viewer must read)
    boilSeed('bubble');
    const bx = 1100, by = 150, bw = 720, bh = 300;
    paint([[bx + 80, by + bh - 10], [bx + 160, by + bh - 10], [tx + 70, ty - 150]], { wash: ST.cream, ink: ST.ink, sw: 1.4 });
    paint(rrPts(bx, by, bw, bh, 36), { wash: ST.cream, ink: ST.ink, sw: 1.6 });
    paint(ellPts(bx + 60, by + 58, 30, 30, 14), { wash: ST.admin, ink: ST.ink, sw: 1 });
    paint(ellPts(bx + 330, by + 56, 15, 15, 12), { wash: ST.badge, ink: ST.ink, sw: .7 });
    inkLine([[bx + 322, by + 56], [bx + 328, by + 63], [bx + 339, by + 49]], 1.4, ST.cream, 'ink', 0);
    for (const k of [-1, 1]) paint(ellPts(bx + 60 + k * 9, by + 55, 3, 4, 6), { wash: ST.ink, ink: null });
    inkLine([[bx + 52, by + 67], [bx + 60, by + 72], [bx + 68, by + 67]], .8, ST.ink, 'ink', .6);
    thai('Admin_Official', bx + 102, by + 58, 30, '#6B5A3A', { w: 700 });
    thai('แอดมินมีของขวัญพิเศษ', bx + 44, by + 130, 44, ST.ink);
    thai('ให้น้องคนเดียวเลย', bx + 44, by + 188, 44, ST.ink);
    thai('แต่อย่าบอกใครนะ', bx + 44, by + 248, 46, '#B23A48', { w: 700 });
  }
  for (const L of ['water', 'flat', 'pencil']) { LOOPS['sf_' + L] = t => { LOOK = L; frame(t); }; LOOPS['sf_' + L].len = 4; }
})();
