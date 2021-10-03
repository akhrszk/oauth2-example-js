const express = require('express')
const TsubuyakiService = require('../service/TsubuyakiService')

const router = express.Router()

router.get('/callback', async (req, res) => {
  const { code, error } = req.query
  if (error) {
    res.send(error)
    return
  }
  const tsubuyakiService = TsubuyakiService.sharedInstance
  const data = await tsubuyakiService.getAccessToken(code)
  // TODO Sessionなどにaccess_tokenを保存
  console.log(data)
  res.redirect('/')
})

module.exports = router
