// mix.mjs: dialogue + music + sfx → out/audio/mix.wav (48 kHz stereo, -16 LUFS for online video).
// The music and sound effects duck under every spoken line (sidechain from the dialogue), then a two-pass loudness normalisation.
// Works without dialogue too (music + sfx only), so the soundtrack can be checked before the voices exist.
// usage: node scripts/mix.mjs
import fs from 'fs';
import { execFileSync, spawnSync } from 'child_process';
const hasD = fs.existsSync('out/audio/dialogue.wav') && !process.argv.includes('--no-dialogue');   // --no-dialogue: music + sfx only (a backing track for dubbing)
const inputs = ['-i', 'out/audio/music.wav', '-i', 'out/audio/sfx.wav', ...(hasD ? ['-i', 'out/audio/dialogue.wav'] : [])];
const graph = hasD
  ? '[0:a]volume=-15dB[m];[1:a]volume=-9dB[s];[m][s]amix=inputs=2:normalize=0[bg];[2:a]asplit=2[d][key];[bg][key]sidechaincompress=threshold=0.02:ratio=8:attack=20:release=400[md];[md][d]amix=inputs=2:normalize=0[mix]'
  : '[0:a]volume=-13dB[m];[1:a]volume=-9dB[s];[m][s]amix=inputs=2:normalize=0[mix]';
const run = (extra, out) => execFileSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', ...inputs, '-filter_complex', graph + extra, '-map', '[o]', ...out], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
// pass 1: measure
const m = spawnSync('ffmpeg', ['-hide_banner', '-y', ...inputs, '-filter_complex', graph + ';[mix]loudnorm=I=-16:TP=-1.5:LRA=11:print_format=json[o]', '-map', '[o]', '-f', 'null', '-'], { encoding: 'utf8' });
const log = m.stderr;
const j = JSON.parse(log.slice(log.lastIndexOf('{'), log.lastIndexOf('}') + 1));
// pass 2: apply
const OUT = hasD ? 'out/audio/mix.wav' : 'out/audio/mix_nodialogue.wav';
run(`;[mix]loudnorm=I=-16:TP=-1.5:LRA=11:measured_I=${j.input_i}:measured_TP=${j.input_tp}:measured_LRA=${j.input_lra}:measured_thresh=${j.input_thresh}:offset=${j.target_offset}:linear=true,aresample=48000[o]`, ['-c:a', 'pcm_s16le', OUT]);
console.log(`${OUT} (${hasD ? 'dialogue + ' : 'no dialogue yet: '}music + sfx), measured ${j.input_i} LUFS → -16`);
