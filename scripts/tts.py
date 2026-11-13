"""tts.py: makes every spoken line in ONE batch with Gemini TTS (English voices, one prebuilt voice per character).

usage:  node scripts/lines.mjs && python3 -I scripts/tts.py out/voice/lines.json out/voice/raw
Writes out/voice/raw/<id>.wav for each line and skips lines whose file already exists (so a rerun only fills gaps;
delete a file to redo that line). Lines run 4 at a time.

Auth, either:
  * Gemini API (simplest): an API key from Google AI Studio. Inside this cloud session the key is stored as a network
    secret for generativelanguage.googleapis.com and added to each request by the proxy, so nothing secret is in here.
    On your own machine: export GEMINI_API_KEY=...
  * Vertex AI: set GCP_PROJECT and be logged in with `gcloud auth login` (uses gcloud for a token).
Model: $TTS_MODEL, a comma list tried in order (default below); when one model's quota is used up (HTTP 429 with a
per-day limit, as on the free tier) the batch moves on to the next model. The same prebuilt voices exist in all of them.
"""
import json, os, sys, base64, subprocess, urllib.request, urllib.error
from concurrent.futures import ThreadPoolExecutor

lines = json.load(open(sys.argv[1]))
outdir = sys.argv[2]
os.makedirs(outdir, exist_ok=True)
MODELS = os.environ.get("TTS_MODEL", "gemini-3.8-flash-tts,gemini-3.8-flash-lite-tts,gemini-3.1-flash-tts-preview,gemini-2.5-flash-preview-tts,gemini-2.5-pro-preview-tts").split(",")
import threading
DEAD, LOCK = set(), threading.Lock()
PROJECT = os.environ.get("GCP_PROJECT")
if PROJECT:
    tok = subprocess.check_output(["gcloud", "auth", "print-access-token"]).decode().strip()
    URLF = lambda m: f"https://aiplatform.googleapis.com/v1/projects/{PROJECT}/locations/global/publishers/google/models/{m}:generateContent"
    HDR = {"Authorization": "Bearer " + tok, "x-goog-user-project": PROJECT}
else:
    URLF = lambda m: f"https://generativelanguage.googleapis.com/v1beta/models/{m}:generateContent"
    HDR = {"x-goog-api-key": os.environ.get("GEMINI_API_KEY", "set-by-proxy")}
FILM = "a short animated film for students about an online game scam; English, natural, clearly spoken"

def one(key, ln):
    out = f"{outdir}/{key}.wav"
    if os.path.exists(out):
        return f"skip {key} (exists)"
    prompt = f"Say this as {ln['style']} ({FILM}):\n{ln['text']}"
    gen_cfg = {"responseModalities": ["AUDIO"], "speechConfig": {"voiceConfig": {"prebuiltVoiceConfig": {"voiceName": ln["voice"]}}}}
    body = {"contents": [{"role": "user", "parts": [{"text": prompt}]}],
            "generationConfig": {"responseModalities": ["AUDIO"],
                                 "speechConfig": {"voiceConfig": {"prebuiltVoiceConfig": {"voiceName": ln["voice"]}}}}}
    r = None
    for model in MODELS:
        if model in DEAD: continue
        b = body if not model.startswith("gemini-3.8") else {"contents": [{"role": "user", "parts": [{"text": ln["text"], "speechMetadata": {"style": ln["style"]}}]}], "generationConfig": gen_cfg}
        req = urllib.request.Request(URLF(model), json.dumps(b).encode(), {**HDR, "Content-Type": "application/json"})
        for attempt in range(3):
            try:
                r = json.load(urllib.request.urlopen(req, timeout=120)); break
            except urllib.error.HTTPError as e:
                msg = e.read().decode()
                if e.code == 429 and "PerDay" in msg:
                    with LOCK: DEAD.add(model)
                    break
                if e.code in (429, 500, 503) and attempt < 2:
                    import time; time.sleep(8 * (attempt + 1)); continue
                return f"FAIL {key} HTTP {e.code} ({model}): {msg[:200]}"
        if r: break
    if not r:
        return f"FAIL {key}: every model's daily quota is used up"
    used = model
    d = r["candidates"][0]["content"]["parts"][0]["inlineData"]
    data = base64.b64decode(d["data"])
    if "wav" in d.get("mimeType", ""):
        open(out, "xb").write(data)
    else:   # raw 16-bit PCM, 24 kHz mono (audio/L16;rate=24000): wrap it as a wav
        p = subprocess.run(["ffmpeg", "-loglevel", "error", "-f", "s16le", "-ar", "24000", "-ac", "1", "-i", "-", out], input=data)
        if p.returncode: return f"FAIL {key}: ffmpeg could not wrap {d.get('mimeType')}"
    return f"wrote {out} ({used})"

with ThreadPoolExecutor(4) as ex:
    res = list(ex.map(lambda kv: one(*kv), lines.items()))
for r in res: print(r)
fails = [r for r in res if r.startswith("FAIL")]
print(f"{len(res) - len(fails)}/{len(res)} lines ready" + (f", {len(fails)} failed (rerun to retry)" if fails else ""))
sys.exit(1 if fails else 0)
