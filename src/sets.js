// sets.js: the film's recurring places, drawn the same way every time they appear.
//   bedroom(t, o)  Nerd's room at night (o.lamp 0..1 warm lamp).  Bed top at y≈760; Nerd sits at (760, 800), U = 110.
//   homeDay(t)     the front room by day (flashback): door on the left, sofa on the right. Floor at y≈930.
//   roboxWorld(t)  the game: bright sky, block hills, a tiled plaza. Ground at y≈900.
//   sepia(k)       flashback tint over the whole frame (call after camEnd()).
function bedroom(t, o = {}) {
  boilSeed('br-wall');
  paint(rectPts(-400, -300, W + 800, H + 600), { wash: '#2C3157', ink: null });
  paint(ellPts(1250, 380, 900, 520, 30, 10), { fill: '#3B4275', fillOp: 120, bleed: .25, tex: .5, ink: null });
  paint(ellPts(300, 900, 700, 300, 24, 10), { fill: '#1F2342', fillOp: 120, bleed: .25, tex: .5, ink: null });
  boilSeed('br-win');
  paint(rectPts(110, 120, 400, 430, 2), { wash: '#18204A', ink: ST.ink, sw: 1.6 });
  glow(400, 210, 120, '#F4E7C2', .5);
  paint(ellPts(400, 210, 38, 38, 20, .8), { wash: '#F4E7C2', ink: null });
  for (let i = 0; i < 6; i++) { boilSeed('br-bld' + i); const bx = 120 + i * 66, bh = 90 + 120 * hash(i * 3.3); paint(rectPts(bx, 550 - bh, 58, bh), { wash: '#232B5C', ink: null }); for (let k = 0; k < 4; k++) if (hash(i * 11 + k) > .55) paint(rectPts(bx + 10 + (k % 2) * 22, 560 - bh + 20 + Math.floor(k / 2) * 30, 12, 14), { wash: '#F2C96B', ink: null }); }
  boilSeed('br-winf'); inkLine([[310, 120], [310, 550]], 1.6, ST.ink, 'ink', 0); inkLine([[110, 335], [510, 335]], 1.6, ST.ink, 'ink', 0);
  boilSeed('br-curt'); for (const s of [0, 1]) paint([[s ? 500 : 80, 100], [s ? 560 : 140, 100], [s ? 575 : 125, 590], [s ? 488 : 92, 600]], { wash: '#5A4A7A', ink: ST.ink, sw: 1, curv: .3 });
  const hr = o.clock ?? 20.75;   // the wall clock tells the time of night
  boilSeed('br-clock'); paint(ellPts(700, 200, 52, 52, 24), { wash: ST.cream, ink: ST.ink, sw: 1.4 });
  const am = (hr % 1) * TAU - Math.PI / 2, ah = (hr % 12) / 12 * TAU - Math.PI / 2;
  inkLine([[700, 200], [700 + Math.cos(am) * 38, 200 + Math.sin(am) * 38]], 1.2, ST.ink, 'ink', 0);
  inkLine([[700, 200], [700 + Math.cos(ah) * 24, 200 + Math.sin(ah) * 24]], 1.8, ST.ink, 'ink', 0);
  boilSeed('br-shelf'); paint(rectPts(1360, 560, 420, 22), { wash: '#7A5A44', ink: ST.ink, sw: 1.2 });
  avatar(1420, 560, 14, { skin: 'friendA', id: 'brs1', face: 'happy', t: 0 }); avatar(1500, 560, 12, { skin: 'classic', id: 'brs2', t: 0 });
  boilSeed('br-books'); for (let i = 0; i < 5; i++) paint(rectPts(1600 + i * 30, 470 + 20 * hash(i), 26, 90 - 20 * hash(i)), { wash: [ST.teal, ST.pink, ST.gold, ST.violet, ST.tee][i], ink: ST.ink, sw: .9 });
  boilSeed('br-bed'); paint(rrPts(260, 760, 1300, 420, 40), { wash: '#6E5A7E', ink: ST.ink, sw: 1.5 });
  paint(rrPts(280, 700, 360, 120, 50), { wash: '#E8E0EE', ink: ST.ink, sw: 1.3 });
  boilSeed('br-lamp'); paint(rectPts(1600, 800, 220, 380), { wash: '#7A5A44', ink: ST.ink, sw: 1.3 });
  glow(1700, 700, 220, '#FFC873', .55 * (o.lamp ?? 1)); paint([[1660, 650], [1740, 650], [1765, 720], [1635, 720]], { wash: '#F2D398', ink: ST.ink, sw: 1.1 }); paint(rectPts(1693, 720, 14, 80), { wash: ST.inkSoft, ink: null });
}
function blanket() {
  boilSeed('br-blanket'); paint([[430, 800], [1180, 790], [1260, 880], [1500, 900], [1500, 1200], [380, 1200], [360, 880]], { wash: '#3FA39A', ink: ST.ink, sw: 1.5, curv: .4 });
  inkLine([[560, 900], [760, 870], [980, 905]], 1, '#2B7C74', 'ink', .6);
}

