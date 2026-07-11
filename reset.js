module.exports = {
  run: [
    {
      method: "shell.run",
      params: {
        path: "app",
        message: "{{platform === 'win32' ? 'echo.| powershell -NoProfile -ExecutionPolicy Bypass -File scripts/reset/reset.ps1' : \"printf '\\\\n' | bash scripts/reset/reset.sh\"}}"
      }
    }
  ]
}
