const helpers = require('../helpers')
const express = require('express')
const routerUI = express.Router()

let pass = ''
if (process.env.NODE_ENV === 'dev') {
  pass = process.env.PASS
}

routerUI.get('/', function rootHandler (req, res) {
  res.render('index', {
    key: process.env.GOOGLE_MAPS_API_KEY,
    pass: pass,
    scripts: helpers.mappings0,
    dependencies: helpers.mappings,
    messages: helpers.messages,
    lang: 'en'
  })
})

routerUI.get('/ar', function rootHandler (req, res) {
  res.render('index_ar', {
    key: process.env.GOOGLE_MAPS_API_KEY,
    pass: pass,
    scripts: helpers.mappings0,
    dependencies: helpers.mappings,
    messages: helpers.messages,
    lang: 'ar'
  })
})

routerUI.get('/fr', function rootHandler (req, res) {
  res.render('index_fr', {
    key: process.env.GOOGLE_MAPS_API_KEY,
    pass: pass,
    scripts: helpers.mappings0,
    dependencies: helpers.mappings,
    messages: helpers.messages,
    lang: 'fr'
  })
})

routerUI.get('/weather_map_view', function rootHandler(req, res) {
  res.render('weather_map_view', {
    key: process.env.GOOGLE_MAPS_API_KEY,
    pass: pass,
    scripts: helpers.mappings0,
    dependencies: helpers.mappings
  })
})

module.exports = routerUI