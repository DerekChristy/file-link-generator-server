const express = require('express')
const router = express.Router()
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

router.post('/new', (req, res) => {
  console.log(req.body)
  const user = new User(req.body)
  user.save().then(
    (doc) => {
      let payload = { subject: doc._id }
      let token = jwt.sign(payload, process.env.TOKEN_KEY)
      res.status(201).send({ status: true, token: token, user: doc })
    },
    (onrejected) => {
      console.log(onrejected)
      if (onrejected.name === 'MongoError' && onrejected.code === 11000) {
        if (Object.keys(onrejected.keyPattern)[0] === 'email')
          res.status(400).send({ type: 'email' })
        if (Object.keys(onrejected.keyPattern)[0] === 'phone')
          res.status(400).send({ type: 'phone' })
      }
    }
  )
})

router.post('/new-pass', (req, res) => {
  const newPass = req.body.passwd
  const token = req.body.token
  const payload = jwt.verify(token, process.env.TOKEN_KEY)
  if (!payload) res.status(401).json({ msg: 'invalid token' })
  const userId = payload.subject ? payload.subject : payload.subject.subject
  User.findById(userId, (err, doc) => {
    if (err) {
      console.log(err)
      res.status(401).json({ message: err })
    } else {
      doc.passwd = newPass
      doc.save().then((updatedDoc) => {
        if (updatedDoc) {
          console.log('updated', updatedDoc)
          res.status(200).json({ status: true })
        } else {
          res.status(400).json({ err: updatedDoc })
        }
      })
    }
  })
})
router.post('/login', (req, res) => {
  const userData = req.body
  User.findOne({ email: userData.email }).then(
    (user) => {
      if (!user) {
        res.status(401).send({ message: 'invalid' })
      } else {
        if (!bcrypt.compareSync(userData.passwd, user.passwd)) {
          res.status(401).send({ message: 'invalid' })
        } else {
          let payload = { subject: user._id }
          let token = jwt.sign({ payload }, process.env.TOKEN_KEY)

          if (userData.email == process.env.AEMAIL)
            res
              .status(200)
              .send({ token: token, user: user, status: true, isAdmin: true })
          else res.status(200).send({ token: token, user: user, status: true })
        }
      }
    },
    (error) => {
      console.log(err)
      res.status(500).send({ msg: 'Internal server error' })
    }
  )
})

module.exports = router
