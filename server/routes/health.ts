export default defineEventHandler((event) => {
  let healthcheck: Record<string, unknown> = {
    message: 'OK',
  }

  try {
    healthcheck = {
      uptime: process.uptime(),
      responsetime: process.hrtime(),
      message: 'OK',
      timestamp: Date.now(),
    }
  }
  catch (error) {
    healthcheck.message = (error as Error).message
    event.node.res.statusCode = 503
  }

  return healthcheck
})
