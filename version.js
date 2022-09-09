const child_process = require('child_process')
const fs = require('fs')

const execCommand = async (command) =>
  await new Promise((resolve) => {
    let ret = ''
    const child = child_process.spawn(command, [], { shell: true })
    child.stdout.setEncoding('utf8')
    child.stdout.on('data', (data) => (ret += data.toString()))
    child.stderr.setEncoding('utf8')
    child.stderr.on('data', (data) => (ret += data.toString()))
    child.on('close', (code) => resolve(ret))
  })

const upgradeVersion = async () => {
  const parseVersion = (version) => {
    const match = version.match(/^([0-9].*)\.([0-9].*)\.([0-9].*)$/s)
    const major = parseInt(match[1])
    const minor = parseInt(match[2])
    const hotfix = parseInt(match[3])
    return { major, minor, hotfix }
  }
  const packageJson = require('./package.json')
  const result = await execCommand(`npm show ${packageJson.name} version`)
  const remoteVersion = parseVersion(
    result
      .split('\n')
      .filter((r) => r.trim())
      .at(-1)
  )
  const currentVersion = parseVersion(packageJson.version)
  const newVersion =
    currentVersion.major > remoteVersion.major ||
    currentVersion.minor > remoteVersion.minor
      ? `${currentVersion.major}.${currentVersion.minor}.${currentVersion.hotfix}`
      : `${remoteVersion.major}.${remoteVersion.minor}.${
          remoteVersion.hotfix + 1
        }`
  packageJson.version = newVersion
  return packageJson
}

upgradeVersion().then((pkg) => {
  fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2), 'utf8')
})
