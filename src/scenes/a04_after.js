// a04_after.js: Act 4, sentences 25–30 (1:58–2:30). The bank call, the empty gift, the quiet talk, the hug.
(() => {
  function parking(t) {
    boilSeed('pk-sky'); paint(rectPts(-400, -300, W + 800, H + 600), { wash: '#F2C9A0', ink: null });
    paint(ellPts(400, 120, 900, 260, 24, 6), { fill: '#FFE3BC', fillOp: 140, ink: null });
    boilSeed('pk-store'); paint(rectPts(-200, 180, W + 400, 520), { wash: '#E4DCCB', ink: ST.ink, sw: 1.3 });
    for (let i = 0; i < 7; i++) { boilSeed('pk-win' + i); paint(rectPts(-100 + i * 320, 330, 260, 300), { wash: '#BFD6DC', ink: ST.ink, sw: 1 }); glow(30 + i * 320, 480, 150, '#FFF1C8', .25); }
    paint(rectPts(-200, 220, W + 400, 70), { wash: '#C9503C', ink: ST.ink, sw: 1.1 });
    boilSeed('pk-lot'); paint(rectPts(-400, 700, W + 800, 700), { wash: '#8C8F96', ink: ST.ink, sw: 1.2 });
    for (let i = 0; i < 7; i++) inkLine([[-100 + i * 340, 740], [-260 + i * 340, 1300]], 2.2, '#F2F0E8', 'ink', 0);
    boilSeed('pk-car'); paint(rrPts(1300, 640, 560, 210, 60), { wash: '#6FA8C9', ink: ST.ink, sw: 1.3 }); paint(rrPts(1380, 560, 360, 120, 50), { wash: '#9DC4DA', ink: ST.ink, sw: 1.1 });
    for (const x of [1390, 1760]) paint(ellPts(x, 850, 62, 62, 18), { wash: ST.inkSoft, ink: ST.ink, sw: 1 });
  }
  // 25  118.0–123.0  the parking lot: Mom on the phone, hand to her forehead, the cart unpaid; the total on her screen
  function s25(t, lt) {
    camBegin(980, 560, 1.55 + .05 * ease(seg(lt, 0, 5)));
    parking(t);
    const U = 100, mx = 940, my = 1080;
    const head = [mx - 4, my - (2.45 + 2.05) * U - .66 * U * .92], ear = [head[0] + .78 * U, head[1] + .05 * U];
    const r = person(mx, my, U, { who: 'mom', id: 'p25', turn: -.3, eyes: lt > 2.6 ? 'shut' : 'dot', look: [-.4, .3], brow: 'sad', mouth: 'tight', sweat: .5,
      reach: [[head[0] - .3 * U, head[1] - .35 * U], ear], hands: ['open', 'hold'] });
    phone(r.hand[0] - 4, r.hand[1] - 8, U, -.25, .8, { id: 'p25' });
    boilSeed('cart'); paint([[1080, 900], [1360, 900], [1330, 1030], [1110, 1030]], { wash: null, ink: ST.inkSoft, sw: 1.2, hatch: { d: 16, a: .8, b: 'HB', c: ST.inkSoft, w: .7 } });
    for (let k = 0; k < 4; k++) paint(rrPts(1110 + k * 55, 850 - 25 * hash(k), 50, 70, 8), { wash: ['#E38B6B', '#F2C96B', '#7FB7A6', '#9DB4E0'][k], ink: ST.ink, sw: .7 });
    camEnd();
    // the total, shown as an inset of her phone screen
    const k = backOut(seg(lt, 3.0, 3.35));
    if (k > .02) { boilSeed('tot'); push(); translate(1500, 300); scale(k); paint(rrPts(-250, -120, 500, 240, 26), { wash: '#FFFFFF', ink: ST.ink, sw: 1.4 }); pop();
      if (k > .6) { txt('5 Apple charges · last night', 1500, 245, 28, '#6B6B7A', { align: 'center', screen: true }); txt('-฿15,950', 1500, 320, 72, '#C23B45', { align: 'center', w: 700, screen: true }); } }
    if (lt < .4) flash(1 - lt / .4, '#000000');
  }
  // 26a 123.0–125.5  home, afternoon: the door opens behind Nerd; he is at the table checking the game
  function s26a(t, lt) {
    camBegin(960, 600, 1.1);
    homeDay(t);
    boilSeed('tbl'); paint(rectPts(1050, 760, 640, 40), { wash: '#A7835F', ink: ST.ink, sw: 1.2 }); paint(rectPts(1090, 800, 30, 140), { wash: '#8E6A4E', ink: null }); paint(rectPts(1620, 800, 30, 140), { wash: '#8E6A4E', ink: null });
    const U = 92, tx = 1330, ty = 730;
    person(1300, 940, U, { who: 'nerd', id: 'h26', sit: 1, seat: 1.6, eyes: 'dot', look: [.3, .8], mouth: 'flat', tuft: .4, screen: .7, reach: [[tx - .5 * U, ty + .05 * U], [tx + .5 * U, ty]], hands: ['hold', 'point'] });
    tablet(tx, ty, U * .9, -.05, .8, { id: 'h26' });
    // Mom comes in through the door, slow
    const mx = lerp(260, 520, ease(seg(lt, .4, 2.4)));
    person(mx, 940, U, { who: 'mom', id: 'm26', view: lt < 2.4 ? 'side' : 'front', walk: lt < 2.4 ? lt * 1.4 : 0, eyes: 'dot', brow: 'sad', mouth: 'flat', look: [.8, 0], turn: .5 });
    camEnd();
    if (lt < .3) flash(1 - lt / .3, '#FBF3E4');
  }
  // 26b 125.5–128.0  ECU the tablet: the gift box opens, empty; the admin's profile is gone
  function s26b(t, lt) {
    camBegin(960, 540, 1.02); boilSeed('ecu-bg'); paint(rectPts(-200, -200, W + 400, H + 400), { wash: '#232848', ink: null });
    boilSeed('gb-frame'); paint(rrPts(170, 90, 1580, 940, 50), { wash: ST.inkSoft, ink: ST.ink, sw: 1.6 }); paint(rrPts(210, 130, 1500, 860, 24), { wash: '#EEF3F6', ink: null });
    // gift box: the lid hops off, nothing inside, a puff of dust
    const op = backOut(seg(lt, .3, .7)), x = 700, y = 640;
    boilSeed('gb'); paint(rrPts(x - 160, y - 60, 320, 230, 14), { wash: ST.pink, ink: ST.ink, sw: 1.3 }); paint(rectPts(x - 20, y - 60, 40, 230), { wash: ST.gold, ink: null });
    paint(rrPts(x - 130, y - 40, 260, 40, 10), { wash: '#B8487A', ink: null });
    push(); translate(x + 60 * op, y - 90 - 120 * op); rotate(.6 * op); paint(rrPts(-180, -30, 360, 70, 14), { wash: ST.pink, ink: ST.ink, sw: 1.3 }); pop();
    if (lt > .7) { const d = seg(lt, .7, 1.6); boilSeed('dust'); for (let i = 0; i < 5; i++) paint(ellPts(x - 60 + i * 30, y - 90 - 80 * d, 20 * (1 - d), 14 * (1 - d), 10), { wash: '#C9C2B4', washOp: 200 * (1 - d), ink: null }); }
    txt('Your gift box is empty', x, y + 230, 40, '#6B6B7A', { align: 'center' });
    // the admin's profile card, greyed out
    const pk = backOut(seg(lt, 1.2, 1.5));
    if (pk > .02) { boilSeed('gone'); paint(rrPts(1050, 420, 560, 300, 26), { wash: '#E2E2E6', washOp: 255 * clamp(pk), ink: ST.inkSoft, sw: 1.2 });
      if (pk > .6) { paint(ellPts(1140, 520, 50, 50, 16), { wash: '#C9C9CF', ink: ST.inkSoft, sw: 1 }); txt('Admin_Official', 1210, 515, 38, '#9A9AA4', { w: 700 }); txt('User not found', 1330, 640, 44, '#C23B45', { align: 'center', w: 700 }); } }
    camEnd();
  }
  // 27  128.0–132.0  Mom sits down at his level, quiet; her hands still shake
  function s27(t, lt) {
    camBegin(1100, 560, 1.9);
    homeDay(t);
    boilSeed('tbl'); paint(rectPts(1050, 760, 640, 40), { wash: '#A7835F', ink: ST.ink, sw: 1.2 });
    const U = 92;
    person(1300, 940, U, { who: 'nerd', id: 'h27', sit: 1, seat: 1.6, view: 'front', turn: -.5, eyes: 'sad', look: [-.6, .5], mouth: 'flat', brow: 'sad', tuft: -.6, arms: [[.6, 1.2], [.6, 1.2]], hands: ['open', 'open'] });
    boilSeed('chair2'); paint(rrPts(880, 940 - 1.5 * U, 150, 1.5 * U, 10), { wash: '#A7835F', ink: ST.ink, sw: 1 });
    person(950, 940, U, { who: 'mom', id: 'm27', sit: 1, seat: 1.5, turn: .55, eyes: 'dot', look: [.8, .2], brow: 'sad', mouth: 'smile', tilt: -.08, shake: .06,
      arms: [[.7, 1.4], [.9, 1.2]], hands: ['open', 'open'] });
    camEnd();
  }
  // 28  132.0–137.0  CU Nerd: tears, he holds the tablet out with the whole chat
  function s28(t, lt) {
    camBegin(1310, 600, 2.4 + .1 * ease(seg(lt, 0, 5)));
    homeDay(t);
    const U = 92, out = ease(seg(lt, 2.2, 3.0)), tx = lerp(1330, 1180, out), ty = lerp(760, 700, out);
    boilSeed('tbl'); paint(rectPts(1050, 760, 640, 40), { wash: '#A7835F', ink: ST.ink, sw: 1.2 });
    person(1300, 940, U, { who: 'nerd', id: 'h28', sit: 1, seat: 1.6, turn: -.35, eyes: 'teary', tears: .4 + .6 * seg(lt, 0, 2), brow: 'sad', mouth: 'wobble', tuft: -1, look: [-.5, .2],
      reach: [[tx - .45 * U, ty + .05 * U], [tx + .45 * U, ty]], hands: ['hold', 'hold'], shake: .1 });
    tablet(tx, ty, U * .9, .1 * out, .8, { id: 'h28' });
    camEnd();
  }
  // 29  137.0–144.0  over Mom's shoulder: she scrolls back up the chat, stops on "don't tell anyone", then the six digits
  function s29(t, lt) {
    camBegin(960, 540, 1.02); boilSeed('ecu-bg'); paint(rectPts(-200, -200, W + 400, H + 400), { wash: '#3A3546', ink: null });
    const all = [{ t: 0, from: 'admin', lines: ["Hi! I'm the admin of this server."] }, { t: 0, from: 'admin', lines: ['Whose tablet is that?'] }, { t: 0, from: 'nerd', lines: ["My mom's. I use her account."] },
      { t: 0, from: 'admin', lines: ["But don't tell anyone,", "or the others will get jealous."], red: lt > 1.4 && lt < 4.2 }, { t: 0, from: 'admin', lines: ['The gift expires TONIGHT!'] },
      { t: 0, from: 'admin', lines: ['A 6-digit code will pop up.', 'Send it to me to confirm.'] }, { t: 0, from: 'nerd', lines: ['482917'], red: lt > 5 }];
    // scroll: start at the bottom, glide up to the secret line, hold, glide down to the code
    const sc = kf(lt, [[0, -340], [1.3, 0], [4.0, 0], [5.0, -340]]);
    chatScreen(1000, 560, 1400, 860, all, 10, { scroll: sc, gone: true, hands: false });
    // Mom's shoulder and hair in the foreground (left edge), her finger on the glass
    boilSeed('osh'); paint(ellPts(120, 1000, 380, 300, 20), { wash: ST.cardi, ink: ST.ink, sw: 1.4 }); paint(ellPts(150, 640, 230, 260, 20), { wash: ST.hairMom, ink: ST.ink, sw: 1.4 });
    const fy = kf(lt, [[0, 900], [1.3, 640], [4.0, 640], [5.0, 900]]);
    paint(ribbon([[620, 1250], [700, fy + 140], [720, fy]], 70, 48), { wash: ST.skinMom, ink: ST.ink, sw: 1.2 });
    camEnd();
    if (lt < .3) flash(1 - lt / .3, '#FBF3E4');
  }
  // 30  144.0–150.0  the hug. Over his shoulder her face doesn't look angry: it freezes, because the password was hers.
  function s30(t, lt, dur) {
    camBegin(990, 560, 1.9 + .2 * ease(seg(lt, 0, dur)));
    homeDay(t);
    const U = 92, pull = ease(seg(lt, 0, .8));
    person(1090, 940, U, { who: 'mom', id: 'm30', sit: 1, seat: 1.4, turn: -.3, eyes: lt < 2.2 ? 'shut' : 'sad', look: [.3, .2], brow: 'sad', mouth: lt < 2.2 ? 'flat' : 'frown', tilt: .1, lean: .04,
      reach: [[930, 760], [1060, 740]], hands: ['open', 'open'] });
    person(lerp(1060, 905, pull), 960, U, { who: 'nerd', id: 'n30', view: 'back', tuft: -1, shake: .12 * (1 - seg(lt, 3, 5)) });
    // her hands on his back, drawn over him
    boilSeed('hb'); for (const [x, y] of [[930, 760], [1060, 745]]) paint(ellPts(x, y, 26, 22, 12), { wash: ST.skinMom, ink: ST.ink, sw: 1 });
    // the inner voice sits on his shoulder, silent
    voice(780, 640, 26, 'angel', { id: 'v30', eyes: 'sad', brow: 'sad', mouth: 'flat', arms: [[.4, .8], [.4, .8]] });
    camEnd();
    // freeze and drain the colour
    const k = ease(seg(lt, 3.6, 5.6));
    if (k > 0) { flushLetters(); paint(rectPts(-60, -60, W + 120, H + 120), { wash: '#E9E2D2', washOp: 170 * k, ink: null }); }
    if (lt > dur - .4) flash(ease(seg(lt, dur - .4, dur)), '#F3EBDD');
  }
  shots([[118, s25], [123, s26a], [125.5, s26b], [128, s27], [132, s28], [137, s29], [144, s30]]);
})();
