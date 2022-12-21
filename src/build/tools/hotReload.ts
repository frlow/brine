import type { WebSocket } from 'ws'
import fs from 'fs'

const hashFile = (path: string) => simpleHash(fs.readFileSync(path, 'utf8'))
const simpleHash = (str: string) => {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash &= hash // Convert to 32bit integer
  }
  return new Uint32Array([hash])[0].toString(36)
}

export const startHotComponentTransplantServer = ({
  port = 8080,
  basePath = process.cwd(),
  rootUrl = `ws://localhost:${port}`,
}: {
  port?: number
  basePath?: string
  rootUrl?: string
}) => {
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
  let lastBuild: { [path: string]: string } = {}
  return (paths: string[]) => {
    paths
      .filter((path) => path.endsWith('.js'))
      .filter((path) => lastBuild[path] !== hashFile(path))
      .map((path) => path.replace(basePath, rootUrl))
      .forEach((url) => connections.forEach((ws) => ws.send(url)))
    lastBuild = paths
      .filter((path) => path.endsWith('.js'))
      .reduce((acc, cur) => ({ ...acc, [cur]: hashFile(cur) }), {})
  }
}

export const hotReloadSnippet = (port: number = 8080) =>
  `new WebSocket('ws://localhost:${port}').onmessage = async (ev) => {import(ev.data+'?t='+Date.now())}`
