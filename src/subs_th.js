// subs_th.js: Thai subtitles for spoken lines (the VO and dialogue have no audio yet, so the subs carry the words).
// sub(lt, t0, t1, txt, who): lower third, cream letters with a dark edge, fades in/out over .15 s. Call after camEnd().
const SUBCOL = { vo: '#FBF3E4', mom: '#FFE2C6', nerd: '#CDEBFF', admin: '#FFE7A6', voice: '#FFFFFF', bank: '#E6F2E6' };
function sub(lt, t0, t1, txt, who = 'vo', o = {}) {
  if (lt < t0 || lt > t1) return;
  const a = Math.min(seg(lt, t0, t0 + .15), 1 - seg(lt, t1 - .15, t1));
  letter(txt, W / 2, o.y ?? H - 92, o.size ?? 50, SUBCOL[who] || who, { font: `600 ${o.size ?? 50}px Mali, Loma, sans-serif`, ink: false, stroke: '#1E1A24', alpha: a, screen: true });
}
// Thai lettering that belongs to the world (screens, chat bubbles): left-aligned by default, follows the camera.
const thai = (txt, x, y, size, col, o = {}) => letter(txt, x, y, size, col, { font: `${o.w || 600} ${size}px Mali, Loma, sans-serif`, ink: false, align: o.align || 'left', ...o });
