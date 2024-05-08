module.exports = {
  info: console.log,
  error: data => {
    Error.captureStackTrace(data)
    console.error(data)
  },
  fatal: data => {
    Error.captureStackTrace(data)
    console.error(data)
    setTimeout(() => {
      process.exit(-1)
    }, 1000)
  }
}
