'use strict'
const express = require('express')
const router = express.Router()
const urlShortenerRoutes = require('./urlshortener.routes')

// Url routes
router.use('/', urlShortenerRoutes)

module.exports = router
