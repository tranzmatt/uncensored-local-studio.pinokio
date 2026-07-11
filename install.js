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
      method: "shell.run",
      params: {
        path: "app",
        message: "{{platform === 'win32' ? 'echo.| powershell -NoProfile -ExecutionPolicy Bypass -File scripts/setup/setup.ps1' : 'bash scripts/setup/setup.sh'}}"
      }
    }
  ]
}
