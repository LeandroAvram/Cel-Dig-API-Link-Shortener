const express = require('express')
const router = express.Router()
const urlShortenerController = require('../controllers/urlshortener.controller')
const contextMiddleware = require('../middleware/context.middleware')

router.post('/api/createUrl', [contextMiddleware], urlShortenerController.createUrlShortener)
router.get('/:urlCode', [contextMiddleware], urlShortenerController.redirectShortLink)

module.exports = router
