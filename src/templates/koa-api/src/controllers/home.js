function HomeController() { }

HomeController.index = async (ctx, next) => {
  try {
    ctx.body = 'Welcome to EcmaGen API!'
  } catch (e) {
    console.error(`Error handling / route: ${e}`)
    ctx.status = 500
  } finally {
    await next()
  }
}

module.exports = HomeController
