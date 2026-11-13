// script.js: every spoken line of the film, in one table. It drives three things:
//   1. scripts/tts.py reads it (via scripts/lines.mjs) and makes one voice file per line, all in one batch;
//   2. scripts/dialog.mjs places each file so its first syllable lands at `at` and writes src/dialog.js (lip-sync);
//   3. the subtitles on screen (scriptSubs below), timed to the real audio once dialog.js exists.
// who: 'vo' narrator · 'mom' · 'nerd' (mouth moves) · 'think' (Nerd's inner voice, no mouth) · 'devil' · 'admin' (reads his chat)
//      · 'friendA' · 'friendB' · 'bank'.   style: how to say it (passed to the TTS as a direction).
const LINES = [
  // ---- Hook ----
  { id: 'h01', at: 4.15, who: 'mom', text: "Hello? …My card's been frozen?", style: 'confused, embarrassed at a checkout, quiet so the queue will not hear' },
  { id: 'h02', at: 6.2, who: 'vo', text: "The card wasn't stolen…", style: 'calm documentary narrator, intrigued' },
  { id: 'h03', at: 7.95, who: 'vo', text: "Her son didn't buy anything…", style: 'calm documentary narrator, building curiosity' },
  { id: 'h04', at: 9.75, who: 'vo', text: 'So where did fifteen thousand baht go?', style: 'calm narrator, a real question to the audience' },
  { id: 'h05', at: 11.35, who: 'vo', text: 'One week earlier.', style: 'calm narrator, short' },
  // ---- Act 1 ----
  { id: 'a01', at: 12.35, who: 'friendA', text: 'Limited-edition dragon wings!', style: 'an excited, show-off 11-year-old boy shouting in a game' },
  { id: 'a02', at: 14.15, who: 'friendB', text: "And Nerd's still in the classic skin! Ha!", style: 'a cheeky 11-year-old girl teasing, laughing' },
  { id: 'a03', at: 16.55, who: 'nerd', text: 'I want them too…', style: 'an 11-year-old boy, small and sad, to himself' },
  { id: 'a04', at: 21.45, who: 'mom', text: "My password is… hmm-hmm. Remember it, okay?", sub: 'My password is… (she tells him). Remember it, okay?', style: 'a busy mother rushing out of the door, quick and warm' },
  { id: 'a05', at: 23.2, who: 'mom', text: "Download your games yourself. Mommy's busy!", style: 'hurried, cheerful, already leaving' },
  { id: 'a06', at: 27.3, who: 'mom', text: 'Free games only.', style: 'firm but kind, pointing a finger' },
  { id: 'a07', at: 28.55, who: 'mom', text: "Don't buy anything!", style: 'firm, clear, a warning' },
  { id: 'a08', at: 30.2, who: 'nerd', text: 'Okay, Mom! Promise!', style: 'an eager 11-year-old boy, nodding hard, sincere' },
  // ---- Act 2 ----
  { id: 'b01', at: 38.3, who: 'admin', text: "Hi! I'm the admin of this server. You play really well!", style: 'a friendly young man, warm and smooth, a bit too nice' },
  { id: 'b02', at: 40.85, who: 'nerd', text: 'Whoa… thanks!', style: 'an 11-year-old boy, shy and flattered' },
  { id: 'b03', at: 43.1, who: 'think', text: 'Why would an admin message me?', style: 'an 11-year-old boy thinking to himself, quiet and doubtful, close to the mic' },
  { id: 'b04', at: 49.0, who: 'nerd', text: 'He has a check mark. He must be real!', style: 'an 11-year-old boy, convinced and excited' },
  { id: 'b05', at: 52.15, who: 'nerd', text: 'GG, bro! Thanks for the help!', style: 'an 11-year-old boy, happy, gaming slang' },
  { id: 'b06', at: 52.9, who: 'admin', text: 'Anytime. So… where do you live?', style: 'friendly young man, casual, slipping in a personal question' },
  { id: 'b07', at: 56.1, who: 'admin', text: 'Whose tablet is that?', style: 'friendly, casual, curious' },
  { id: 'b08', at: 57.25, who: 'nerd', text: "My mom's.", style: 'an 11-year-old boy, offhand' },
  { id: 'b09', at: 58.3, who: 'nerd', text: "I really want the dragon wings… but Mom won't buy them.", style: 'an 11-year-old boy typing and saying it at the same time, a little sad' },
  { id: 'b10', at: 63.25, who: 'admin', text: 'I have a special gift for top players. Just for you.', style: 'warm, generous, a little secretive' },
  { id: 'b11', at: 65.3, who: 'admin', text: "But don't tell anyone, okay?", style: 'lowered voice, secretive, still friendly' },
  { id: 'b12', at: 66.75, who: 'nerd', text: 'Yes! Yes! Yes!', style: 'an 11-year-old boy bouncing on his bed, overjoyed' },
  { id: 'b13', at: 69.6, who: 'think', text: "But… why can't I tell Mom?", style: 'an 11-year-old boy thinking, uneasy, quiet' },
  { id: 'b14', at: 73.5, who: 'admin', text: 'The gift expires tonight! Hurry, or it goes to someone else.', style: 'urgent, pushing, but still smiling' },
  { id: 'b15', at: 78.6, who: 'nerd', text: "I'll tell Mom after I get it.", style: 'an 11-year-old boy talking himself into it' },
  // ---- Act 3 ----
  { id: 'c01', at: 82.2, who: 'admin', text: 'Tap this link and log in with the account on your tablet.', style: 'smooth, matter-of-fact, giving instructions' },
  { id: 'c02', at: 87.3, who: 'nerd', text: "Mom's account… the password she told me…", style: 'an 11-year-old boy concentrating, typing slowly, half whisper' },
  { id: 'c03', at: 92.3, who: 'admin', text: 'A six-digit code will pop up. Send it to me to confirm.', style: 'smooth, quick, as if it is routine' },
  { id: 'c04', at: 98.5, who: 'think', text: "Don't! It says don't share it!", style: 'an 11-year-old boy inner voice, alarmed, pleading' },
  { id: 'c05', at: 99.75, who: 'devil', text: 'Send it! The wings are almost yours!', style: 'an 11-year-old boy inner voice, sly and tempting, excited' },
  { id: 'c06', at: 102.3, who: 'nerd', text: 'Four… eight… two… nine… one… seven.', style: 'an 11-year-old boy reading digits while typing them, slowly' },
  { id: 'c07', at: 106.2, who: 'admin', text: 'Done! Your epic item arrives within twenty-four hours.', style: 'cheerful, satisfied, a little too fast' },
  // ---- Act 4 ----
  { id: 'd01', at: 118.4, who: 'bank', text: "Ma'am, we saw several Apple charges on your card last night.", style: 'a calm, professional bank call-centre agent, kind' },
  { id: 'd02', at: 121.2, who: 'bank', text: "We've frozen it to protect you.", style: 'calm, reassuring, professional' },
  { id: 'd03', at: 128.4, who: 'mom', text: 'Nerd… did you give anyone a code in the game?', style: 'a mother, quiet and gentle, not angry, holding back worry' },
  { id: 'd04', at: 132.3, who: 'nerd', text: 'He said he was a Robox admin… He played with me every day… like a big brother…', style: 'an 11-year-old boy crying, words breaking' },
];
// Voices (Gemini prebuilt voice names), one per character.
const VOICES = { vo: 'Charon', mom: 'Sulafat', nerd: 'Leda', think: 'Leda', devil: 'Puck', admin: 'Achird', friendA: 'Fenrir', friendB: 'Zephyr', bank: 'Erinome' };

