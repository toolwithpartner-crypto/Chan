// a03_trap.js: Act 3, sentences 18–24 (1:22–1:58). The link, Mom's login, the 6-digit code, the empty night.
(() => {
  const bg = () => { boilSeed('ecu-bg'); paint(rectPts(-200, -200, W + 400, H + 400), { wash: '#232848', ink: null }); };
  const PG = [960, 490, 1560, 820];

  // 18  82.0–87.0  the link, then the page: everything looks like the game except one letter
  function s18(t, lt) {
    camBegin(960, 540, 1.02 + .02 * lt); bg();
    if (lt < 1.6) chatScreen(PG[0], PG[1], PG[2], PG[3], [{ t: 0, from: 'admin', lines: ['Hurry or it goes to someone else.'] },
      { t: .2, from: 'admin', lines: ['Tap this link and log in with', 'the account on your tablet:'] }, { t: .7, from: 'admin', lines: ['rob0x-gifts.com/claim'] }], lt);
    else fakePage(PG[0], PG[1], PG[2], PG[3], lt, { circle: seg(lt, 3.2, 3.6) * (1 - seg(lt, 4.6, 5)) });
    camEnd();
    if (lt > 1.5 && lt < 1.75) flash(1 - Math.abs(lt - 1.6) / .15, '#FFFFFF');
  }
  // 19a 87.0–89.6  he types Mom's email and password, one key at a time
  function s19a(t, lt) {
    camBegin(960, 820, 1.55); bg();
    fakePage(PG[0], PG[1], PG[2], PG[3], lt, { email: seg(lt, .1, 1.3), pass: seg(lt, 1.5, 2.5) });
    boilSeed('fing'); const fx = 700 + 300 * Math.abs(Math.sin(lt * 9)), fy = 950 - 30 * Math.abs(Math.sin(lt * 18));
    paint(ribbon([[fx + 120, 1250], [fx + 20, 1060], [fx, fy]], 70, 46), { wash: ST.skin, ink: ST.ink, sw: 1.2 });
    camEnd();
  }
  // 19b 89.6–92.0  the voice covers its eyes; Nerd, serious, finishes
  function s19b(t, lt) {
    camBegin(780, 500, 1.9);
    const r = nerdOnBed(t, lt, { eyes: 'dot', look: [.4, .7], brow: 'worry', mouth: 'tight', tuft: .3 }, { reach: [[905 - .62 * 110, 713], [905 + .1 * 110, 660 + 10 * Math.abs(Math.sin(lt * 12))]], hands: ['hold', 'point'] });
    voice(r.head[0] - 190, r.head[1] - 10, 32, 'angel', { id: 'v19', eyes: 'shut', mouth: 'wobble', arms: [[2.6, 1.9], [2.6, 1.9]] });
    camEnd();
  }
  // 20  92.0–98.0  "send me the code" + the device popup; his thumb swipes past the warning
  function s20(t, lt) {
    camBegin(960, 540, 1.02 + .02 * lt); bg();
    chatScreen(PG[0], PG[1], PG[2], PG[3], [{ t: 0, from: 'admin', lines: ['rob0x-gifts.com/claim'] }, { t: 0, from: 'nerd', lines: ['ok logged in!'] },
      { t: .3, from: 'admin', lines: ['A 6-digit code will pop up.', 'Send it to me to confirm.'] }], lt);
    const k = backOut(seg(lt, 2.0, 2.35)) * (1 - ease(seg(lt, 5.0, 5.5)));
    if (k > .01) { flushLetters(); boilSeed('dim'); paint(rectPts(150, 130, 1620, 860), { wash: '#1B1F38', washOp: 120 * clamp(k), ink: null }); }
    otpPopup(960, 470, 1.15, k);
    // thumb swipes up past the warning line
    const sw = seg(lt, 3.6, 4.5);
    if (sw > 0 && sw < 1) { boilSeed('thumb'); const ty = lerp(800, 380, ease(sw)); paint(ribbon([[1260, 1200], [1180, ty + 160], [1150, ty]], 110, 80), { wash: ST.skin, ink: ST.ink, sw: 1.3 }); }
    camEnd();
  }
  // 21  98.0–102.0  the two voices argue; the admin's pings drown them both
  function s21(t, lt) {
    const z = 1.85 + .1 * lt;
    camBegin(780, 470, z);
    const r = nerdOnBed(t, lt, { eyes: lt < 2.6 ? 'dot' : 'half', look: [Math.sin(lt * 5) * .8, 0], brow: 'worry', mouth: 'wobble', sweat: .8, tuft: 0, shake: .15 });
    const pk = seg(lt, .4, .8);
    voice(r.head[0] - 200, r.head[1] - 20, 30 * backOut(pk), 'angel', { id: 'v21a', eyes: 'wide', brow: 'angry', mouth: 'open', mouthOpen: .7 + .3 * Math.sin(lt * 14), arms: [[2.6, .2], [1.0, .3]], hands: ['open', 'point'] });
    voice(r.head[0] + 210, r.head[1] - 30, 30 * backOut(seg(lt, .7, 1.1)), 'devil', { id: 'v21d', eyes: 'star', mouth: 'grin', arms: [[1.2, .3], [2.4, .2]], hands: [null, 'point'], flip: true });
    // pings: rings growing from the tablet, louder and louder
    for (let i = 0; i < 6; i++) { const tp = 1.2 + i * .4 * (1 - i * .05); const a = seg(lt, tp, tp + .6); if (a > 0 && a < 1) { boilSeed('pg' + i); paint(ellPts(905, 700, 120 + 260 * a, 70 + 150 * a, 24), { wash: null, ink: ST.gold, sw: 3 * (1 - a) }); } }
    camEnd();
    const fade = 1 - seg(lt, 2.4, 3.4), sz = 46 * (.6 + .4 * fade);
  }
  // 22  102.0–106.0  he types the six digits and sends; the bubble floats up
  function s22(t, lt) {
    camBegin(960, 540, 1.02); bg();
    const code = '482917', typed = code.slice(0, Math.floor(seg(lt, .2, 1.6) * 6.99));
    chatScreen(PG[0], PG[1], PG[2], PG[3], [{ t: 0, from: 'admin', lines: ['A 6-digit code will pop up.', 'Send it to me to confirm.'] }, { t: 2.0, from: 'nerd', lines: ['482917'] }], lt, { input: lt < 2.0 ? typed : '', sendLit: lt > 1.8 && lt < 2.1 });
    camEnd();
  }
  // 23  106.0–110.0  "done, within 24 hours"; he refreshes and refreshes and falls asleep smiling
  function s23(t, lt) {
    if (lt < 1.6) {
      camBegin(960, 540, 1.02); bg();
      chatScreen(PG[0], PG[1], PG[2], PG[3], [{ t: 0, from: 'nerd', lines: ['482917'] }, { t: .2, from: 'admin', lines: ['Done! Your epic item arrives', 'within 24 hours :)'] }], lt);
      camEnd();
    } else {
      const l = lt - 1.6, sl = ease(seg(l, 1.0, 2.2));
      camBegin(800, 560, 1.5, .12 * sl);
      nerdOnBed(t, lt, { eyes: l < .8 ? 'half' : 'shut', mouth: 'smile', tuft: .5, look: [.3, .5], tilt: .55 * sl, lean: .12 * sl }, { clock: 23.6, lamp: .4, tabK: 1 - .6 * sl, reach: [[905 - .62 * 110, 713], [905 + .2 * 110, 670 + 20 * Math.abs(Math.sin(l * 6)) * (1 - sl)]], hands: ['hold', 'point'] });
      camEnd();
      if (l < .2) flash(1 - l / .2, '#FBF3E4');
    }
  }
  // 24  110.0–118.0  somewhere dark: Mom's account opens on another screen and buys, and buys
  function s24(t, lt) {
    if (lt < 5.6) {
      camBegin(960, 540, 1.02 + .03 * lt);
      boilSeed('sc-bg'); paint(rectPts(-200, -200, W + 400, H + 400), { wash: ST.scamBg, ink: null });
      glow(960, 420, 700, ST.scamGlow, .35);
      boilSeed('sc-mon'); paint(rrPts(360, 120, 1200, 640, 20), { wash: '#0E1612', ink: '#3E5A48', sw: 1.4 }); paint(rrPts(390, 150, 1140, 580, 12), { wash: '#16261E', ink: null });
      txt("Signed in: Mom's account", 430, 200, 34, ST.scamGlow, { w: 700 });
      const items = [['Dragon Wings Bundle', '฿3,990'], ['Dragon Wings Bundle', '฿3,990'], ['Mega Gem Pack', '฿3,990'], ['Gem Pack', '฿1,990'], ['Gem Pack', '฿1,990']];
      items.forEach(([n, p], i) => { const k = seg(lt, .6 + i * .7, .8 + i * .7); if (k > 0) { boilSeed('it' + i); paint(rrPts(430, 250 + i * 80, 1060, 64, 10), { wash: '#1F3A2C', washOp: 255 * k, ink: null }); txt(n, 460, 284 + i * 80, 32, '#BFE8CC'); txt('PURCHASED  ' + p, 1460, 284 + i * 80, 32, ST.scamGlow, { align: 'right', w: 700 }); } });
      if (lt > 4.4) { const k = backOut(seg(lt, 4.4, 4.7)); txt('Total  ฿15,950', 960, 690, 52 * k, '#FF8A7A', { align: 'center', w: 700 }); }
      // hands on the keyboard, no face
      boilSeed('sc-kb'); paint(rrPts(420, 860, 1080, 160, 16), { wash: '#1A1F1C', ink: '#3E5A48', sw: 1.2 });
      for (const s of [-1, 1]) { boilSeed('sch' + s); const tap = Math.abs(Math.sin(lt * 16 + s)); paint(ellPts(960 + s * 230, 900 - 16 * tap, 90, 55, 16), { wash: '#3A4A40', ink: '#0A0F0C', sw: 1 }); }
      camEnd();
      if (lt < .3) flash(1 - lt / .3, '#000000');
    } else {
      const l = lt - 5.6;
      camBegin(760, 600, 1.6, .12);
      nerdOnBed(t, lt, { eyes: 'shut', mouth: 'smile', tuft: .4, screen: 0, tilt: .55, lean: .12 }, { clock: 0.2, lamp: .2, tabK: 0, reach: [[905 - .62 * 110, 713], [905 + .2 * 110, 690]], hands: ['hold', 'open'] });
      camEnd();
      flash(.25, '#0A0C1A');
      if (l < .25) flash(1 - l / .25, '#000000');
      if (l > 1.6) flash(ease(seg(l, 1.6, 2.4)), '#000000');
    }
  }
  shots([[82, s18], [87, s19a], [89.6, s19b], [92, s20], [98, s21], [102, s22], [106, s23], [110, s24]]);
})();
