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

  let paths: string[] = []
  return {
    name: 'hot-reload',
    setup(build) {
      build.onEnd(async (result) => {
        const jsFiles = result.outputFiles
          .filter((f) => f.path.endsWith('.js'))
          .filter((f) => !paths.includes(f.path))
        for (const jsFile of jsFiles) {
          const loadPath = jsFile.path.replace(basePath, '')
          connections.forEach((ws) => ws.send(loadPath))
        }
        paths = result.outputFiles.map((f) => f.path)
      })
    },
  }
}