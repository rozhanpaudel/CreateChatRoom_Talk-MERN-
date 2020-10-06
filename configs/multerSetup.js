const multer = require('multer');

module.exports = myStorage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, Date.now() + '--' + file.originalname);
  },
});
