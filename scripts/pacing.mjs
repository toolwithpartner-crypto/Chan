// pacing.mjs: the same story-time → film-time map the browser uses (src/pacing.js), for the audio scripts.
import fs from 'fs';
import { createRequire } from 'module';
const { makePacing } = createRequire(import.meta.url)('../src/pacing.js');
const starts = [];
for (const f of fs.readdirSync('src/scenes').filter(f => /^a0\d.*\.js$/.test(f))) {
  const m = fs.readFileSync('src/scenes/' + f, 'utf8').match(/shots\(\[(.*)\]\);/);
  for (const x of m[1].matchAll(/\[([\d.]+),/g)) starts.push(+x[1]);
}
export const PACING = makePacing(starts);
export const warp = PACING.warp, TOTAL = PACING.total;
