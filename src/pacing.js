// pacing.js: breathing room. The scenes are written in "story time" (0–150 s). This table lengthens shots without
// touching their code, and everything follows it: the picture (timeline.js), the spoken lines and subtitles
// (script.js → lines.mjs → dialog.mjs), the sound effects and the music (audiolib warp).
//   key = the shot's start in story time.  slow: play the shot slower (1.3 = 30 % longer).
//   hold: extra seconds at the end of the shot before its exit transition, for the viewer to take the moment in.
const PACE = {
  0: { hold: .8 },                 // the second DECLINED sinks in
  3: { slow: 1.15, hold: 2.8 },    // "my card's been frozen?": stay on Mom's face, let the question form
  6: { slow: 1.6 },                // the three panels: a breath between the narrator's phrases
  12: { hold: .4 }, 16: { hold: .8 }, 20: { slow: 1.1 },
  24.6: { hold: 1.0 },             // read "Mom's account / card saved"
  27: { hold: .5 }, 29.8: { hold: .2 },
  38: { slow: 1.6, hold: .6 },     // chat opens on the admin's name and badge 40.6: { hold: .2 }, 42: { hold: .3 }, 46: { hold: .8 }, 52: { slow: 1.4 }, 58: { slow: 1.35, hold: .3 },
  63: { slow: 1.35, hold: 1.2 },   // "don't tell anyone" lands
  69: { hold: .3 }, 73: { slow: 1.35, hold: .3 }, 78: { hold: .2 },
  82: { slow: 1.3, hold: .6 },     // time to spot the zero in the address
  92: { slow: 1.3, hold: .6 }, 102: { slow: 1.3, hold: 2.4 }, 106: { slow: 1.2, hold: 1.4 }, 110: { hold: .8 },
  118: { hold: 1.2 },              // Mom takes in the total
  123: { hold: .2 }, 125.5: { hold: .8 }, 128: { hold: .5 }, 132: { hold: .5 }, 137: { slow: 1.3, hold: .6 },
  144: { hold: 1.6 },              // the last image stays
};
// INSERTS: whole new shots placed before a story-time shot (their own clock, their own lines in script.js via `ins`).
const INSERTS = {
  ask: { before: 20, len: 9.0 },   // flashback: the app store asks for Mom's password; Nerd runs to ask her for it
};
const STORY_END = 150;
// Build the map from the shot starts (story time). Returns { shots: [{a, b, a2, b2, slow}], warp(t), total }.
function makePacing(starts) {
  const s = [...new Set(starts)].sort((x, y) => x - y), out = [];
  let a2 = 0;
  s.forEach((a, i) => {
    for (const [name, ins] of Object.entries(INSERTS)) if (ins.before === a) { out.push({ ins: name, a: a, b: a, a2, b2: a2 + ins.len, slow: 1 }); a2 += ins.len; }
    const b = i + 1 < s.length ? s[i + 1] : STORY_END, p = PACE[a] || {}, slow = p.slow || 1, len = (b - a) * slow + (p.hold || 0);
    out.push({ a, b, a2, b2: a2 + len, slow }); a2 += len;
  });
  // warp(story t) → film t; warp(t, 'ask') → film time t seconds into the inserted shot 'ask'
  const warp = (t, ins) => {
    if (ins) { const sh = out.find(x => x.ins === ins); return sh.a2 + t; }
    const sh = out.find(x => !x.ins && t >= x.a && t < x.b) || out[out.length - 1]; return sh.a2 + Math.min(t - sh.a, sh.b - sh.a) * sh.slow;
  };
  return { shots: out, warp, total: a2 };
}
if (typeof module !== 'undefined') module.exports = { PACE, INSERTS, makePacing };
