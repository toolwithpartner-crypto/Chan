// a02_admin.js: Act 2, sentences 9–17 (0:38–1:22). The "admin" befriends Nerd, learns his secret, offers a secret gift.
(() => {
  const CH = [960, 490, 1560, 820];   // chat screen: centre x, y, w, h (world = screen in these ECU shots)
  const chat = (lt, msgs, o) => chatScreen(CH[0], CH[1], CH[2], CH[3], msgs, lt, o);
  const bg = () => { boilSeed('ecu-bg'); paint(rectPts(-200, -200, W + 400, H + 400), { wash: '#232848', ink: null }); };
  const fadeIn = (lt, c = '#FBF3E4', d = .3) => { if (lt < d) flash(1 - ease(lt / d), c); };

  // 9a  38.0–40.6  ECU chat: hello, compliments
  function s9a(t, lt) {
    const pull = ease(seg(lt, .9, 1.6));
    camBegin(lerp(520, 960, pull), lerp(140, 540, pull), lerp(2.6, 1.0, pull)); bg();
    chat(lt, [{ t: 1.4, from: 'admin', lines: ["Hi! I'm the admin of this server."] }, { t: 2.0, from: 'admin', lines: ['You play really well!'] }]);
    camEnd(); fadeIn(lt);
  }
  // 9b  40.6–42.0  CU Nerd: flattered, turns the screen away as if someone might see
  function s9b(t, lt) {
    camBegin(800, 520, 2.1);
    nerdOnBed(t, lt, pose(lt, [[0, { eyes: 'dot', look: [.4, .6], mouth: 'o' }], [.3, { eyes: 'happy', mouth: 'smile', blush: 1, tuft: .9, tilt: .1, _d: .25 }]]), { tabAng: -.15 - .25 * ease(seg(lt, .7, 1.1)), tabDx: -30 * ease(seg(lt, .7, 1.1)) });
    camEnd();
  }
  // 10  42.0–46.0  MCU Nerd + the doubting voice on his shoulder
  function s10(t, lt) {
    camBegin(780, 500, 1.85 + .04 * lt);
    const r = nerdOnBed(t, lt, pose(lt, [[0, { eyes: 'dot', look: [.5, .6], mouth: 'smile', tuft: .7 }], [1.0, { eyes: 'half', look: [-.5, -.3], brow: 'worry', mouth: 'tight', tilt: -.06, _d: .3 }]]), { reach: [[905 - .62 * 110, 700 + 13], [905 + .25 * 110, 640]], hands: ['hold', 'point'] });
    const k = backOut(seg(lt, .5, .9));
    if (k > .02) voice(r.head[0] - 190, r.head[1] - 30 - 40 * (1 - k), 34 * k, 'angel', { id: 'v10', eyes: 'half', brow: 'worry', mouth: 'tight', look: [.7, .3], arms: [[.6, .3], [1.8, .2]], hands: [null, 'point'] });
    camEnd();
  }
  // 11  46.0–52.0  in the game: the admin walks up, gives Nerd a free sparkle. The badge does the convincing.
  function s11(t, lt) {
    camBegin(960, 700, 1.5 + .05 * ease(seg(lt, 0, 6)));
    roboxWorld(t);
    const ax = lerp(1500, 1120, ease(seg(lt, .2, 1.6))), walk = lt < 1.6 ? lt * 3 : 0;
    const spark = ease(seg(lt, 2.2, 2.8));
    if (spark > 0) { glow(820, 820, 260 * spark, ST.gold, .5 * spark); for (let i = 0; i < 8; i++) { boilSeed('spk' + i); const a = i / 8 * TAU + lt * 2, r = 130 + 20 * Math.sin(lt * 6 + i); paint(starPts(820 + Math.cos(a) * r, 760 + Math.sin(a) * r * .8, 14 * spark, .4, 4), { wash: ST.gold, ink: ST.ink, sw: .6 }); } }
    avatar(820, 960, 66, { skin: 'classic', id: 'n11', face: lt > 2.5 ? 'happy' : 'dot', arms: lt > 2.6 ? [1.2 + .2 * Math.sin(lt * 10), 1.2 + .2 * Math.sin(lt * 10 + 1)] : [.15, .15], dy: lt > 2.6 ? .25 * Math.abs(Math.sin(lt * 7)) : 0 });
    avatar(ax, 960, 66, { skin: 'admin', id: 'a11', face: 'happy', badge: true, aura: .7, flip: true, walk, view: lt < 1.6 ? 'side' : 'front', arms: lt > 1.9 && lt < 2.8 ? [.1, 1.6] : [.1, .1] });
    camEnd();
    gameHUD(t);
    if (lt < .3) flash(1 - lt / .3, '#FBF3E4');
  }
  // 12  52.0–58.0  montage over several days: personal questions, playing together, he calls him "bro"
  function s12(t, lt) {
    const beat = lt < 2 ? 0 : lt < 4 ? 1 : 2, l = lt - beat * 2;
    if (beat === 1) {
      camBegin(960, 720, 1.4); roboxWorld(t + 3);
      glow(960, 760, 420, '#FFB6D5', .35);
      avatar(800, 960 - 140 * Math.abs(Math.sin(l * 4)), 60, { skin: 'classic', id: 'n12', face: 'happy', arms: [1.5, 1.5] });
      avatar(1120, 960 - 140 * Math.abs(Math.sin(l * 4 + 1)), 60, { skin: 'admin', id: 'a12', face: 'happy', badge: true, aura: .5, flip: true, arms: [1.5, 1.5] });
      for (let i = 0; i < 3; i++) { boilSeed('hrt' + i); const k = frac(l * .8 + i / 3); paint(heartPts(960 + (i - 1) * 90, 620 - 160 * k, 22 * (1 - k * .5)), { wash: ST.pink, washOp: 255 * (1 - k), ink: null }); }
      camEnd();
      gameHUD(t);
    } else {
      camBegin(960, 540, 1.02); bg();
      const msgs = beat === 0
        ? [{ t: .1, from: 'nerd', lines: ['gg bro! thx for the help'] }, { t: .7, from: 'admin', lines: ['Anytime :)  Where do you live?'] }]
        : [{ t: .1, from: 'admin', lines: ['Whose tablet is that?'] }, { t: .6, from: 'nerd', lines: ["My mom's. I use her account."] }, { t: 1.2, from: 'admin', lines: ["Who's home in the evenings?"] }];
      chat(l, msgs);
      camEnd();
      txt(['Day 2', '', 'Day 4'][beat], 80, 70, 44, '#F2E6C8', { w: 700, screen: true, alpha: .9 });
    }
    if (l < .18) flash(1 - l / .18, '#FBF3E4');
  }
  // 13  58.0–63.0  Nerd types his secret; the admin is "typing…" for a long time
  function s13(t, lt) {
    camBegin(960, 540, 1.02 + .02 * lt); bg();
    const full = 'I really want the dragon wings,', full2 = "but Mom won't buy them.", k = seg(lt, .2, 1.8);
    const typed = (full + ' ' + full2).slice(0, Math.floor(k * (full.length + full2.length + 1)));
    chat(lt, [{ t: 0, from: 'admin', lines: ["Who's home in the evenings?"] }, { t: 0, from: 'nerd', lines: ['Just me. Mom works late.'] },
      { t: 2.0, from: 'nerd', lines: [full, full2] }, { t: 2.5, from: 'typing' }], { input: lt < 2.0 ? typed + (Math.floor(lt * 3) % 2 ? '|' : '') : '', sendLit: lt > 1.8 && lt < 2.1 });
    camEnd();
  }
  // 14a 63.0–66.5  the offer; "don't tell anyone" stays lit
  function s14a(t, lt) {
    camBegin(960, 540, 1.02 + .03 * lt); bg();
    chat(lt, [{ t: 0, from: 'nerd', lines: ['I really want the dragon wings,', "but Mom won't buy them."] },
      { t: .2, from: 'admin', lines: ['I have a special gift for top players.'] }, { t: 1.1, from: 'admin', lines: ['Just for you :)'] },
      { t: 2.0, from: 'admin', lines: ["But don't tell anyone,", "or the others will get jealous."], red: true }]);
    camEnd();
  }
  // 14b 66.5–69.0  Nerd bounces on the bed, star eyes, tuft high
  function s14b(t, lt) {
    camBegin(820, 560, 1.45);
    const b = Math.abs(Math.sin(lt * 6.5)) * (lt < 1.9 ? 1 : 0);
    nerdOnBed(t, lt, { eyes: 'star', mouth: 'grin', tuft: 1, blush: .6, dy: .35 * b, sq: -.05 * b + .04 * (1 - b), look: [.3, .2] });
    camEnd();
    if (lt < .15) flash(1 - lt / .15, '#FFFFFF');
  }
  // 15  69.0–73.0  CU: the voice again; he glances at the closed door
  function s15(t, lt) {
    camBegin(760, 470, 2.4);
    const r = nerdOnBed(t, lt, pose(lt, [[0, { eyes: 'star', mouth: 'grin', tuft: 1 }], [.35, { eyes: 'dot', mouth: 'flat', tuft: .3, _d: .3 }], [1.6, { look: [-1, -.2], eyes: 'dot', brow: 'worry', mouth: 'tight', turn: -.4, _d: .35 }]]));
    const k = backOut(seg(lt, .3, .7));
    if (k > .02) voice(r.head[0] - 170, r.head[1] + 10, 30 * k, 'angel', { id: 'v15', eyes: 'dot', brow: 'worry', mouth: 'open', mouthOpen: .3, look: [.6, 0] });
    camEnd();
  }
  // 16a 73.0–76.0  the deadline pops in over his hesitation
  function s16a(t, lt) {
    camBegin(960, 540, 1.02 + .04 * lt); bg();
    chat(lt, [{ t: 0, from: 'admin', lines: ["But don't tell anyone,", "or the others will get jealous."], red: true },
      { t: .5, from: 'admin', lines: ['The gift expires TONIGHT!'] }, { t: 1.3, from: 'admin', lines: ['Hurry or it goes to someone else.'] }]);
    camEnd();
  }
  // 16b 76.0–78.0  CU the wall clock: 8:45 pm, ticking
  function s16b(t, lt) {
    camBegin(700, 200, 3.6 + .3 * lt);
    bedroom(t, { clock: 20.75 + lt * .02 });
    camEnd();
  }
  // 17  78.0–82.0  he talks himself into it; the voice crosses its arms but stays
  function s17(t, lt) {
    camBegin(780, 500, 1.85);
    const r = nerdOnBed(t, lt, pose(lt, [[0, { eyes: 'dot', look: [.3, .5], mouth: 'tight', brow: 'worry', tuft: .2 }], [.6, { eyes: 'happy', mouth: 'smile', brow: null, tuft: .8, _d: .3 }]]), {});
    const n = nod(lt, .7, 2, .12);
    voice(r.head[0] - 190, r.head[1] - 20, 32, 'angel', { id: 'v17', eyes: 'half', brow: 'sad', mouth: 'frown', arms: [[1.1, 2.2], [1.1, 2.2]], tilt: n * .3 });
    camEnd();
    if (lt > 3.65) flash(ease(seg(lt, 3.65, 4)), '#FBF3E4');
  }
  shots([[38, s9a], [40.6, s9b], [42, s10], [46, s11], [52, s12], [58, s13], [63, s14a], [66.5, s14b], [69, s15], [73, s16a], [76, s16b], [78, s17]]);
})();
