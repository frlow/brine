import type { WebSocket } from 'ws'

export const startWebSocketServer = (port: number = 8080) => {
  const connections: WebSocket[] = []
  const startServer = async () => {
    const { WebSocketServer } = await import('ws')
    const wss = new WebSocketServer({ port })

    wss.on('connection', function connection(ws) {
      connections.push(ws)
      ws.on('close', function close() {
        connections.splice(connections.indexOf(ws, 1))
      })
    })
  }
  startServer().then()
  return (command: string, msg: string) =>
    connections.forEach((c) => c.send(JSON.stringify({ command, msg })))
}
