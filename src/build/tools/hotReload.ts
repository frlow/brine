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
  return (urls: string[]) => {
    for (const url of urls) {
      connections.forEach((ws) => ws.send(url))
    }
  }
}
