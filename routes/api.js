const express = require('express')
const router = express.Router()
const fs = require('fs')

const File = require('../models/file');
const verifyToken = require('../middlewares/verifyToken')
router.get('/', (req, res) => {
  res.send('Server is live!')
})

router.get('/f/:uri', (req, res) => {
  const path = req.params.uri
  res.download('./bucket/f/' + path, (err) => {
    res.send('File not found.')
  })
})

router.get('/p/:uri', (req, res) => {
  const path = req.params.uri
  res.download('./bucket/p/' + path, (err) => {
    res.send('File not found.')
  })
})

router.get('/uploads', verifyToken, (req, res) => {
  File.find({ userId: req.userId }).then((uploads) => {
    console.log(uploads);
    res.send(uploads)
  })
});

router.post('/upload', (req, res) => {
  const file = req.files.file
  // save to bucket
  const fileName = `${Date.now()}-${file.name}`
  fs.writeFile('./bucket/f/' + fileName, file.data, function (err) {
    if (err) {
      console.log(err)
      res.status(400).json({ msg: 'Error while uploading file' })
    } else {
      const freeBucketUri = '/f'
      const link = 'http://' + req.get('host').concat(freeBucketUri + '/' + fileName)
      console.log('link', link)
      res.status(200).json({ link })
    }
  })
})

router.post('/upload-premium/', verifyToken, (req, res) => {
  const file = req.files.file
  // save to bucket
  const fileName = `${Date.now()}-${file.name}`
  fs.writeFile('./bucket/p/' + fileName, file.data, function (err) {
    if (err) {
      console.log(err)
      res.status(400).json({ msg: 'Error while uploading file' })
    } else {
      const bucketUri = '/p'
      const link = 'http://' + req.get('host').concat(bucketUri + '/' + fileName)
      console.log('link', link)
      if (req.userId) {
        const file = new File({ name: fileName, userId: req.userId, link })
        file.save();
        res.status(200).json({ link })
      }
    }
  })
})


module.exports = router
