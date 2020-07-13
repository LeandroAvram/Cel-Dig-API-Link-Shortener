const uuidv4 = require('uuid').v4
const expressHttpContext = require('express-http-context')

// agrego el middleware de contexto a express
exports.init = (app) => app.use(expressHttpContext.middleware)
exports.get = expressHttpContext.get
exports.set = expressHttpContext.set

// seteo los parametros al contexto
exports.createMiddleware =
  ({ context } = { context: ['trackId', 'remoteIp', 'url', 'params'] }) => {

    return (req, res, next) => {
      // seteo un trackID nuevo por cada request
      if (context.includes('trackId')) {
        expressHttpContext.set('trackId', uuidv4())
      }

      // Seteo la IP real del cliente
      if (context.includes('remoteIp')) {
        const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress
        expressHttpContext.set('remoteIp', ipAddress)
      }

      // Seteo la URI del recurso consumido
      if (context.includes('url')) {
        expressHttpContext.set('url', req.protocol + '://' + req.get('host') + req.originalUrl)
      }

      // Seteo los parametros del query string y del path.
      // elimino el parametro de cardNumber del contexto
      if (context.includes('params')) {
        expressHttpContext.set('params', Object.assign({}, req.params, req.query, { cardNumber: undefined }))
      }

      next()
    }
  }