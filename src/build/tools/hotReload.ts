import type { WebSocket } from 'ws'

export const startHotComponentTransplantServer = (port: number = 8080) => {
  const connections: WebSocket[] = []
  const startServer = async () => {
    const { WebSocketServer } = await import('ws')
    const wss = new WebSocketServer({ port: 8080 })

    wss.on('connection', function connection(ws) {
      connections.push(ws)
      ws.on('close', function close() {
        connections.splice(connections.indexOf(ws, 1))
      })
    })
  }
  startServer().then()
  let lastBuild: string[] = []
  return (paths: string[]) => {
    for (const url of paths
      .filter((path) => path.endsWith('.js'))
      .filter((url) => !lastBuild.includes(url))) {
      connections.forEach((ws) => ws.send(url))
    }
    lastBuild = paths
  }
}
