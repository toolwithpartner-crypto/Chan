// looks.js: three candidate render treatments for the same drawings, switched by the global LOOK (set it at the top
// of a shot or loop). Everything still goes through paint()/inkLine(), so the scenes don't change between looks.
//   'water'  : the kit's look. Flat washes + boiling ink + watercolour fills, paper grain over everything.
//   'flat'   : clean flat cartoon. Watercolour fills become solid colour, steady marker outlines, no paper grain.
//   'pencil' : colour-pencil storybook. Light washes with pencil hatching on top, graphite outlines, paper shows through.
let LOOK = 'water', FASTFILL = true;
(() => {
  const _paint = paint, _inkLine = inkLine, _composite = composite, _defineBrushes = defineBrushes;
  defineBrushes = () => {
    _defineBrushes();
    brush.add('flatline', { type: 'default', weight: 5, scatter: .03, sharpness: .95, grain: 60, opacity: 250, spacing: .15, pressure: [1.02, .98], rotate: 'natural', noise: .02 });
    brush.add('graphite', { type: 'default', weight: 3.2, scatter: .5, sharpness: .5, grain: 14, opacity: 170, spacing: .35, pressure: [1.1, .7], rotate: 'natural', noise: .5 });
  };
  const darker = c => c ? mixCol(c, ST.ink, .35) : ST.ink;
  paint = (pts, o = {}) => {
    if (LOOK === 'flat') {
      const q = { ...o };
      if (q.fill && !q.wash && q.ink === null) return;   // soft watercolour depth patches have no place in flat colour
      if (q.fill && !q.wash) q.wash = q.fill;
      delete q.fill; delete q.hatch;
      if (q.ink !== null) { q.br = 'flatline'; q.sw = (q.sw ?? 1) * 1.15; }
      return _paint(pts, q);
    }
    if (LOOK === 'pencil') {
      const q = { ...o };
      if (q.wash) { q.washOp = (q.washOp ?? 255) * .6; if (!q.hatch && q.ink !== null) q.hatch = { d: 5, a: .9, o: { rand: .4 }, b: 'cpencil', c: darker(q.wash), w: 1.1 }; }
      if (q.fill) { q.fillOp = (q.fillOp ?? 170) * .8; q.tex = .9; }
      if (q.ink !== null) { q.br = 'graphite'; q.ink = mixCol(q.ink || ST.ink, ST.inkSoft, .4); }
      return _paint(pts, q);
    }
    // A flat, opaque full-frame backdrop costs ~1 s as a brush wash; draw it natively instead (identical flat colour).
    if (FASTFILL && o.wash && o.ink === null && !o.fill && !o.hatch && (o.washOp ?? 255) >= 255 && pts.length === 4) {
      const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]);
      if (Math.max(...xs) - Math.min(...xs) >= W && Math.max(...ys) - Math.min(...ys) >= H) {
        flushBrush(); push(); noStroke(); fill(o.wash); rect(Math.min(...xs), Math.min(...ys), Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys)); pop();
        return;
      }
    }
    // FASTFILL: a watercolour fill costs ~8 s a frame without a GPU. Large soft depth patches become a translucent wash
    // (the paper grain on top keeps them from looking digital). Set FASTFILL = false on a machine with a GPU.
    if (FASTFILL && o.fill && !o.wash && !o.hatch) return _paint(pts, { ...o, fill: undefined, wash: o.fill, washOp: (o.fillOp ?? 170) * .45 });
    return _paint(pts, o);
  };
  inkLine = (pts, sw = 1, col = PAL.ink, br = 'ink', curv = .5) => {
    if (LOOK === 'flat') return _inkLine(pts, sw * 1.1, col, 'flatline', curv);
    if (LOOK === 'pencil') return _inkLine(pts, sw, mixCol(col, ST.inkSoft, .4), 'graphite', curv);
    return _inkLine(pts, sw, col, br, curv);
  };
  const applySepia = () => {
    if (typeof SEPIA === 'undefined' || SEPIA <= 0) return;
    const c = outX, k = SEPIA; SEPIA = 0;
    c.globalCompositeOperation = 'multiply'; c.fillStyle = `rgba(214,170,110,${.55 * k})`; c.fillRect(0, 0, W, H);
    const g = c.createRadialGradient(W / 2, H / 2, H * .35, W / 2, H / 2, H * .95); g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(1, `rgba(120,80,40,${.6 * k})`);
    c.fillStyle = g; c.fillRect(0, 0, W, H); c.globalCompositeOperation = 'source-over';
  };
  composite = t => {
    if (LOOK !== 'flat') { _composite(t); return applySepia(); }
    const c = outX; c.globalCompositeOperation = 'source-over'; c.globalAlpha = 1;
    c.drawImage(drawingContext.canvas, 0, 0, W, H); drawLetters(c); applySepia();
  };
})();
// Transitions cover everything painted before them, lettering included: flush the queued letters first,
// so screen text (chat, labels) goes under a wipe or a flash instead of floating on top of it.
(() => {
  const _flash = flash, _wipe = brushWipe;
  flash = (k, col) => { if (k > .01) flushLetters(); _flash(k, col); };
  brushWipe = (p, cols) => { if (p > 0 && p < 1) flushLetters(); _wipe(p, cols); };
})();
