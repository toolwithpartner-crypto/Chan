// ui.js: the screens the story is told through (all English), plus the recurring "Nerd on his bed" setup.
//   txt(s, x, y, size, col, o)           world-space lettering (follows the camera), Mali, left-aligned by default.
//   chatScreen(cx, cy, w, h, msgs, lt)   a big tablet screen with the Admin chat. msgs: [{t, from:'admin'|'nerd'|'typing', lines:[..], red}]
//   fakePage(cx, cy, w, h, lt, o)        the phishing page: misspelt address bar, spinning wings, a login form.
//   otpPopup(cx, cy, s, k)               the device's sign-in code popup with its warning line.
//   nerdOnBed(t, lt, P, o)               bedroom + Nerd sitting with the lit tablet + blanket; returns { head, tab }.
const txt = (s, x, y, size, col = ST.ink, o = {}) => letter(s, x, y, size, col, { font: `${o.w || 600} ${size}px Mali, Loma, sans-serif`, ink: false, align: o.align || 'left', ...o });

function badgeMark(x, y, r) { boilSeed('bdg' + Math.round(x) + Math.round(y)); paint(ellPts(x, y, r, r, 12), { wash: ST.badge, ink: ST.ink, sw: .8 }); inkLine([[x - r * .5, y], [x - r * .1, y + r * .45], [x + r * .6, y - r * .45]], r * .12, ST.cream, 'ink', 0); }

function chatScreen(cx, cy, w, h, msgs, lt, o = {}) {
  const x0 = cx - w / 2, y0 = cy - h / 2, fs = o.fs || 54;
  boilSeed('cs-frame');
  glow(cx, cy, w * .7, ST.screenGlow, .35);
  paint(rrPts(x0 - 40, y0 - 40, w + 80, h + 80, 50), { wash: ST.inkSoft, ink: ST.ink, sw: 1.6 });
  paint(rrPts(x0, y0, w, h, 24), { wash: '#EEF3F6', ink: null });
  // header
  paint(rrPts(x0, y0, w, 110, 24), { wash: '#DCE6EC', ink: null });
  avatar(x0 + 70, y0 + 100, 17, { skin: 'admin', id: 'cs-a', face: 'happy', t: 0 });
  txt('Admin_Official', x0 + 130, y0 + 56, 42, '#5A4A2E', { w: 700 });
  badgeMark(x0 + 470, y0 + 56, 17);
  if (o.gone) { paint(rrPts(x0, y0, w, 110, 24), { wash: '#DCE6EC', washOp: 200, ink: null }); }
  // the typing box (optional) at the bottom of the screen; messages stack up above it
  let y = y0 + h - 30 - (o.scroll || 0);
  if (o.input != null) {
    boilSeed('cs-inp'); paint(rrPts(x0 + 30, y0 + h - 100, w - 150, 74, 37), { wash: '#FFFFFF', ink: ST.inkSoft, sw: 1 });
    paint(ellPts(x0 + w - 70, y0 + h - 63, 34, 34, 14), { wash: o.sendLit ? ST.gold : '#4F86A8', ink: ST.ink, sw: 1 });
    if (o.input) txt(o.input, x0 + 60, y0 + h - 61, 40, ST.ink, { w: 600 });
    y -= 100;
  }
  const shown = msgs.filter(m => lt >= m.t).reverse();
  for (const m of shown) {
    const k = backOut(seg(lt, m.t, m.t + .25)), lines = m.from === 'typing' ? [''] : m.lines;
    if (m.from === 'typing' && m.until && lt > m.until) continue;
    const bw = m.from === 'typing' ? 130 : Math.min(w * .78, Math.max(...lines.map(l => l.length)) * fs * .5 + 60), bh = lines.length * fs * 1.3 + 30;
    y -= bh * Math.min(1, k + .001) + 22;
    if (y < y0 + 120) break;
    const right = m.from === 'nerd', bx = right ? x0 + w - 30 - bw : x0 + 30;
    boilSeed('cs-b' + m.t);
    paint(rrPts(bx, y, bw, bh * Math.min(1, k), 28), { wash: right ? '#BFE0FA' : '#FFFFFF', ink: m.red ? '#C23B45' : ST.inkSoft, sw: m.red ? 2.2 : 1 });
    if (m.red) glow(bx + bw / 2, y + bh / 2, bw * .6, '#FF6B6B', .25 * (.6 + .4 * Math.sin(lt * 6)));
    if (m.from === 'typing') { for (let i = 0; i < 3; i++) { boilSeed('cs-d' + i); paint(ellPts(bx + 35 + i * 30, y + bh / 2 - 8 * Math.max(0, Math.sin(lt * 8 - i)), 9, 9, 8), { wash: '#8C95A3', ink: null }); } }
    else if (k > .6) lines.forEach((l, i) => txt(l, bx + 30, y + 15 + fs * .65 + i * fs * 1.3, fs, m.red ? '#B22A35' : ST.ink, { w: m.red ? 700 : 600 }));
  }
}

