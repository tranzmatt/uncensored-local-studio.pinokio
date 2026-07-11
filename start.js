module.exports = {
  daemon: true,
  run: [
    {
      method: "local.set",
      params: {
        port: "{{port}}"
      }
    },
    {
      method: "shell.run",
      params: {
        env: {
          FRONTEND_PORT: "{{local.port}}"
        },
        path: "app",
        message: "{{platform === 'win32' ? path.join('app', 'tools', 'node-win', 'node.exe') : platform === 'darwin' ? './app/tools/node-mac/bin/node' : './app/tools/node-linux/bin/node'}} scripts/server/serve.cjs",
        on: [{
          event: "/backend.*ready/i",
          done: true
        }]
      }
    },
    {
      method: "local.set",
      params: {
        url: "http://localhost:{{local.port}}"
      }
    }
  ]
}
