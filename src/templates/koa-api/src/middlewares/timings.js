function duration() {
  if (arguments.length === 0) {
    throw new Error('Next callback argument missing!')
  }
  const start = new Date()
  await arguments[0]()
  return new Date() - start
}

function ServerTiming() { }

ServerTiming.serverLog = async (ctx, next) => {
  const d = duration(next)
  console.log(`API responded in ${d}ms`)
}

ServerTiming.httpHeader = async (ctx, next) => {
  const d = duration(next)
  ctx.set('X-Response-Time', `${d}ms`)
}

module.exports = ServerTiming
