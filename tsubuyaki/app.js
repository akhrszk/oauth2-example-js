const express = require('express')
const session = require('express-session')
const bodyParser = require('body-parser')
const path = require('path')
const { PORT, SESSION_SECRET } = require('./common/Constants')

const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false
  })
)

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use('/login', require('./routes/LoginRoute'))
app.use('/logout', require('./routes/LogoutRoute'))
app.use('/signup', require('./routes/SignupRoute'))
app.use('/status', require('./routes/StatusRoute'))
app.use('/api/status', require('./routes/api/StatusRoute'))
app.use('/', require('./routes/IndexRoute'))

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`)
})