// ---------- subtitles from the table (English, lower third) ----------
SUBCOL.think = '#FFFFFF'; SUBCOL.devil = '#FF9C8A'; SUBCOL.friendA = '#FFE07A'; SUBCOL.friendB = '#FFC1DE'; SUBCOL.bank = '#D8F0E0';
function lineLen(L) {
  if (typeof DIALOG !== 'undefined') { const d = DIALOG.find(r => r[3] === L.id); if (d) return d[2].length / 24; }
  return .55 + L.text.split(/\s+/).length * .33;   // estimate until the real audio exists
}
function scriptSubs(t) {
  const on = LINES.filter(L => t >= L.at - .1 && t <= L.at + lineLen(L) + .35);
  on.slice(-2).forEach((L, i, a) => {
    const lt = t - (L.at - .1), d = lineLen(L) + .45, y = H - 70 - (a.length - 1 - i) * 66;
    const s = (L.who === 'think' || L.who === 'devil') ? `(${L.sub || L.text})` : (L.sub || L.text);
    sub(lt, 0, d, s, L.who, { y, size: 46 });
  });
}
// Is someone speaking right now? null = no line of theirs is on; otherwise the mouth level 0..1 (needs dialog.js).
function speaking(who, t) {
  if (typeof SPEAK !== 'function') return null;
  const on = LINES.some(L => L.who === who && t >= L.at - .2 && t <= L.at + lineLen(L) + .1);
  return on ? SPEAK(who, t) : null;
}
if (typeof module !== 'undefined') module.exports = { LINES, VOICES };
