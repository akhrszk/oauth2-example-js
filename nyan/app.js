const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const { PORT } = require('./common/Constants')

const app = express()

app.use(bodyParser.urlencoded({ extended: false }))

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use('/', require('./routes/IndexRoute'))

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`)
})
