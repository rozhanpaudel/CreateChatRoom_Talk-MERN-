var express = require('express');
var router = express.Router();
const { check, validationResult } = require('express-validator/check');
const bcrypt = require('bcryptjs');
var multer = require('multer');
const jwt = require('jsonwebtoken');
var cloudinary = require('cloudinary');
const { jwtSecret } = require('../configs/secrets');

const userModel = require('../models/userModel');
const myStorage = require('../configs/multerSetup');

require('dotenv').config();

// CLoudinary Config
require('../configs/cloudinary');

// Multer Storage Setup
var upload = multer({
  storage: myStorage,
});

router.get('/', function (req, res, next) {
  res.send('User/ route');
});

//Register Users

router.post('/register', upload.single('img'), function (req, res, next) {
  userModel.findOne({ email: req.body.email }).exec(function (err, done) {
    if (err) console.log(err);
    if (done)
      return res.json({
        msg: 'User already exists',
      });
    else {
      //encrypting the password
      var password1;
      const salt = bcrypt.genSalt(10);
      salt.then((salty) => {
        const hashedPW = bcrypt.hash(req.body.password, salty);

        hashedPW.then((password) => {
          //uploading image file to cloudinary
          const result = cloudinary.v2.uploader.upload(req.file.path);
          result.then((success) => {
            //Creating a new User
            const newUser = new userModel({
              name: req.body.name,
              email: req.body.email,
              qualification: req.body.qualification,
              dob: req.body.dob,
              password: password,
              role: req.body.role,
              img: success.url,
              cloudinary_img_id: success.public_id,
            });

            //Split number by comma and add it to new User

            var numbers = req.body.contact_number.split(',');
            numbers.forEach((number) => {
              newUser.contact_number.push(number);
            });

            //saving the user
            newUser.save(function (error, user) {
              if (error) return res.json({ msg: 'Server Error', error: error });
              else {
                res.json({
                  msg: 'Registered !',
                  data: user,
                });
              }
            });
          });
          result.catch((error) => {
            console.log(error);
          });
        });
      });
    }
  });
});

//LOGIN ROUTE
router.post('/login', function (req, res, next) {
  //finding the user
  userModel.findOne({ email: req.body.email }).exec(function (error, user) {
    if (error) return res.json({ msg: 'Server Error' });
    if (!user) return res.json({ msg: 'Invalid Credentials' });

    const isMatch = bcrypt.compare(req.body.password, user.password, function (
      error,
      done
    ) {
      if (error) next(error);
      if (done == true) {
        const payload = {
          user: {
            id: user._id,
          },
        };

        jwt.sign(payload, jwtSecret, { expiresIn: 36000 }, function (
          error,
          token
        ) {
          if (error) next(error);
          else res.json({ token: token, user: user._id });
        });
      } else {
        res.status(401).json({
          msg: 'Invalid Credentials',
        });
      }
    });
  });
});

module.exports = router;
