const express = require('express')
require('dotenv').config()
const bodyParser = require('body-parser')

const path = require('path')
const { connection } = require('./db')
const { homeController } = require('./controllers/homeController')
const { sendController } = require('./controllers/sendController')

const app = express()

app.use(bodyParser.urlencoded({ extended: false }))

app.get('/', async (req, res) => {
  homeController(res)
})

app.get('/send', async (req, res) => {
  sendController(res, req)
})

const port = process.env.PORT || 4000

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '/public'))
app.use(express.static(__dirname + '/public'))

app.listen(port, async () => {
  await connection()
  console.log('Listening on port - ', port)
})
