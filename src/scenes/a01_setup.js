// a01_setup.js: Act 1, sentences 4–8 (0:12–0:38).
//  4  12.0–16.0  Robox plaza: two friends fly circles on dragon wings and laugh at Nerd's classic skin. His avatar wilts.
//  5  16.0–20.0  Nerd on his bed hugs the tablet; the wings' price floats up (3,990); he shakes his head, Mom won't buy it.
//  6  20.0–27.0  Flashback (sepia): Mom rushing out the door tells him her password; CU the tablet: her account, her card.
//  7  27.0–32.0  Flashback: Mom points, "only free games, buy nothing"; Nerd nods hard, means it.
//  8  32.0–38.0  Night again: a friend request from "Admin_Official ✓" pops up; Nerd's tuft springs up; push into it.
(() => {
  const T0 = 12;
  SUBCOL.friend = '#FFE07A';

  // ---------- 4: the plaza ----------
  function shotPlaza(t, lt, dur) {
    camBegin(960, 690 - 20 * ease(seg(lt, 0, dur)), 1.45 + .08 * ease(seg(lt, 0, dur)));
    roboxWorld(t);
    // friends circle overhead, one each way, wings beating
    const fr = [['friendA', 0, 1], ['friendB', Math.PI, -1]];
    const pts = fr.map(([skin, ph, d], i) => {
      const a = ph + d * lt * 1.6, x = 960 + 400 * Math.cos(a), y = 760 + 50 * Math.sin(2 * a), front = Math.sin(a) > 0;
      return { skin, x, y, a, front, i, d };
    });
    const drawFriend = p => avatar(p.x, p.y, 58, { skin: p.skin, id: 'pf' + p.i, wings: 1, flap: t * 9 + p.i, face: lt > 1.6 ? 'smug' : 'happy', flip: (p.d * -Math.sin(p.a)) < 0,
      arms: lt > 2 && p.i === 0 ? [.2, 1.5 + .2 * Math.sin(lt * 12)] : [.3, .3 + .25 * Math.sin(lt * 8 + p.i)], dy: .15 * Math.sin(lt * 6 + p.i) });
    for (const p of pts) if (!p.front) drawFriend(p);
    // Nerd's avatar: plain, looks up, then wilts when they laugh
    const wilt = ease(seg(lt, 2.4, 2.9)), look = Math.sin(lt * 1.6) * .3;
    avatar(960, 960, 78, { skin: 'classic', id: 'pn', face: lt > 2.4 ? 'sad' : 'dot', arms: [.1 + .1 * (1 - wilt), .1 + .1 * (1 - wilt)], sq: .06 * wilt + .03 * ring(lt, [2.4], 7, 18), flip: look < 0 });
    for (const p of pts) if (p.front) drawFriend(p);
    // laughter marks by the friends after the line
    if (lt > 2.2) for (const p of pts) { boilSeed('ha' + p.i); for (let k = 0; k < 3; k++) { const a = -1.2 + k * .5, r = 120 + 12 * Math.sin(lt * 10 + k); inkLine([[p.x + Math.cos(a) * r * .8, p.y - 200 + Math.sin(a) * r * .5], [p.x + Math.cos(a) * r, p.y - 200 + Math.sin(a) * r * .6]], 1.6, ST.ink, 'ink', 0); } }
    camEnd();
    gameHUD(t);
    if (lt < .35) brushWipe(.5 + lt / .7, ['#3A3F7A', '#5A4A7A']);
    if (lt > dur - .3) flash(ease(seg(lt, dur - .3, dur)) * .9, '#1E2240');
  }

  // ---------- 5: on the bed ----------
  function shotBed(t, lt, dur) {
    camBegin(800, 560, 1.75 + .06 * ease(seg(lt, 0, dur)));
    bedroom(t, { clock: 20.5 });
    const U = 110, nx = 760, ny = 800;
    const shake = nod(lt, 2.4, 3, .16, .22);
    const P = pose(lt, [
      [0, { eyes: 'sad', brow: 'sad', mouth: 'flat', look: [.5, .6], tuft: -.3, tilt: 0 }],
      [.4, { eyes: 'half', look: [.6, -.5], mouth: 'wobble', _d: .3 }],
      [2.3, { eyes: 'shut', brow: 'sad', mouth: 'frown', tuft: -.8, _d: .25 }],
      [3.3, { eyes: 'sad', look: [0, .7], mouth: 'flat', _d: .3 }],
    ]);
    const chest = [nx + 10, ny - 1.0 * U];
    person(nx, ny, U, { who: 'nerd', id: 'b5', sit: 1, seat: .12, ...P, tilt: (P.tilt || 0) + shake, screen: .3, reach: [[chest[0] - .4 * U, chest[1] + .1 * U], [chest[0] + .42 * U, chest[1] + .05 * U]], hands: ['hold', 'hold'], sq: .03 * Math.sin(lt * 2.5) });
    blanket();
    tablet(chest[0], chest[1] + .05 * U, U * .95, -.08, 0, { id: 'b5', back: true });
    // the wings and their price float up from the tablet, then fade when he shakes his head
    const k = easeOut(seg(lt, .4, 1.1)) * (1 - ease(seg(lt, 2.6, 3.3))), fy = chest[1] - 260 - 30 * ease(seg(lt, .4, 2.6));
    if (k > .02) {
      boilSeed('b5w'); glow(nx + 260, fy, 200 * k, ST.teal, .4 * k);
      push(); translate(nx + 260, fy); scale(k);
      dragonWing(-10, 30, 40, -1, 1, t * 6, ST.teal, '#1E7C72', 1); dragonWing(10, 30, 40, 1, 1, t * 6 + .3, ST.teal, '#1E7C72', 1);
      paint(rrPts(-80, 70, 160, 56, 20), { wash: ST.cream, ink: ST.ink, sw: 1 });
      pop();
      thai('3,990', nx + 260, fy + 98 * k, 38 * k, '#8E2420', { align: 'center', w: 700, alpha: k });
    }
    camEnd();
    if (lt > dur - .4) flash(ease(seg(lt, dur - .4, dur)), '#F3E3C4');
  }

  // ---------- 6a: flashback, Mom at the door ----------
  function shotDoor(t, lt, dur) {
    camBegin(960, 560, 1.05 + .04 * ease(seg(lt, 0, dur)));
    homeDay(t);
    const U = 92;
    // Mom strides to the door, stops, turns back to him and talks over her shoulder
    const walkK = ease(seg(lt, 0, 1.3)), mx = lerp(1180, 560, walkK), stop = lt > 1.3;
    const mP = pose(lt, [
      [0, { eyes: 'dot', look: [-.6, 0], mouth: 'flat', brow: 'flat' }],
      [1.3, { look: [.8, 0], brow: 'up', mouth: 'smile', turn: .55, _d: .2 }],
      [3.2, { brow: 'flat', look: [.8, .1], _d: .2 }],
    ]);
    const talk = (lt > 1.45 && lt < 3.0) || (lt > 3.2 && lt < 4.4), flap = talk ? .2 + .5 * Math.abs(Math.sin(lt * 14)) : 0;
    const gest = stop ? (lt < 3.2 ? [[.2, .2], [1.35 + .12 * Math.sin(lt * 6), .35]] : [[.2, .2], [.9 + .3 * Math.sin(lt * 8), 1.3]]) : null;
    person(mx, 940, U, { who: 'mom', id: 'd6m', ...(stop ? { view: 'front' } : { view: 'side', flip: true, walk: (1180 - mx) / U }), ...mP,
      mouth: talk ? 'open' : mP.mouth, mouthOpen: flap, arms: gest || undefined, hands: stop ? ['hold', lt < 3.2 ? 'point' : 'open'] : ['hold', 'hold'] });
    boilSeed('d6bag'); if (stop) paint(rrPts(mx - 95, 940 - 3.0 * U, 70, 90, 12), { wash: '#5A3E36', ink: ST.ink, sw: 1 });
    // Nerd by the sofa with the tablet, turning to listen
    const nP = pose(lt, [[0, { eyes: 'dot', look: [.3, .8], mouth: 'flat', turn: 0 }], [1.35, { look: [-.9, 0], turn: -.5, eyes: 'wide', _d: .2 }], [1.8, { eyes: 'dot', mouth: 'smile' }]]);
    const tx = 1370, ty = 940 - 1.9 * U;
    person(1340, 940, U, { who: 'nerd', id: 'd6n', ...nP, tuft: .6, reach: [[tx - .5 * U, ty + .1 * U], [tx + .5 * U, ty + .05 * U]], hands: ['hold', 'hold'], tilt: nod(lt, 3.0, 2, .1) });
    tablet(tx, ty, U * .9, -.05, .8, { id: 'd6' });
    camEnd();
    sepia(1);
    if (lt < .35) flash(1 - ease(lt / .35), '#F3E3C4');
    if (lt > dur - .25) flash(ease(seg(lt, dur - .25, dur)) * .8, '#F3E3C4');
  }

  // ---------- 6b: flashback, CU the tablet: logged in as Mom, card saved ----------
  function shotAccount(t, lt, dur) {
    camBegin(960, 540, 1 + .08 * ease(seg(lt, 0, dur)));
    boilSeed('acc-bg'); paint(rectPts(-200, -200, W + 400, H + 400), { wash: '#EFE3CC', ink: null });
    // Nerd's hands hold the tablet from below
    tablet(960, 560, 820, 0, 1, { id: 'acc' });
    for (const s of [-1, 1]) { boilSeed('acch' + s); paint(ellPts(960 + s * 560, 800, 70, 60, 16), { wash: ST.skin, ink: ST.ink, sw: 1.2 }); }
    // the account card on screen
    const k1 = backOut(seg(lt, .2, .55)), k2 = backOut(seg(lt, .9, 1.25)), k3 = backOut(seg(lt, 1.6, 1.95));
    boilSeed('acc-row');
    paint(rrPts(640, 300, 640, 150, 26), { wash: ST.cream, washOp: 255 * clamp(k1), ink: ST.ink, sw: 1.2 });
    if (k1 > .05) { person(720, 375, 46, { who: 'mom', id: 'accm', headOnly: true, eyes: 'dot', mouth: 'smile' }); thai("Mom's account", 790, 372, 46, ST.ink, { w: 700, pop: k1 }); }
    paint(rrPts(640, 480, 640, 150, 26), { wash: ST.cream, washOp: 255 * clamp(k2), ink: ST.ink, sw: 1.2 });
    if (k2 > .05) { boilSeed('acc-c'); paint(rrPts(670, 515, 120, 80, 10), { wash: '#3E6FB0', ink: ST.ink, sw: 1 }); paint(rrPts(688, 537, 26, 20, 4), { wash: ST.gold, ink: null }); thai('Credit card •••• 4821', 815, 555, 40, ST.ink, { pop: k2 }); }
    if (k3 > .05) { boilSeed('acc-ok'); paint(ellPts(1325, 555, 30 * k3, 30 * k3, 14), { wash: ST.badge, ink: ST.ink, sw: 1 }); inkLine([[1311, 555], [1322, 567], [1341, 543]], 2.2, ST.cream, 'ink', 0); thai('Saved: one-tap purchases ON', 960, 690, 34, '#3E6FB0', { align: 'center', pop: k3 }); }
    camEnd();
    sepia(1);
    if (lt < .25) flash(.8 * (1 - lt / .25), '#F3E3C4');
    if (lt > dur - .3) brushWipe((lt - (dur - .3)) / .6, ['#8E6A4E', '#B48A58']);
  }

  // ---------- 7a: flashback, Mom points: free games only ----------
  function shotRule(t, lt, dur) {
    camBegin(700, 520, 2.0 + .1 * ease(seg(lt, 0, dur)));
    homeDay(t);
    const U = 92, mx = 600;
    const talk = lt > .25 && lt < 2.6, flap = talk ? .2 + .5 * Math.abs(Math.sin(lt * 13)) : 0;
    const wag = Math.sin(lt * 9) * .12 * (lt > .3 && lt < 2.6 ? 1 : 0);
    person(mx, 940, U, { who: 'mom', id: 'r7', turn: .45, eyes: 'dot', look: [.7, .2], brow: lt > 1.4 ? 'angry' : 'up', mouth: talk ? 'open' : 'flat', mouthOpen: flap,
      arms: [[.2, .2], [1.5 + wag, .15]], hands: ['hold', 'point'], lean: -.03 });
    camEnd();
    sepia(1);
    if (lt < .3) brushWipe(.5 + lt / .6, ['#8E6A4E', '#B48A58']);
  }
  // ---------- 7b: flashback, Nerd nods hard ----------
  function shotNod(t, lt, dur) {
    camBegin(1340, 600, 2.0 + .08 * ease(seg(lt, 0, dur)));
    homeDay(t);
    const U = 92, tx = 1370, ty = 940 - 1.9 * U;
    const n = nod(lt, .35, 4, .2, .2);
    person(1340, 940, U, { who: 'nerd', id: 'n7', turn: -.4, look: [-.8, 0], eyes: lt < .3 ? 'dot' : 'happy', brow: 'up', mouth: lt > .3 ? 'grin' : 'flat', tuft: lt > .35 ? 1 : .6,
      tilt: n, dy: .05 * Math.abs(Math.sin(lt * 15)) * (lt > .35 && lt < 1.3 ? 1 : 0), reach: [[tx - .5 * U, ty + .1 * U], [tx + .5 * U, ty + .05 * U]], hands: ['hold', 'hold'] });
    tablet(tx, ty, U * .9, -.05, .8, { id: 'n7' });
    camEnd();
    sepia(1 - ease(seg(lt, dur - .6, dur)));
    if (lt > dur - .5) flash(ease(seg(lt, dur - .5, dur)), '#1E2240');
  }

  // ---------- 8: the friend request ----------
  function shotRequest(t, lt, dur) {
    const into = ease(seg(lt, 3.5, 5.9));
    const bx = 1180, by = 360;   // the notification card, world coords
    camBegin(lerp(860, bx + 40, into), lerp(540, by + 10, into), lerp(1.35, 3.0, easeIn(seg(lt, 3.5, 5.9))));
    bedroom(t, { clock: 21.1, lamp: .7 });
    const U = 110, nx = 760, ny = 800, tx = 905, ty = 700;
    const P = pose(lt, [
      [0, { eyes: 'half', look: [.3, .6], mouth: 'flat', brow: null, tuft: -.4 }],
      [.95, { eyes: 'wide', look: [.6, -.3], mouth: 'o', brow: 'up', tuft: 1, _snap: true, _d: .15 }],
      [1.9, { eyes: 'dot', look: [.7, -.4], mouth: 'smile', brow: 'up', _d: .3 }],
      [2.6, { eyes: 'star', mouth: 'open', mouthOpen: .4, _d: .2 }],
    ]);
    const tk = take(lt, .95, 1.2);
    person(nx, ny, U, { who: 'nerd', id: 's8', sit: 1, seat: .12, ...P, screen: 1, sq: (tk.sq || 0), dy: (tk.dy || 0) * .3, lean: .06 * ease(seg(lt, 1.9, 2.8)),
      reach: [[tx - .62 * U, ty + .12 * U], [tx + .6 * U, ty + .02 * U]], hands: ['hold', 'hold'] });
    blanket();
    tablet(tx, ty, U, -.15, 1, { id: 's8' });
    // the request pops out of the screen
    const pk = backOut(seg(lt, .8, 1.15));
    if (pk > .02) {
      boilSeed('req'); glow(bx + 40, by, 300 * pk, ST.adminTrim, .45 * pk);
      push(); translate(bx, by); scale(pk);
      paint([[-140, 70], [-60, 70], [tx - bx - 10, ty - by - 120]], { wash: ST.cream, ink: ST.ink, sw: 1.2 });
      paint(rrPts(-250, -90, 560, 190, 30), { wash: ST.cream, ink: ST.ink, sw: 1.5 });
      pop();
      if (pk > .4) {
        avatar(bx - 180, by + 55, 26, { skin: 'admin', id: 'rqa', face: 'happy', t });
        boilSeed('req-b'); paint(ellPts(bx + 230, by - 32, 16, 16, 12), { wash: ST.badge, ink: ST.ink, sw: .8 }); inkLine([[bx + 222, by - 32], [bx + 228, by - 25], [bx + 239, by - 40]], 1.5, ST.cream, 'ink', 0);
        thai('Admin_Official', bx - 110, by - 30, 40, '#6B5A3A', { w: 700, alpha: clamp(pk) });
        thai('sent you a friend request', bx - 110, by + 35, 36, ST.ink, { alpha: clamp(pk) });
      }
      // ping marks
      const pa = seg(lt, .8, 1.5); if (pa > 0 && pa < 1) { boilSeed('ping'); for (let k = 0; k < 6; k++) { const a = k / 6 * TAU, r0 = 300 + 80 * pa; inkLine([[bx + 30 + Math.cos(a) * r0, by + Math.sin(a) * r0 * .5], [bx + 30 + Math.cos(a) * (r0 + 40), by + Math.sin(a) * (r0 + 40) * .5]], 2 * (1 - pa), ST.gold, 'ink', 0); } }
    }
    camEnd();
    if (lt < .4) flash(1 - ease(lt / .4), '#1E2240');
    if (lt > dur - .45) flash(ease(seg(lt, dur - .45, dur)), ST.cream);
  }


  // ---------- inserted flashback 'ask' (pacing.js): why Mom gave him her password ----------
  //  0.0–2.6  ECU the tablet: the store page for Robox; he taps GET; it asks for the password of Mom's account
  //  2.6–8.0  Mom getting ready to leave; Nerd runs in with the tablet and begs; she checks her watch, she's late
  function shotAsk(t, lt, dur) {
    if (lt < 2.6) {
      camBegin(960, 540, 1.02 + .04 * lt);
      boilSeed('ask-bg'); paint(rectPts(-200, -200, W + 400, H + 400), { wash: '#EFE3CC', ink: null });
      tablet(960, 540, 900, 0, 1, { id: 'ask' });
      boilSeed('ask-scr'); paint(rrPts(420, 200, 1080, 640, 18), { wash: '#F6F8FA', ink: null });
      // the store listing
      paint(rrPts(480, 250, 180, 180, 36), { wash: '#8FD3F5', ink: ST.ink, sw: 1.2 });
      avatar(570, 410, 34, { skin: 'classic', id: 'ask-ic', face: 'happy', t: 0 });
      txt('Robox', 700, 300, 64, ST.ink, { w: 700 });
      txt('Free · Games · 4.8 ★', 700, 365, 34, '#6B6B7A');
      const tapK = seg(lt, .8, 1.0), btnLit = lt > .9 && lt < 1.2;
      paint(rrPts(700, 400, 200, 70, 35), { wash: btnLit ? '#2F5FA8' : '#3E6FB0', ink: null });
      txt('GET', 800, 437, 36, ST.cream, { align: 'center', w: 700 });
      // finger taps GET
      if (lt < 1.4) { boilSeed('ask-f'); const fy = lerp(760, 470, ease(tapK)) + 20 * Math.max(0, Math.sin((lt - 1) * 12)) * (lt > 1 ? 1 : 0); paint(ribbon([[880, 1150], [830, fy + 150], [810, fy]], 90, 64), { wash: ST.skin, ink: ST.ink, sw: 1.2 }); }
      // the password sheet slides up
      const k = backOut(seg(lt, 1.3, 1.65));
      if (k > .02) {
        boilSeed('ask-pw'); paint(rectPts(420, 200, 1080, 640), { wash: '#1B1F38', washOp: 110 * clamp(k), ink: null });
        const py = lerp(900, 380, clamp(k));
        paint(rrPts(560, py, 800, 400, 28), { wash: '#FFFFFF', ink: ST.ink, sw: 1.4 });
        if (k > .7) {
          txt('Sign in to download', 960, py + 70, 44, ST.ink, { align: 'center', w: 700 });
          txt('Password for mom.home@mail.com', 960, py + 135, 32, '#6B6B7A', { align: 'center' });
          paint(rrPts(640, py + 180, 640, 70, 14), { wash: '#F2F4F7', ink: ST.inkSoft, sw: 1 });
          if (Math.floor(lt * 3) % 2) inkLine([[670, py + 195], [670, py + 235]], 1.6, ST.ink, 'ink', 0);
          boilSeed('ask-lock'); paint(rrPts(940, py + 290, 40, 34, 6), { wash: ST.gold, ink: ST.ink, sw: .8 }); inkLine([[948, py + 292], [948, py + 278], [972, py + 278], [972, py + 292]], 1.4, ST.ink, 'ink', .6);
        }
      }
      camEnd();
      sepia(1);
      if (lt < .35) flash(1 - ease(lt / .35), '#F3E3C4');
    } else {
      const l = lt - 2.6, U = 92;
      camBegin(1180, 600, 1.35 + .05 * ease(seg(l, 0, 5.4)));
      homeDay(t);
      // Mom by the sofa, slipping her bag on her shoulder, then checking her watch
      const watch = seg(l, 2.4, 2.8) * (1 - seg(l, 3.8, 4.1));
      const mP = pose(l, [[0, { eyes: 'dot', look: [-.3, .7], brow: 'flat', mouth: 'flat', turn: .3, lean: .08 }],
        [.6, { look: [.8, 0], brow: 'up', mouth: 'o', lean: 0, _d: .2 }], [2.4, { look: [-.2, .8], brow: 'worry', mouth: 'tight', _d: .2 }], [3.9, { look: [.8, .1], brow: 'sad', mouth: 'flat', _d: .25 }]]);
      // the bag swings up from her hand onto her shoulder: she is on her way out
      const lift = easeOut(seg(l, .1, 1.0)), bagX = lerp(1120, 1100, lift), bagY = lerp(940 - 2.0 * U, 940 - 3.15 * U, lift) - 18 * Math.sin(lift * Math.PI);
      const rArm = lift < .98 ? { reach: [null, [bagX + 10, bagY - 30]] } : {};
      person(1040, 940, U, { who: 'mom', id: 'ask-m', ...mP, arms: [[.2 + .7 * watch, .2 + 1.5 * watch], [.25, .2]], hands: ['open', 'hold'], ...rArm });
      boilSeed('ask-bag'); inkLine([[bagX + 10, bagY - 4], [1075, 940 - 3.95 * U]], 1.6, '#3A2A26', 'ink', .3); paint(rrPts(bagX - 25, bagY, 70, 92, 12), { wash: '#5A3E36', ink: ST.ink, sw: 1 });
      if (watch > .5) { boilSeed('ask-w'); paint(ellPts(1000, 940 - 3.8 * U, 12, 12, 10), { wash: ST.cream, ink: ST.ink, sw: .8 }); }
      // Nerd runs in from the right with the tablet held up, then begs
      const run = 1 - easeOut(seg(l, 0, .9)), nx = 1400 + 520 * run;
      const beg = seg(l, 4.3, 4.6);
      const nP = pose(l, [[0, { eyes: 'wide', mouth: 'grin', tuft: 1, look: [-.8, 0] }], [1.0, { eyes: 'dot', look: [-.8, -.1], brow: 'up', turn: -.5 }],
        [4.3, { eyes: 'wide', brow: 'worry', mouth: 'o', tilt: -.12, _d: .2 }]]);
      const tx = nx - 60, ty = 940 - 2.3 * U;
      person(nx, 940, U, { who: 'nerd', id: 'ask-n', ...nP, ...(run > .02 ? { view: 'side', flip: true, walk: run * 6 } : {}),
        ...(beg > .5 ? { arms: [[.7, 2.0], [.7, 2.0]], hands: ['fist', 'fist'], dy: .06 * Math.abs(Math.sin(l * 9)) } : { reach: [[tx - .45 * U, ty + .05 * U], [tx + .45 * U, ty]], hands: ['hold', 'hold'] }) });
      if (beg <= .5) tablet(tx, ty, U * .9, .1, .8, { id: 'ask-t' });
      camEnd();
      sepia(1);
      if (l < .2) flash(.6 * (1 - l / .2), '#F3E3C4');
    }
  }
  insertShot('ask', shotAsk);
  shots([[12, shotPlaza], [16, shotBed], [20, shotDoor], [24.6, shotAccount], [27, shotRule], [29.8, shotNod], [32, shotRequest]]);
})();
