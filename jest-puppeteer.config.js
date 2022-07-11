const debug = false

module.exports = {
  launch: {
    headless: !debug,
    devtools: debug,
  },
}
