// modelsheet2.js: the final model sheets in look A (watercolour). One sheet per character, plus one for the extras.
//   node render.mjs --soft-gl --loop=ms_nerd   --sheet=1.3 --cols=1 --w=1920 --out=out/check/ms_nerd.jpg
//   (ms_mom, ms_extras likewise). Labels are fine here: model sheets never appear in the film.
(() => {
  const lab = (txt, x, y, size = 24, col = ST.inkSoft, o = {}) => letter(txt, x, y, size, col, { font: `${o.w || 600} ${size}px Mali, Loma, sans-serif`, ink: false, align: o.align || 'center', alpha: .9 });
  const sheetBg = (title, sub) => {
    LOOK = 'water';
    boilSeed('msbg'); paint(rectPts(-20, -20, W + 40, H + 40), { wash: '#F3EBDD', ink: null });
    paint(ellPts(500, 300, 700, 380, 24, 8), { fill: '#FBF5E8', fillOp: 120, bleed: .3, tex: .4, ink: null });
    lab(title, 50, 52, 44, ST.ink, { align: 'left', w: 700 }); lab(sub, 50, 98, 24, ST.inkSoft, { align: 'left', w: 500 });
  };
  const guide = (y, x0, x1, txt) => { boilSeed('gd' + y + x0); inkLine([[x0, y], [x1, y]], .5, '#B7AC98', 'inkfine', 0); if (txt) lab(txt, x0 - 10, y, 16, '#9A8F7C', { align: 'right' }); };
  const ground = (y, x0, x1) => { boilSeed('gr' + y + x0); inkLine([[x0, y + 3], [x1, y + 4]], .8, '#A89C86', 'inkfine', .3); };
  const panel = (x, y, w, h, title) => { boilSeed('pn' + x + y); paint(rrPts(x, y, w, h, 18), { wash: '#FAF4E8', ink: '#C9BDA6', sw: .7 }); if (title) lab(title, x + 18, y + 26, 22, ST.ink, { align: 'left', w: 700 }); };
  const swatches = (x, y, list) => list.forEach(([c, name], i) => { boilSeed('sw' + i + name); paint(rrPts(x + i * 112, y, 92, 54, 10), { wash: c, ink: ST.ink, sw: .8 }); lab(name, x + i * 112 + 46, y + 74, 15); });

  // ---------------- Nerd ----------------
  LOOPS.ms_nerd = t => {
    sheetBg('เนิร์ด (Nerd)', 'ตัวเอก · เด็กชาย ป.5 อายุ 11 ปี · จุดจำ: แว่นกลมโต + ปอยผม (ตั้ง = ดีใจ/มั่นใจ, ลู่ = ผิด/เสียใจ) · เสื้อยืดตัวโคร่งลายจอยเกม');
    const U = 70, gy = 560;
    panel(30, 130, 1000, 500, 'มุมรอบตัว (ความสูง 4.5u)');
    const top = gy - 4.55 * U, sh = gy - (1.45 + 1.45 * .85) * U;
    guide(top, 120, 1010, 'หัว'); guide(gy - 1.45 * U, 120, 1010, 'สะโพก'); ground(gy, 70, 1010);
    const views = [['หน้า', 200, { turn: 0 }], ['3/4', 400, { turn: .6 }], ['ข้าง', 600, { view: 'side' }], ['3/4 อีกฝั่ง', 780, { turn: -.6 }], ['หลัง', 940, { view: 'back' }]];
    views.forEach(([n, x, o], i) => { person(x, gy, U, { who: 'nerd', id: 'tv' + i, eyes: 'dot', mouth: 'smile', tuft: .5, ...o }); lab(n, x, gy + 40, 20); });
    // expressions
    panel(1050, 130, 840, 500, 'สีหน้า');
    const ex = [['ปกติ', { eyes: 'dot', mouth: 'flat' }], ['ภูมิใจ', { eyes: 'happy', mouth: 'grin', tuft: 1, brow: 'up' }], ['เขินที่ถูกชม', { eyes: 'happy', mouth: 'smile', blush: 1, look: [.4, .2], tilt: .12 }],
      ['สงสัย', { eyes: 'half', mouth: 'tight', brow: 'worry', look: [-.6, -.3] }], ['อยากได้', { eyes: 'star', mouth: 'open', mouthOpen: .5, tuft: 1 }], ['ลังเล/กังวล', { eyes: 'dot', look: [.7, 0], mouth: 'wobble', brow: 'worry', sweat: .8 }],
      ['รู้สึกผิด', { eyes: 'sad', look: [0, .6], mouth: 'flat', brow: 'sad', tuft: -1 }], ['ร้องไห้', { eyes: 'teary', tears: 1, mouth: 'wobble', brow: 'sad', tuft: -1 }]];
    ex.forEach(([n, o], i) => { const x = 1155 + (i % 4) * 208, y = 270 + Math.floor(i / 4) * 215; person(x, y, 66, { who: 'nerd', id: 'ex' + i, headOnly: true, ...o }); lab(n, x, y + 100, 18); });
    // key poses from the story
    panel(30, 650, 1360, 400, 'ท่าหลักในเรื่อง');
    const py = 1000, PU = 62;
    boilSeed('bedA'); paint(rrPts(80, py - 40, 260, 60, 14), { wash: '#6E5A7E', ink: ST.ink, sw: 1 });
    { const tx = 235, ty = py - 1.15 * PU - 40; person(205, py - 40, PU, { who: 'nerd', id: 'k1', sit: 1, seat: .15, eyes: 'happy', mouth: 'smile', blush: .8, screen: 1, tuft: .8, reach: [[tx - .55 * PU, ty + .1 * PU], [tx + .55 * PU, ty + .05 * PU]], hands: ['hold', 'hold'] }); tablet(tx, ty, PU, -.12, 1, { id: 'k1' }); }
    lab('คุยกับ "พี่แอดมิน" (12)', 210, py + 30, 17);
    { const tx = 520, ty = py - 2.0 * PU; const r2 = person(470, py, PU, { who: 'nerd', id: 'k2', view: 'side', look: [.3, .6], eyes: 'dot', mouth: 'tight', brow: 'worry', screen: 1, tuft: .2, reach: [null, [tx, ty]], hands: [null, 'point'] }); tablet(r2.hand[0] + 12, r2.hand[1] + 30, PU, .35, 1, { id: 'k2' }); }
    lab('พิมพ์รหัส 6 หลัก (22)', 500, py + 30, 17);
    { const r = person(760, py, PU, { who: 'nerd', id: 'k3', eyes: 'star', mouth: 'grin', tuft: 1, arms: [[2.6, -.2], [2.4, -.3]], hands: ['open', 'fist'], dy: .25 * Math.abs(Math.sin(t * 5)) }); }
    lab('ดีใจได้ของขวัญ (14)', 760, py + 30, 17);
    { const tx = 1010, ty = py - 2.5 * PU; person(990, py, PU, { who: 'nerd', id: 'k4', eyes: 'teary', tears: 1, mouth: 'wobble', brow: 'sad', tuft: -1, reach: [[tx - .5 * PU, ty + .1 * PU], [tx + .5 * PU, ty + .1 * PU]], hands: ['hold', 'hold'], lean: .05 }); tablet(tx, ty, PU, 0, .6, { id: 'k4' }); }
    lab('ยื่นแชทให้แม่ (28)', 1000, py + 30, 17);
    person(1240, py, PU, { who: 'nerd', id: 'k5', view: 'side', walk: t * 1.6, eyes: 'dot', mouth: 'smile', tuft: .6 });
    lab('เดิน', 1240, py + 30, 17);
    ground(py, 60, 1370);
    panel(1410, 650, 480, 400, 'จานสี');
    swatches(1440, 700, [[ST.skin, 'ผิว'], [ST.hair, 'ผม'], [ST.tee, 'เสื้อ'], [ST.shorts, 'กางเกง']]);
    swatches(1440, 830, [[ST.shoe, 'รองเท้า'], [ST.lens, 'เลนส์'], [ST.blush, 'แก้ม'], [ST.tear, 'น้ำตา']]);
    lab('ข้อห้าม: แว่นต้องอยู่ทุกช็อต · ปอยผมบอกอารมณ์', 1650, 990, 16, ST.inkSoft);
  };
  LOOPS.ms_nerd.len = 4;

  // ---------------- Mom ----------------
  LOOPS.ms_mom = t => {
    sheetBg('แม่', 'แม่ทำงานประจำ · จุดจำ: ผมมุ่นลวก ๆ + แว่นดันขึ้นหัว + เสื้อคลุมสีอิฐ · ไม่ดุ ไม่ตะคอก แสดงอารมณ์ทางสีหน้าและท่าทาง');
    const U = 56, gy = 575;
    panel(30, 130, 1000, 500, 'มุมรอบตัว (ความสูง 5.9u)');
    guide(gy - 5.95 * U, 120, 1010, 'หัว'); guide(gy - 2.45 * U, 120, 1010, 'สะโพก'); ground(gy, 70, 1010);
    const views = [['หน้า', 200, {}], ['3/4', 400, { turn: .55 }], ['ข้าง', 600, { view: 'side' }], ['3/4 อีกฝั่ง', 780, { turn: -.55 }], ['หลัง', 940, { view: 'back' }]];
    views.forEach(([n, x, o], i) => { person(x, gy, U, { who: 'mom', id: 'mv' + i, eyes: 'dot', mouth: 'flat', brow: 'flat', ...o }); lab(n, x, gy + 40, 20); });
    panel(1050, 130, 840, 500, 'สีหน้า');
    const ex = [['ยุ่งกับงาน', { eyes: 'dot', look: [.6, .4], mouth: 'flat', brow: 'flat' }], ['บัตรถูกปฏิเสธ', { eyes: 'wide', mouth: 'o', brow: 'up' }], ['คุยสายธนาคาร', { eyes: 'dot', mouth: 'tight', brow: 'worry', look: [-.5, 0], sweat: .6 }],
      ['ถามลูกเบา ๆ', { eyes: 'dot', mouth: 'smile', brow: 'sad', tilt: -.1 }], ['อ่านแชท', { eyes: 'half', look: [0, .7], mouth: 'flat', brow: 'worry' }], ['นึกได้ว่ารหัสบอกลูกเอง', { eyes: 'sad', mouth: 'frown', brow: 'sad', look: [.6, .2] }]];
    ex.forEach(([n, o], i) => { const x = 1190 + (i % 3) * 280, y = 280 + Math.floor(i / 3) * 215; person(x, y, 74, { who: 'mom', id: 'me' + i, headOnly: true, ...o }); lab(n, x, y + 100, 18); });
    panel(30, 650, 1360, 400, 'ท่าหลักในเรื่อง');
    const py = 1030, PU = 52;
    { const r = person(170, py, PU, { who: 'mom', id: 'p1', turn: .4, eyes: 'dot', look: [.5, .5], brow: 'worry', mouth: 'tight', reach: [null, [260, py - 3.4 * PU]], hands: [null, 'hold'] }); boilSeed('pc'); paint(rrPts(r.hand[0] - 30, r.hand[1] - 20, 60, 38, 5), { wash: '#3E6FB0', ink: ST.ink, sw: .8 }); }
    lab('แตะบัตร (1)', 180, py + 25, 17);
    { const head = [436, py - 4.5 * PU - .66 * PU * .92], ear = [head[0] + .78 * PU, head[1] + .05 * PU]; const r = person(440, py, PU, { who: 'mom', id: 'p2', turn: -.35, eyes: 'wide', brow: 'up', mouth: 'o', sweat: .8, reach: [null, ear], hands: [null, 'hold'] }); phone(r.hand[0] - 4, r.hand[1] - 8, PU, -.2, .8, { id: 'p2' }); }
    lab('รับสายธนาคาร (2, 25)', 440, py + 25, 17);
    boilSeed('chair'); paint(rrPts(640, py - 1.5 * PU, 140, 1.5 * PU, 10), { wash: '#A7835F', ink: ST.ink, sw: 1 });
    person(710, py, PU, { who: 'mom', id: 'p3', sit: 1, seat: 1.5, eyes: 'dot', mouth: 'smile', brow: 'sad', tilt: -.1, arms: [[.5, .9], [.5, .9]], hands: ['open', 'open'] });
    lab('นั่งลงถามลูก (27)', 710, py + 25, 17);
    { const tx = 990, ty = py - 3.3 * PU; person(960, py, PU, { who: 'mom', id: 'p4', eyes: 'half', look: [.2, .8], brow: 'worry', mouth: 'flat', reach: [[tx - .5 * PU, ty + .1 * PU], [tx + .5 * PU, ty]], hands: ['hold', 'point'] }); tablet(tx, ty, PU * .8, .05, .8, { id: 'p4' }); }
    lab('อ่านแชท (29)', 970, py + 25, 17);
    person(1240, py, PU, { who: 'mom', id: 'p5', eyes: 'sad', brow: 'sad', mouth: 'frown', arms: [[.9, 1.6], [.9, 1.6]], hands: ['open', 'open'], lean: .06 });
    lab('กอดลูก (30)', 1240, py + 25, 17);
    ground(py, 60, 1370);
    panel(1410, 650, 480, 400, 'จานสี');
    swatches(1440, 700, [[ST.skinMom, 'ผิว'], [ST.hairMom, 'ผม'], [ST.cardi, 'เสื้อคลุม'], [ST.blouse, 'เสื้อใน']]);
    swatches(1440, 830, [[ST.pants, 'กางเกง'], [ST.momShoe, 'รองเท้า'], [ST.glass, 'กรอบแว่น'], ['#3E6FB0', 'บัตรเครดิต']]);
    lab('สูงกว่าเนิร์ดประมาณ 1.3 เท่า', 1650, 990, 16, ST.inkSoft);
  };
  LOOPS.ms_mom.len = 4;

  // ---------------- extras: inner voices, Robox avatars, props, size line-up ----------------
  LOOPS.ms_extras = t => {
    sheetBg('ตัวละครรองและของประกอบฉาก', 'เสียงในหัว · อวตารในเกม Robox (บล็อกมุมมน ไม่ใช่หน้าตาเกมจริง) · ของที่ผูกเรื่อง');
    panel(30, 130, 560, 440, 'เสียงในหัว (เนิร์ดตัวจิ๋ว)');
    voice(140, 400, 46, 'angel', { id: 'v1', eyes: 'half', brow: 'worry', mouth: 'tight' }); lab('สงสัย (10, 15)', 140, 520, 18);
    voice(300, 400, 46, 'angel', { id: 'v2', eyes: 'wide', brow: 'up', mouth: 'open', mouthOpen: .8, arms: [[2.5, .2], [.6, .3]] }); lab('เตือน "อย่านะ!" (21)', 300, 520, 18);
    voice(470, 400, 46, 'devil', { id: 'v3', eyes: 'star', mouth: 'grin', arms: [[.6, .3], [2.5, .3]], hands: [null, 'point'] }); lab('อยาก "ส่งเลย!" (21)', 470, 520, 18);
    panel(610, 130, 1280, 440, 'อวตารในเกม Robox');
    const ay = 480;
    avatar(720, ay, 58, { skin: 'classic', id: 'a1', face: 'sad' }); lab('เนิร์ด: คลาสสิคสกิน', 720, ay + 40, 17);
    avatar(960, ay, 58, { skin: 'friendA', id: 'a2', face: 'smug', wings: 1, arms: [.2, 1.3] }); lab('เพื่อน A + ปีกมังกร', 960, ay + 40, 17);
    avatar(1220, ay, 58, { skin: 'friendB', id: 'a3', face: 'happy', wings: .9, flap: t * 7 + 1.5 }); lab('เพื่อน B', 1220, ay + 40, 17);
    avatar(1480, ay, 58, { skin: 'admin', id: 'a4', face: 'happy', badge: true, aura: .8, arms: [.2, 1.3] }); lab('"Admin_Official"', 1480, ay + 40, 17);
    avatar(1740, ay, 58, { skin: 'admin', id: 'a5', face: 'happy', badge: false, aura: 0, arms: [.1, .1], t: t }); boilSeed('ghost'); paint(rectPts(1660, 180, 170, 330), { wash: '#FAF4E8', washOp: 170, ink: null }); lab('หายตัว (26)', 1740, ay + 40, 17);
    panel(30, 590, 1000, 460, 'ของประกอบฉาก');
    tablet(170, 760, 120, 0, 1, { id: 'pr1' }); lab('แท็บเล็ต (บัญชีแม่)', 170, 860, 17);
    phone(400, 760, 120, 0, .9, { id: 'pr2' }); lab('โทรศัพท์แม่', 400, 860, 17);
    boilSeed('crd'); push(); translate(600, 760); paint(rrPts(-80, -50, 160, 100, 10), { wash: '#3E6FB0', ink: ST.ink, sw: 1.1 }); paint(rrPts(-58, -20, 30, 22, 4), { wash: ST.gold, ink: ST.ink, sw: .5 }); pop(); lab('บัตรเครดิต', 600, 860, 17);
    boilSeed('gft'); paint(rrPts(780, 710, 110, 90, 10), { wash: ST.pink, ink: ST.ink, sw: 1 }); paint(rectPts(828, 710, 14, 90), { wash: ST.gold, ink: null }); paint(ellPts(818, 700, 22, 14, 10), { wash: ST.gold, ink: ST.ink, sw: .7 }); paint(ellPts(852, 700, 22, 14, 10), { wash: ST.gold, ink: ST.ink, sw: .7 }); lab('กล่องของขวัญ', 835, 860, 17);
    boilSeed('otp'); paint(rrPts(120, 905, 300, 110, 18), { wash: ST.cream, ink: ST.ink, sw: 1 }); lab('4 8 2 9 1 7', 270, 943, 32, ST.ink, { w: 700 }); lab('ห้ามบอกรหัสนี้กับใคร', 270, 985, 16, '#B23A48');
    lab('ป๊อปอัพรหัส 6 หลัก (20)', 470, 960, 17, ST.inkSoft, { align: 'left' });
    boilSeed('badge'); paint(ellPts(850, 960, 34, 34, 16), { wash: ST.badge, ink: ST.ink, sw: .9 }); inkLine([[834, 960], [846, 973], [868, 946]], 2.2, ST.cream, 'ink', 0); lab('เครื่องหมายถูกปลอม', 850, 1030, 17);
    panel(1050, 590, 840, 460, 'เทียบความสูง');
    const ly = 1000, LU = 48;
    guide(ly - 5.95 * LU, 1110, 1860); guide(ly - 4.55 * LU, 1110, 1860); ground(ly, 1080, 1870);
    person(1200, ly, LU, { who: 'mom', id: 'l1', eyes: 'dot', mouth: 'smile' }); lab('แม่', 1200, ly + 28, 18);
    person(1360, ly, LU, { who: 'nerd', id: 'l2', eyes: 'dot', mouth: 'smile', tuft: .6 }); lab('เนิร์ด', 1360, ly + 28, 18);
    avatar(1560, ly, LU * .9, { skin: 'classic', id: 'l3' }); lab('อวตาร (ในเกม)', 1560, ly + 28, 18);
    voice(1740, ly - 120, LU * .55, 'angel', { id: 'l4', eyes: 'dot', mouth: 'smile' }); lab('เสียงในหัว', 1740, ly + 28, 18);
  };
  LOOPS.ms_extras.len = 4;
})();
