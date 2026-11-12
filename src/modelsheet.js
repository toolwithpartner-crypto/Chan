// modelsheet.js: reference sheets for this film's cast (labels are fine here; they never appear in the video).
//   node render.mjs --soft-gl --loop=cast  --sheet=1.3 --cols=1 --w=1920 --out=out/check/cast.jpg
//   node render.mjs --soft-gl --loop=faces --sheet=1.3 --cols=1 --w=1920 --out=out/check/faces.jpg
(() => {
  const label = (txt, x, y, size = 22) => letter(txt, x, y, size, ST.ink, { ink: false, alpha: .8 });
  const ground = (y) => { boilSeed('g' + y); inkLine([[40, y + 4], [W / 2, y + 2], [W - 40, y + 5]], .6, mixCol(ST.paper, ST.ink, .35), 'inkfine', .5); };
  const bg = () => { boilSeed('bg'); paint(rectPts(-20, -20, W + 40, H + 40), { wash: ST.paper, ink: null }); };

  LOOPS.cast = t => {
    bg();
    const y1 = 470, U = 64;
    const row = [
      ['Nerd front', 150, () => person(150, y1, U, { who: 'nerd', id: 'a', eyes: 'dot', mouth: 'smile', tuft: .4 })],
      ['Nerd 3/4', 370, () => person(370, y1, U, { who: 'nerd', id: 'b', turn: .6, eyes: 'dot', mouth: 'smile', arms: [[.2, .2], [.6, .9]], hands: [null, 'open'] })],
      ['Nerd side', 590, () => person(590, y1, U, { who: 'nerd', id: 'c', view: 'side', walk: t * 1.5, mouth: 'flat' })],
      ['Nerd back', 790, () => person(790, y1, U, { who: 'nerd', id: 'd', view: 'back' })],
      ['Mom front', 1060, () => person(1060, y1, U, { who: 'mom', id: 'e', eyes: 'dot', mouth: 'flat', brow: 'flat' })],
      ['Mom 3/4 + phone', 1300, () => { const r = person(1300, y1, U, { who: 'mom', id: 'f', turn: -.5, eyes: 'dot', look: [-.3, 0], brow: 'worry', mouth: 'o', arms: [[.15, .1], [.3, 2.6]], hands: [null, 'hold'] }); phone(r.hand[0], r.hand[1] - .2 * U, U, .1, .8, { id: 'f' }); }],
      ['Mom side', 1540, () => person(1540, y1, U, { who: 'mom', id: 'g', view: 'side', walk: t * 1.3, mouth: 'flat' })],
      ['Mom back', 1760, () => person(1760, y1, U, { who: 'mom', id: 'h', view: 'back' })],
    ];
    for (const [name, x, f] of row) { f(); label(name, x, y1 + 40); }
    ground(y1);
    // row 2: Nerd sitting with the tablet, the two inner voices, the Robox avatars
    const y2 = 1000;
    boilSeed('sofa'); paint(rrPts(50, y2 - .8 * U, 280, .8 * U, 10), { wash: '#9C7B64', ink: ST.ink, sw: 1 });
    const tx = 205, ty = y2 - 1.55 * U;
    person(180, y2, U, { who: 'nerd', id: 'i', sit: 1, seat: .8, eyes: 'dot', look: [.3, .9], mouth: 'o', screen: 1, reach: [[tx - .55 * U, ty + .1 * U], [tx + .55 * U, ty + .05 * U]], hands: ['hold', 'hold'], tuft: .8 });
    tablet(tx, ty, U, -.12, 1, { id: 'i' });
    label('Nerd + tablet', 180, y2 + 40);
    voice(430, y2 - 120, 40, 'angel', { id: 'j', eyes: 'dot', brow: 'worry', mouth: 'o' }); label('voice: doubt', 430, y2 + 40);
    voice(610, y2 - 120, 40, 'devil', { id: 'k', eyes: 'star', mouth: 'grin', arms: [[.6, .3], [2.4, .3]] }); label('voice: want', 610, y2 + 40);
    avatar(820, y2, 62, { skin: 'classic', face: 'dot', id: 'l' }); label('Nerd avatar (classic skin)', 820, y2 + 40, 18);
    avatar(1080, y2, 62, { skin: 'friendA', face: 'smug', wings: 1, id: 'm', arms: [.2, 1.2] }); label('friend A + dragon wings', 1080, y2 + 40, 18);
    avatar(1360, y2, 62, { skin: 'friendB', face: 'happy', wings: .9, id: 'n', flap: t * 7 + 1.5 }); label('friend B', 1360, y2 + 40, 18);
    avatar(1640, y2, 62, { skin: 'admin', face: 'happy', badge: true, aura: .8, id: 'o', arms: [.2, 1.4] }); label('"Admin_Official" + fake badge', 1640, y2 + 40, 18);
    ground(y2);
  };
  LOOPS.cast.len = 4;

  LOOPS.faces = t => {
    bg();
    const nerd = [
      ['neutral', { eyes: 'dot', mouth: 'flat' }],
      ['proud (tuft up)', { eyes: 'happy', mouth: 'grin', tuft: 1, brow: 'up' }],
      ['shy / flattered', { eyes: 'happy', mouth: 'smile', blush: 1, look: [.4, .2], tilt: .12 }],
      ['doubt', { eyes: 'half', mouth: 'tight', brow: 'worry', look: [-.6, -.3] }],
      ['want (star eyes)', { eyes: 'star', mouth: 'open', mouthOpen: .5 }],
      ['nervous', { eyes: 'dot', look: [.7, 0], mouth: 'wobble', brow: 'worry', sweat: .8 }],
      ['caught (tuft down)', { eyes: 'sad', look: [0, .6], mouth: 'flat', brow: 'sad', tuft: -1 }],
      ['crying', { eyes: 'teary', tears: 1, mouth: 'wobble', brow: 'sad', tuft: -1 }],
    ];
    nerd.forEach(([name, f], i) => { const x = 130 + i * 237, y = 230; person(x, y, 110, { who: 'nerd', id: 'n' + i, headOnly: true, ...f }); label(name, x, y + 200, 20); });
    const mom = [
      ['busy (work)', { eyes: 'dot', look: [.6, .4], mouth: 'flat', brow: 'flat' }],
      ['card declined', { eyes: 'wide', mouth: 'o', brow: 'up' }],
      ['on the bank call', { eyes: 'dot', mouth: 'tight', brow: 'worry', look: [-.5, 0], sweat: .6 }],
      ['asking gently', { eyes: 'dot', mouth: 'smile', brow: 'sad', tilt: -.1 }],
      ['reading the chat', { eyes: 'half', look: [0, .7], mouth: 'flat', brow: 'worry' }],
      ['realises (her password)', { eyes: 'sad', mouth: 'frown', brow: 'sad', look: [.6, .2] }],
    ];
    mom.forEach(([name, f], i) => { const x = 190 + i * 308, y = 720; person(x, y, 120, { who: 'mom', id: 'm' + i, headOnly: true, ...f }); label(name, x, y + 190, 20); });
  };
  LOOPS.faces.len = 4;
})();
