const Url = require('../models/urlshortener.model')
const nanoid = require('nanoid')
const logger = require('../../logger').createLogger({ fileName: __filename })
const httpContext = require('express-http-context')

exports.createUrlShortener = async (req, res) => {
  try {
    const { originalUrl, shortBaseUrl, sizeHash, ttl } = req
    const existUrl = await Url.findOne(
      {
        originalUrl: originalUrl
      },
      (err, url) => {
        if (err) {
          logger.error('No se pudo verificar si ya existe url original.', { opt: 'VALIDATION' })
          res.status(500).send({
            status: 'ERROR',
            errorMessage: 'UNKNOWN'
          })
        }
      }
    )

    // Comprobar si la url origina que se intenta recortar ya existe
    if (existUrl) {
      logger.info(`Ya ha sido recortada la Url: ${existUrl.originalUrl} `)
      return res.status(400).send({
        status: 'ERROR',
        errorMessage: 'URL_ALREADY_EXISTS'
      })
    }

    const baseUrlConext = httpContext.get('baseUrl')

    // Crear hash de shortUrl
    const urlCode = sizeHash != null ? nanoid.nanoid(sizeHash) : nanoid.nanoid(8)
    let shortUrl
    // Armar url recortada
    if (!shortBaseUrl) {
      shortUrl = baseUrlConext + '/' + urlCode
    } else {
      const lastChar = shortBaseUrl.slice(-1)
      shortUrl = lastChar === '/' ? shortBaseUrl + urlCode : shortBaseUrl + '/' + urlCode
    }
    // const shortUrl = !shortBaseUrl ? baseUrlConext + '/' + urlCode : shortBaseUrl + urlCode
    // Setea el tiempo de expiracion para sumarle a la fecha
    if (ttl !== undefined) {
      const timettl = ttl.slice(-1)
      var tiempo = ttl.slice(0, -1)
      if (timettl === 's') { tiempo = tiempo * 1000 }
      if (timettl === 'm') { tiempo = tiempo * 60000 }
      if (timettl === 'h') { tiempo = tiempo * 3600000 }
      if (timettl === 'd') { tiempo = tiempo * 86400000 }
    }

    const itemToBeSaved = { originalUrl, urlCode, shortUrl }

    // Crear url
    const url = new Url(itemToBeSaved)

    // le agrega el tiempo de expiracion al objeto sumando la fecha con el tiempo seteado
    if (ttl !== undefined) { url.expireAt = Date.now() + tiempo }

    // Agregar datos de url a la colección
    await url.save((err, urlRes) => {
      if (err) {
        logger.error('No se pudo guardar Url recortada', { opt: 'VALIDATION' })
        return res.status(400).send({
          status: 'ERROR',
          errorMessage: 'UNKNOWN'
        })
      }

      logger.info(
        'Resultado de url recortada',
        urlRes._doc
      )
      return res.status(200).json(urlRes)
    })
  } catch (e) {
    // Loggeo Errores
    logger.error('Fallo al guardar Url recortada', { opt: 'VALIDATION' })
    return res.status(400).send({
      status: 'ERROR',
      errorMessage: 'UNKNOWN'
    })
  }
}

exports.redirectTo = async (req, res) => {
  Url.findOne({ urlCode: req.params.urlCode })
    .then(URL => {
      if (!URL) {
        logger.info('No se encontro la Url corta')
        res.status(400).send({
          status: 'ERROR',
          errorMessage: 'INVALID_URL'
        })
        return
      }
      logger.info('Redireccionando a url original ', URL._doc)
      res.redirect(307, URL.originalUrl)
    }).catch((err) => {
      logger.error('Fallo la redireccion a url original', err)
      res.status(500).send({
        status: 'ERROR',
        errorMessage: 'UNKNOWN'
      })
    })
}
