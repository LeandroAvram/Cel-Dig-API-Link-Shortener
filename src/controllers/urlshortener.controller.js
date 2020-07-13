const validUrl = require('valid-url')
const logger = require('../../logger').createLogger({ fileName: __filename })
const urlShortenerService = require('../services/urlshortener.service')

exports.createUrlShortener = async (req, res) => {
  const { shortBaseUrl, originalUrl } = req.body

  // Url original es requrida
  if (!originalUrl) {
    logger.error('Parametro originalUrl es requerido.', { opt: 'VALIDATION' })
    return res.status(400).send({
      status: 'ERROR',
      errorMessage: 'INVALID_URL'
    })
  }

  // Verificar que el formato de la url original sea valido.
  if (!validUrl.isUri(originalUrl)) {
    logger.error('Parametro originalUrl no es una url valida.', { opt: 'VALIDATION' })
    return res.status(400).send({
      status: 'ERROR',
      errorMessage: 'INVALID_URL'
    })
  }
  // Verificar que el formato del dominio sea valido.
  if (shortBaseUrl && !validUrl.isUri(shortBaseUrl)) {
    logger.error('Parametro shortBaseUrl no es una url valida.', { opt: 'VALIDATION' })
    return res.status(400).send({
      status: 'ERROR',
      errorMessage: 'INVALID_BASE_URL'
    })
  }

  logger.debug('Invocacion al servicio de creación url shortener.', { opt: 'VALIDATION' })
  return await urlShortenerService.createUrlShortener(req.body, res)
}

exports.redirectShortLink = async (req, res) => {
  logger.debug('Invocacion al servicio redirect url original.', { opt: 'VALIDATION' })
  return await urlShortenerService.redirectTo(req, res)
}
