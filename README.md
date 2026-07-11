# Uncensored Local Studio for Pinokio

This launcher installs and runs [Uncensored Local Studio](https://github.com/techjarves/Uncensored-Local-Studio), a private local interface for Stable Diffusion image generation, GGUF language models, Whisper speech-to-text, and Kokoro text-to-speech.

## Use

1. Click **Install**. The first setup downloads the platform runtimes and builds the web interface; model weights are not downloaded automatically.
2. Click **Start**. Pinokio assigns an available local port and opens the studio when it is ready.
3. Open **Model Manager** in the studio to download or import models.
4. Use **Update** to pull upstream changes and refresh the managed runtimes.
5. Use **Reset** to remove installed runtimes and dependencies. Image and text models, generated outputs, chat history, transcripts, and TTS data are preserved.

The upstream desktop support matrix is Windows x64, Linux x64 with glibc 2.38 or newer, and Apple Silicon macOS. Intel macOS is not supported upstream.

## Local API

The launcher uses a dynamic port. While the app is running, copy the base URL from **Open Web UI** or the startup terminal, for example `http://127.0.0.1:1420`.

Useful endpoints include:

- `GET /api/health` — service and runtime health
- `GET /api/models` — installed image models
- `POST /api/restart-backend` — load an image model and generation settings
- `POST /v1/images/generations` — generate an image after an image model is loaded
- `GET /api/outputs` — list saved generated images

The examples below assume an image model has already been selected and loaded in the web UI.

### JavaScript

```javascript
const baseUrl = "http://127.0.0.1:1420";
const response = await fetch(`${baseUrl}/v1/images/generations`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    prompt: "a cinematic mountain observatory at night",
    negative_prompt: "blurry, low quality",
    n: 1,
    size: "512x512",
    response_format: "b64_json",
    steps: 20,
    cfg_scale: 7,
    seed: -1,
    sample_method: "euler_a"
  })
});
const result = await response.json();
console.log(result.data[0].b64_json);
```

### Python

```python
import json
from urllib.request import Request, urlopen

base_url = "http://127.0.0.1:1420"
payload = json.dumps({
    "prompt": "a cinematic mountain observatory at night",
    "negative_prompt": "blurry, low quality",
    "n": 1,
    "size": "512x512",
    "response_format": "b64_json",
    "steps": 20,
    "cfg_scale": 7,
    "seed": -1,
    "sample_method": "euler_a",
}).encode()
request = Request(
    f"{base_url}/v1/images/generations",
    data=payload,
    headers={"Content-Type": "application/json"},
)
with urlopen(request) as response:
    result = json.load(response)
print(result["data"][0]["b64_json"])
```

### Curl

```bash
curl http://127.0.0.1:1420/v1/images/generations \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "a cinematic mountain observatory at night",
    "negative_prompt": "blurry, low quality",
    "n": 1,
    "size": "512x512",
    "response_format": "b64_json",
    "steps": 20,
    "cfg_scale": 7,
    "seed": -1,
    "sample_method": "euler_a"
  }'
```

Replace port `1420` in these examples with the actual port shown by Pinokio.
