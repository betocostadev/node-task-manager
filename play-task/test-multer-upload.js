// multer example
// It will work only on index.js, since it's using the routes with express.
const multer = require('multer')
// upload object with its options. Should be one for each kind of file like pdf, jpeg, etc.
const upload = multer({
  dest: 'images',
  limits: {
    fileSize: 1000000 // file size in bytes. 1000000 = 1Mb
  },
  fileFilter(req, file, cb) { // Filters by file type
    // To look for a single file, use endsWith, for multiple, use match for Regex
    if (!file.originalname.match(/\.(doc|docx)$/)) {
      return cb(new Error('Please upload a Word document (.doc or .docx)'))
    }
    cb(undefined, true) // Ok the file was uploaded
  }
})

app.post('/upload', upload.single('upload'), (req, res) => {
  res.send()
}, (error, req, res, next) => { // a cb function to handle the errors
  res.status(400).send({ error: error.message})
})