function fakePage(cx, cy, w, h, lt, o = {}) {
  const x0 = cx - w / 2, y0 = cy - h / 2;
  boilSeed('fp-frame');
  glow(cx, cy, w * .7, ST.screenGlow, .35);
  paint(rrPts(x0 - 40, y0 - 40, w + 80, h + 80, 50), { wash: ST.inkSoft, ink: ST.ink, sw: 1.6 });
  paint(rrPts(x0, y0, w, h, 24), { wash: '#2E2A5A', ink: null });
  // address bar: the misspelling the viewer can catch (a zero for the o)
  paint(rrPts(x0 + 30, y0 + 25, w - 60, 70, 35), { wash: '#F3F0F8', ink: ST.inkSoft, sw: 1 });
  txt('https://www.rob0x-gifts.com/claim', x0 + 70, y0 + 62, 36, '#3A3A4A', { w: 600 });
  if (o.circle) { const k = clamp(o.circle); boilSeed('fp-circ'); paint(ellPts(x0 + 270, y0 + 60, 34 * k, 34 * k, 18, 2), { wash: null, ink: '#E2363F', sw: 2.4 }); glow(x0 + 270, y0 + 60, 70, '#FF5A5A', .4 * k); }
  // spinning wings and the claim card
  boilSeed('fp-w'); glow(cx, y0 + 270, 220, ST.teal, .5);
  const fl = lt * 5;
  dragonWing(cx - 20, y0 + 300, 60, -1, 1, fl, ST.teal, '#1E7C72', 1.2); dragonWing(cx + 20, y0 + 300, 60, 1, 1, fl + .3, ST.teal, '#1E7C72', 1.2);
  txt('FREE Limited Dragon Wings!', cx, y0 + 470, 46, ST.gold, { align: 'center', w: 700 });
  txt('Log in to claim your gift', cx, y0 + 525, 32, '#D8D2F0', { align: 'center' });
  boilSeed('fp-form');
  const fy = y0 + 570;
  paint(rrPts(cx - 330, fy, 660, 70, 14), { wash: '#FFFFFF', ink: ST.inkSoft, sw: 1 });
  paint(rrPts(cx - 330, fy + 90, 660, 70, 14), { wash: '#FFFFFF', ink: ST.inkSoft, sw: 1 });
  const email = 'mom.home@mail.com', ne = Math.floor(clamp(o.email ?? 0) * email.length), np = Math.floor(clamp(o.pass ?? 0) * 8);
  txt(ne ? email.slice(0, ne) : 'Email', cx - 300, fy + 37, 34, ne ? ST.ink : '#A9A3B8');
  txt(np ? '•'.repeat(np) : 'Password', cx - 300, fy + 127, 34, np ? ST.ink : '#A9A3B8', { w: 700 });
  paint(rrPts(cx - 160, fy + 185, 320, 62, 31), { wash: ST.pink, ink: ST.ink, sw: 1.1 });
  txt('CLAIM GIFT', cx, fy + 217, 32, ST.cream, { align: 'center', w: 700 });
}

function otpPopup(cx, cy, s, k) {
  if (k <= .01) return;
  boilSeed('otp');
  push(); translate(cx, cy); scale(k);
  paint(rrPts(-330 * s, -150 * s, 660 * s, 300 * s, 30 * s), { wash: '#FFFFFF', ink: ST.ink, sw: 1.5 });
  pop();
  if (k < .6) return;
  txt('Robox sign-in code', cx, cy - 92 * s, 30 * s, '#6B6B7A', { align: 'center' });
  txt('4 8 2 9 1 7', cx, cy - 15 * s, 76 * s, ST.ink, { align: 'center', w: 700 });
  txt("Don't share this code with anyone.", cx, cy + 80 * s, 28 * s, '#B22A35', { align: 'center' });
}

function nerdOnBed(t, lt, P, o = {}) {
  bedroom(t, { clock: o.clock ?? 20.75, lamp: o.lamp ?? .8 });
  const U = 110, nx = 760, ny = 800, tx = 905 + (o.tabDx || 0), ty = 700 + (o.tabDy || 0);
  const pr = person(nx, ny, U, { who: 'nerd', id: o.id || 'bed', sit: 1, seat: .12, screen: o.screen ?? 1, ...P,
    reach: o.reach || [[tx - .62 * U, ty + .12 * U], [tx + .6 * U, ty + .02 * U]], hands: o.hands || ['hold', 'hold'] });
  blanket();
  if (!o.noTab) tablet(tx, ty, U, o.tabAng ?? -.15, o.tabK ?? 1, { id: o.id || 'bed', back: o.tabBack });
  return { head: pr.head, tab: [tx, ty] };
}