function homeDay(t) {
  boilSeed('hd-wall'); paint(rectPts(-400, -300, W + 800, H + 600), { wash: '#EFE3CC', ink: null });
  paint(ellPts(1100, 300, 900, 380, 24, 8), { fill: '#FFF6E0', fillOp: 140, bleed: .3, tex: .4, ink: null });
  boilSeed('hd-floor'); paint(rectPts(-400, 930, W + 800, 500), { wash: '#B98E62', ink: ST.ink, sw: 1.2 });
  for (let i = 0; i < 8; i++) inkLine([[-200 + i * 320, 940], [-260 + i * 320, 1300]], .6, '#9A7350', 'inkfine', 0);
  // front door, open, bright morning outside
  boilSeed('hd-door'); paint(rectPts(150, 230, 300, 700), { wash: '#FFF4D2', ink: ST.ink, sw: 1.5 });
  glow(300, 560, 360, '#FFF0C0', .5);
  paint([[150, 230], [70, 260], [70, 960], [150, 930]], { wash: '#8E6A4E', ink: ST.ink, sw: 1.3 });
  boilSeed('hd-shoe'); paint(rectPts(480, 840, 220, 90), { wash: '#8E6A4E', ink: ST.ink, sw: 1 }); for (let k = 0; k < 3; k++) paint(ellPts(520 + k * 60, 835, 24, 10, 10), { wash: ['#C9503C', '#3F4A5C', '#E9C46A'][k], ink: ST.ink, sw: .6 });
  // picture frame and a wall clock (morning)
  boilSeed('hd-pic'); paint(rectPts(800, 260, 240, 170), { wash: '#C9DCE4', ink: ST.ink, sw: 1.2 }); paint(ellPts(920, 380, 90, 40, 14), { wash: '#9DBF8A', ink: null });
  boilSeed('hd-clk'); paint(ellPts(1250, 250, 46, 46, 22), { wash: ST.cream, ink: ST.ink, sw: 1.3 }); inkLine([[1250, 250], [1250, 215]], 1.2, ST.ink, 'ink', 0); inkLine([[1250, 250], [1275, 262]], 1.8, ST.ink, 'ink', 0);
  // sofa on the right
  boilSeed('hd-sofa'); paint(rrPts(1450, 640, 520, 200, 40), { wash: '#7FA39A', ink: ST.ink, sw: 1.3 }); paint(rrPts(1420, 760, 580, 190, 40), { wash: '#8DB3A9', ink: ST.ink, sw: 1.3 });
}

function roboxWorld(t) {
  boilSeed('rx-sky'); paint(rectPts(-400, -300, W + 800, H + 600), { wash: '#8FD3F5', ink: null });
  paint(ellPts(960, 120, 1400, 300, 24, 6), { fill: '#C6ECFF', fillOp: 150, bleed: .2, tex: .3, ink: null });
  for (let i = 0; i < 4; i++) { boilSeed('rx-cl' + i); const x = (i * 560 + t * 30) % (W + 600) - 300, y = 140 + 60 * hash(i); for (let k = 0; k < 3; k++) paint(rrPts(x + k * 70, y - (k === 1 ? 30 : 0), 110, 70, 28), { wash: '#FFFFFF', ink: '#5A7FA0', sw: 1 }); }
  // block hills and trees
  boilSeed('rx-hill'); paint([[-300, 760], [200, 560], [560, 700], [900, 520], [1300, 690], [1700, 540], [2200, 760], [2200, 900], [-300, 900]], { wash: '#6CC98A', ink: ST.ink, sw: 1.6 });
  for (let i = 0; i < 6; i++) { boilSeed('rx-tree' + i); const x = 80 + i * 340 + 60 * hash(i), y = 720 + 30 * hash(i + 3); paint(rectPts(x - 14, y - 60, 28, 70), { wash: '#9A6A44', ink: ST.ink, sw: 1.2 }); paint(rrPts(x - 60, y - 170, 120, 120, 16), { wash: ['#3FAF6A', '#52C27A', '#2E9A5C'][i % 3], ink: ST.ink, sw: 1.4 }); }
  // tiled plaza
  boilSeed('rx-plaza'); paint(rectPts(-400, 800, W + 800, 500), { wash: '#E9E2F2', ink: ST.ink, sw: 1.6 });
  for (let i = -4; i < 16; i++) inkLine([[i * 160, 800], [i * 160 - 120, 1300]], .9, '#B7ACD0', 'ink', 0);
  for (let j = 1; j < 4; j++) inkLine([[-400, 800 + j * 90], [W + 400, 800 + j * 90]], .9, '#B7ACD0', 'ink', 0);
}

// Flashback tint: applied by the compositor (a 2D multiply + vignette, cheap), not painted with brushes.
let SEPIA = 0;
function sepia(k = 1) { SEPIA = Math.max(SEPIA, clamp(k)); }
