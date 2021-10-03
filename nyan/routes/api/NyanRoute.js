const express = require('express')

const router = express.Router()

router.post('/', (req, res) => {
  const { message } = req.body
  console.log(message)
  res.status(201)
  res.send()
})

module.exports = router
