const express = require('express')
const session = require('express-session')
const bodyParser = require('body-parser')
const path = require('path')
const AuthenticateUsecase = require('./usecase/AuthenticateUsecase')
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

app.use(async (req, res, next) => {
  const userId = req.session.loggedInUserId
  if (userId) {
    const user = await AuthenticateUsecase.execute({ userId })
    req.authenticatedUser = user
  }
  next()
})

app.use('/login', require('./routes/LoginRoute'))
app.use('/logout', require('./routes/LogoutRoute'))
app.use('/clients', require('./routes/ClientRoute'))
app.use('/oauth2', require('./routes/OAuth2Route'))
app.use('/', require('./routes/IndexRoute'))

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`)
})
