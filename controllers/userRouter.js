var express = require('express');
var router = express.Router();
var userModel = require('../models/userModel');

//Get All users
router.get('/', function (req, res, next) {
  userModel.find().exec((err, users) => {
    if (err)
      return res.json({
        msg: 'Server Error',
      });
    else {
      return res.json({
        msg: 'User Fetched !',
        data: users,
      });
    }
  });
});

//modify user role to provide access
router.post('/acceptuser/:id', function (req, res, next) {
  var update = { role: 2 };
  //finding the user
  userModel
    .findByIdAndUpdate({ _id: req.params.id }, update)
    .exec((err, user) => {
      if (err) return res.json({ msg: 'server error' });
      if (user) {
        res.json({ msg: 'User Role Changed !' });
      }
    });
});

//Get User by id
router.get('/user/:id', function (req, res, next) {
  userModel.findById({ _id: req.params.id }).exec((err, user) => {
    if (err)
      return res.json({
        msg: 'Server Error',
      });
    else {
      return res.json({
        msg: 'User Fetched !',
        data: user,
      });
    }
  });
});
module.exports = router;
