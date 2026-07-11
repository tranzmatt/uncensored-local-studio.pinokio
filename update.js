module.exports = {
  requires: {
    bundle: "ai"
  },
  run: [
    {
      method: "shell.run",
      params: {
        message: "git pull --ff-only"
      }
    },
    {
      method: "shell.run",
      params: {
        path: "app",
        message: "git pull --ff-only"
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
