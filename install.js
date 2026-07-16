module.exports = {
  requires: {
    bundle: "ai"
  },
  run: [
    {
      when: "{{!exists('app')}}",
      method: "shell.run",
      params: {
        message: "git clone https://github.com/techjarves/Uncensored-Local-Studio.git app"
      }
    },
    {
      // onnxruntime-node's postinstall CUDA-version probe (script/install.js) only
      // recognizes CUDA 11/12 and crashes (ECONNREFUSED 127.0.0.1:443) if the default
      // `nvcc` on PATH reports anything else (e.g. CUDA 13). Rather than assuming no
      // usable toolkit exists, look for a sibling CUDA 11/12 install at the standard
      // NVIDIA installer location (/usr/local/cuda-11*, /usr/local/cuda-12*) and use
      // that one's bin dir just for this step. Only Linux/x64 is affected (see
      // onnxruntime-node's IS_LINUX_X64 gate), so this is a no-op elsewhere.
      when: "{{platform === 'linux' && arch === 'x64'}}",
      method: "shell.run",
      params: {
        message: "nvcc_ver=\"\"; if command -v nvcc >/dev/null 2>&1; then nvcc_ver=$(nvcc --version 2>/dev/null | grep -oE 'release [0-9]+' | grep -oE '[0-9]+'); fi; if [ \"$nvcc_ver\" = \"11\" ] || [ \"$nvcc_ver\" = \"12\" ]; then echo CUDA_BIN_OVERRIDE=__default__; else found=\"\"; for d in /usr/local/cuda-12* /usr/local/cuda-11*; do if [ -x \"$d/bin/nvcc\" ]; then found=\"$d/bin\"; break; fi; done; if [ -n \"$found\" ]; then echo \"CUDA_BIN_OVERRIDE=$found\"; else echo CUDA_BIN_OVERRIDE=__skip__; fi; fi",
        on: [{
          // Require a trailing newline so this only matches the real `echo` output
          // line, not the PTY's echo of the command's own source text (which contains
          // the same literal "CUDA_BIN_OVERRIDE=..." substring followed by ";"/" else").
          event: "/CUDA_BIN_OVERRIDE=(\\S+)[\\r\\n]/",
          done: true
        }]
      }
    },
    {
      method: "local.set",
      params: {
        cudaBinOverride: "{{input.event ? input.event[1] : '__default__'}}"
      }
    },
    {
      method: "shell.run",
      params: {
        path: "app",
        env: {
          // Prepend a compatible CUDA's bin dir so onnxruntime-node's own nvcc probe
          // finds it; only skip the CUDA EP download outright if nothing compatible
          // was found at all. Kokoro TTS still runs fine on the CPU provider either way.
          PATH: "{{local.cudaBinOverride && local.cudaBinOverride !== '__default__' && local.cudaBinOverride !== '__skip__' ? local.cudaBinOverride + ':' + envs.PATH : envs.PATH}}",
          ONNXRUNTIME_NODE_INSTALL_CUDA: "{{local.cudaBinOverride === '__skip__' ? 'skip' : ''}}"
        },
        message: "{{platform === 'win32' ? 'echo.| powershell -NoProfile -ExecutionPolicy Bypass -File scripts/setup/setup.ps1' : 'bash scripts/setup/setup.sh'}}"
      }
    }
  ]
}
