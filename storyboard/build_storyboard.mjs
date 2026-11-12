import { writeFileSync } from 'node:fs';
import { META, ACTS, NARRATION, NOTES } from './storyboard.data.mjs';
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const SPK = { 'กันต์': 'kan', 'แม่': 'mom', 'นางฟ้า': 'angel', 'ซาตาน': 'devil', 'ผู้เล่นอื่น': 'game', 'เกม': 'game', 'ผู้บรรยาย': 'vo' };
const cls = who => SPK[Object.keys(SPK).find(k => who.startsWith(k))] || 'sfx';

// ---------- STORYBOARD.md ----------
let n = 0, md = `# STORYBOARD: "${META.title}" (${META.kind})\n\n## นิทาน (ทั้งเรื่อง)\n${ACTS.flatMap(a=>a.rows).map((r,i)=>`(${i+1}) ${r[5]}`).join(' ')}\n\n**Logline.** ${META.logline}\n\n**Cast.**\n`;
md += META.cast.map(([a, b, c]) => `- **${a}**: ${b}. การแสดง: ${c}`).join('\n');
md += `\n\n**Props carry the story.**\n${META.props.map(p => '- ' + p).join('\n')}\n\n**World.** ${META.world}\n\n**Subtitles.** ${META.subs}\n`;
for (const a of ACTS) {
  md += `\n## ${a.name} · ${a.span}\n| # | นิทาน | t | ใคร | บทพูด/เสียง | ช็อต | การแสดง |\n|---|---|---|---|---|---|---|\n`;
  md += a.rows.map(r => `| ${++n} | ${[r[5], ...r.slice(0,5)].map(c => c.replace(/\|/g, '\\|')).join(' | ')} |`).join('\n') + '\n';
}
md += `\n\n## หมายเหตุ / สิ่งที่ปรับจากบรีฟ\n` + NOTES.map(([a, b]) => `- **${a}**: ${b}`).join('\n') + '\n';
writeFileSync('STORYBOARD.md', md);

// ---------- storyboard.html ----------
n = 0;
const acts = ACTS.map(a => `
<section class="act" id="${a.id}">
  <header class="acthead"><h2>${esc(a.name)}</h2><span class="span">${a.span}</span><span class="count">${a.rows.length} ประโยค</span></header>
  <div class="rows">
  ${a.rows.map(([t, who, line, shot, act, tale]) => `<article class="row" id="s${n+1}">
    <p class="tl">${esc(tale)}</p>
    <div class="meta"><span class="num">${++n}</span><span class="t">${t}</span></div>
    <div class="say"><span class="who ${cls(who)}">${esc(who)}</span><p class="line">${esc(line)}</p></div>
    <div class="shot"><span class="lab">ช็อต</span>${esc(shot)}</div>
    <div class="acting"><span class="lab">การแสดง</span>${esc(act)}</div>
  </article>`).join('\n  ')}
  </div>
</section>`).join('\n');

