const express = require('express')
const routes = require('./routes')
const bodyParser = require('body-parser')
const packageInfo = require('../package.json')
const httpContext = require('@core/http-context')
const logger = require('../logger').createLogger({ fileName: __filename })
const app = express()

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type')
  next()
})

// parse requests of content-type - application/json
app.use(bodyParser.json())

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.json())

// Inicializar el middleware de contexto
httpContext.init(app)

app.use('/', routes)

const port = process.env.PORT || 3000
app.listen(port, () => {
  logger.info(`Aplicación ${packageInfo.name} inicializada en el  puerto ${port}`, {
    type: 'inicio_aplicacion',
    applicationName: packageInfo.name,
    version: packageInfo.version,
    port
  })
  // console.log(`El servidor está inicializado en el puerto ${port}`)
})

module.exports = app
