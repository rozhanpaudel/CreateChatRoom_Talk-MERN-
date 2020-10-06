var express = require('express');
var router = express.Router();
var groupModel = require('../models/chatroom');

//find all the chatgroups
router.get('/groups', function (req, res, next) {
  groupModel.find().exec((err, groups) => {
    if (err) return res.json({ msg: 'Server Error' });
    if (!groups) return res.json({ msg: 'No Groups Found' });
    else {
      res.json({
        msg: ' Group Fetched',
        data: groups,
      });
    }
  });
});

// create a chat group
router.post('/add', function (req, res, next) {
  groupModel.findOne({ group_name: req.body.group_name }).exec((err, group) => {
    if (err) res.json({ msg: 'Server Error' });
    if (group)
      res.json({ msg: 'Group already Exists ! Try with another Name' });
    if (!group) {
      var newGroup = new groupModel({
        group_name: req.body.group_name,
        users: [req.body.username],
      });
      newGroup.save((err, done) => {
        res.json({ msg: 'Group Created !', data: done });
      });
    }
  });
});

//add user to group
router.put('/add', function (req, res, next) {
  const update = req.body.user;
  groupModel
    .findOne({ group_name: req.body.group_name })
    .exec((error, group) => {
      if (error) return res.json({ msg: 'Server Error' });
      else {
        //check if user already exists in group
        if (group.users.indexOf(req.body.user) == -1) {
          //if user doesnot exists add user
          groupModel.update(
            { group_name: req.body.group_name },
            { $push: { users: update } },
            function (err, done) {
              if (err) console.log(err);
              if (done) {
                res.json({ msg: 'User Added' });
              }
            }
          );
        } else {
          return res.json({
            msg: 'User already added to group',
          });
        }
      }
    });
});

//find chat group by group_name
// //Get all groups where user is a member
router.get('/group/:group', function (req, res, next) {
  groupModel.findOne({ group_name: req.params.group }).exec((err, group) => {
    if (err) return res.json({ msg: 'Server Error' });
    if (!group) return res.json({ msg: 'No group found' });
    else {
      res.json({
        msg: 'Group Details',
        data: group,
      });
    }
  });
});

// //Get all groups where user is a member
router.get('/:username', function (req, res, next) {
  groupModel.find().exec((err, groups) => {
    if (err) res.json({ msg: 'Server Error' });
    if (!groups) res.json({ msg: 'No groups found' });
    else {
      var filtered = groups.filter((group, i) => {
        return group.users.indexOf(req.params.username) !== -1;
      });
      res.json({
        msg: 'Filterd groups',
        data: filtered,
      });
    }
  });
});

module.exports = router;