const html = `<title>${esc(META.title)}</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Mitr:wght@400;600&family=Sarabun:wght@400;600&family=JetBrains+Mono:wght@500&display=swap">
<style>
/* layout: a script-supervisor's binder — one strip per sentence, act tabs down the page, timecode always leftmost */
:root{
  --paper:#f6f3ee; --sheet:#fffdf9; --ink:#24222b; --muted:#6d6878; --rule:#e2ddd5;
  --screen:#2f6fd6; --kan:#2f6fd6; --mom:#a8663a; --angel:#7b8794; --devil:#b8402c; --game:#b98a00; --vo:#5c4d9e;
  --display:'Mitr',system-ui,sans-serif; --body:'Sarabun',system-ui,sans-serif; --mono:'JetBrains Mono',ui-monospace,monospace;
}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--paper:#17161c;--sheet:#201f27;--ink:#ebe8f0;--muted:#a19cad;--rule:#34323d;--screen:#6fa3ff;--kan:#6fa3ff;--mom:#e0a47a;--angel:#b5c0cc;--devil:#f07a63;--game:#e8c04a;--vo:#a99af0;color-scheme:dark}}
:root[data-theme="dark"]{--paper:#17161c;--sheet:#201f27;--ink:#ebe8f0;--muted:#a19cad;--rule:#34323d;--screen:#6fa3ff;--kan:#6fa3ff;--mom:#e0a47a;--angel:#b5c0cc;--devil:#f07a63;--game:#e8c04a;--vo:#a99af0;color-scheme:dark}
body{background:var(--paper);color:var(--ink);font:16px/1.65 var(--body);padding-left:max(16px,env(safe-area-inset-left,0px));padding-right:max(16px,env(safe-area-inset-right,0px));padding-block:28px 64px}
main{max-width:1080px;margin:0 auto;display:grid;gap:40px}
h1,h2,h3{font-family:var(--display);font-weight:600;text-wrap:balance;margin:0;line-height:1.3}
h1{font-size:clamp(28px,5vw,42px)}
.kind{color:var(--muted);margin:6px 0 0}
.bq{font:600 clamp(18px,2.6vw,22px)/1.5 var(--display);max-width:60ch;margin:18px 0 0;border-left:4px solid var(--vo);padding-left:14px}
.flow{list-style:none;padding:0;margin:16px 0 0;display:flex;flex-wrap:wrap;gap:6px}
.flow li{display:grid;border:1px solid var(--rule);background:var(--sheet);border-radius:6px;padding:6px 10px}
.flow b{font:600 12px var(--mono);letter-spacing:.04em}
.flow span{font:500 12px var(--mono);color:var(--muted)}
.tale p{margin:0;font-size:17px;line-height:1.9;max-width:75ch}
.tale a{color:inherit;text-decoration:none;border-radius:3px}
.tale a:hover,.tale a:focus-visible{background:var(--rule)}
.tale sup{font:600 10px var(--mono);color:var(--vo);margin-right:2px}
.tl{grid-column:1/-1;margin:0 0 2px;font:500 15px/1.6 var(--display);color:var(--vo);border-bottom:1px dashed var(--rule);padding-bottom:8px}
.logline{font-size:18px;max-width:68ch;margin:18px 0 0}
.runtime{display:flex;height:34px;border-radius:6px;overflow:hidden;margin-top:22px;font:500 12px var(--mono)}
.runtime a{display:flex;align-items:center;justify-content:center;color:#fff;text-decoration:none;min-width:0;overflow:hidden;white-space:nowrap;padding:0 4px}
.runtime a:focus-visible{outline:3px solid var(--ink);outline-offset:-3px}
.legend{display:flex;flex-wrap:wrap;gap:6px 16px;margin-top:10px;font-size:13px;color:var(--muted)}
.grid2{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:24px}
.box h3{font-size:18px;margin-bottom:10px}
.cast{display:grid;gap:12px}
.cast div{border-left:3px solid var(--rule);padding-left:12px}
.cast b{font-family:var(--display);font-weight:600}
.cast p{margin:2px 0 0;font-size:15px;color:var(--muted)}
ul.plain{margin:0;padding-left:20px;display:grid;gap:6px;font-size:15px}
.world{font-size:15px;color:var(--muted);margin:0}
.act{display:grid;gap:12px}
.acthead{display:flex;flex-wrap:wrap;align-items:baseline;gap:6px 14px;border-bottom:2px solid var(--ink);padding-bottom:8px;position:sticky;top:env(safe-area-inset-top,0px);background:var(--paper);z-index:2;padding-top:8px}
.acthead h2{font-size:22px}
.span,.count{font:500 13px var(--mono);color:var(--muted)}
.rows{display:grid;gap:10px}
.row{background:var(--sheet);border:1px solid var(--rule);border-radius:8px;padding:14px 16px;display:grid;grid-template-columns:92px minmax(0,1.15fr) minmax(0,.7fr) minmax(0,1.5fr);gap:14px;align-items:start}
.meta{display:grid;gap:2px}
.num{font:600 22px var(--display);line-height:1}
.t{font:500 12px var(--mono);color:var(--muted);font-variant-numeric:tabular-nums}
.who{display:inline-block;font:600 12px var(--display);letter-spacing:.02em;padding:1px 8px;border-radius:99px;border:1.5px solid currentColor;margin-bottom:4px}
.who.kan{color:var(--kan)}.who.mom{color:var(--mom)}.who.angel{color:var(--angel)}.who.devil{color:var(--devil)}.who.game{color:var(--game)}.who.vo{color:var(--vo)}.who.sfx{color:var(--muted)}
.line{margin:0;font-weight:600;font-size:16px}
.shot,.acting{font-size:15px;min-width:0}
.lab{display:block;font:500 11px var(--mono);letter-spacing:.08em;color:var(--muted);text-transform:uppercase}
table{border-collapse:collapse;width:100%;font-size:15px}
.tw{overflow-x:auto}
td,th{border-bottom:1px solid var(--rule);padding:10px 8px;text-align:left;vertical-align:top}
th{font:600 13px var(--display);color:var(--muted)}
td:first-child{font:500 12px var(--mono);white-space:nowrap;color:var(--muted)}
td:nth-child(2){font-family:var(--display);white-space:nowrap}
.notes{display:grid;gap:12px}
.notes div{background:var(--sheet);border:1px solid var(--rule);border-radius:8px;padding:12px 16px}
.notes b{font-family:var(--display)}
.notes p{margin:4px 0 0;font-size:15px}
@media (max-width:760px){.row{grid-template-columns:1fr;gap:8px}.meta{display:flex;gap:10px;align-items:baseline}.runtime a span{display:none}}
</style>
<main>
<header>
  <h1>${esc(META.title)}</h1>
  <p class="kind">${esc(META.kind)} · สตอรี่บอร์ดทีละประโยค (ยังไม่วาด) · ร่าง v4 (เฉพาะแอนิเมชัน)</p>
  <p class="logline">${esc(META.logline)}</p>
  <nav class="runtime" aria-label="ช่วงเวลา">${ACTS.map(a => `<a href="#${a.id}" style="flex:${a.len};background:${a.color}">${esc(a.name.split(":")[0].replace("คำถาม (Topic)","?"))}<span>&nbsp;0:${String(a.len).padStart(2,"0")}</span></a>`).join("")}</nav>
  <div class="legend"><span>คลิปแอนิเมชัน 2:30</span><span>${n} ประโยค = ${n} แถว</span></div>
</header>
<section class="box tale"><h3>นิทาน (ทั้งเรื่อง)</h3><p>${ACTS.flatMap(a=>a.rows).map((r,i)=>`<a href="#s${i+1}"><sup>${i+1}</sup>${esc(r[5])}</a>`).join(" ")}</p></section>
<div class="grid2">
  <section class="box"><h3>ตัวละคร</h3><div class="cast">${META.cast.map(([a, b, c]) => `<div><b>${esc(a)}</b><p>${esc(b)}</p><p>การแสดง: ${esc(c)}</p></div>`).join('')}</div></section>
  <section class="box"><h3>ของที่ผูกเรื่องข้ามองก์</h3><ul class="plain">${META.props.map(p => `<li>${esc(p)}</li>`).join('')}</ul>
  <h3 style="margin-top:22px">โลกและสี</h3><p class="world">${esc(META.world)}</p>
  <h3 style="margin-top:22px">ซับไตเติล</h3><p class="world">${esc(META.subs)}</p></section>
</div>
${acts}
<section class="act" id="notes">
  <header class="acthead"><h2>หมายเหตุและสิ่งที่ปรับจากบรีฟ</h2></header>
  <div class="notes">${NOTES.map(([a, b]) => `<div><b>${esc(a)}</b><p>${esc(b)}</p></div>`).join('')}</div>
</section>
</main>`;
writeFileSync('storyboard.html', html);
console.log('rows', n);
