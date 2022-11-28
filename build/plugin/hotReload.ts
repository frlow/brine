import { Plugin } from 'esbuild'
import { WebSocketServer } from 'ws'

export const hotReloadPlugin = (enable: boolean, basePath: string): Plugin => {
  if (!enable)
    return {
      name: 'none',
      setup() {},
    }
  const wss = new WebSocketServer({ port: 8080 })
  const connections: WebSocket[] = []
  wss.on('connection', function connection(ws) {
    connections.push(ws)
    ws.on('close', function close() {
      connections.splice(connections.indexOf(ws, 1))
    })
  })
  return {
    name: 'hot-reload',
    setup(build) {
      build.onEnd(async (result) => {
        connections.forEach((ws) => {
          const files = result.outputFiles
            .filter((f) => f.path.endsWith('.js'))
            .map((f) => f.path.replace(basePath, ''))
          files.forEach((f) => ws.send(f))
        })
      })
    },
  }
}
