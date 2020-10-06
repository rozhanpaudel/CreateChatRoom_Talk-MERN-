var express = require('express');
var router = express.Router();
var cloudinary = require('cloudinary');
var multer = require('multer');
var {
  computeDistanceBetween,
  LatLng,
  convertLatLng,
} = require('spherical-geometry-js');
const { check, validationResult } = require('express-validator/check');
const { headingDistanceTo, toLatLon } = require('geolocation-utils');
const hospitalModel = require('../models/hospitalModel');
const myStorage = require('../configs/multerSetup');
const auth = require('../middlewares/auth');
const userModel = require('../models/userModel');

require('dotenv').config();

// CLoudinary Config
require('../configs/cloudinary');

// Multer Storage Setup
var upload = multer({
  storage: myStorage,
});

//GET ALL HOSPITALS
router.get('/', auth, function (req, res, next) {
  hospitalModel.find().exec(function (error, hospitals) {
    if (error) return res.status(500).json({ msg: 'Server Error !' });
    if (!hospitals)
      res.json({
        msg: 'No Hospitals Found',
      });
    res.status(200).json({
      data: hospitals,
    });
  });
});

//Find NearBy hospitals
router.get('/find-nearby', auth, function (req, res, next) {
  hospitalModel.find().exec(function (error, hospitals) {
    if (error) return res.json({ msg: 'Server Error !', error: error });
    if (!hospitals)
      return res.json({
        msg: 'No Hospitals Found',
      });
    else {
      var nearHospitals = [];
      var latitude = Number(req.body.latitude);
      var longitude = Number(req.body.longitude);

      var d1 = toLatLon([latitude, longitude]);

      hospitals.forEach((hospital) => {
        //using latlng init

        var d2 = toLatLon([
          Number(hospital.location[0]),
          Number(hospital.location[1]),
        ]);

        //computing distance between two latlng

        var distanceinm = headingDistanceTo(d1, d2);
        console.log(distanceinm);
        var obj = {
          hospital_name: hospital.hospital_name,
          contact_number: hospital.contact_number,
          location: hospital.location,
          services: hospital.services,
          rating: hospital.rating,
          hospital_img: hospital.hospital_img,
          Distance_in_meter: distanceinm.distance,
        };
        nearHospitals.push(obj);
      });

      //Splice to copy nearhospitals

      var byKm = nearHospitals.slice(0);

      //sorting by lowest distance first

      byKm.sort(function (a, b) {
        return a.Distance_in_meter - b.Distance_in_meter;
      });
      return res.json({
        byKm,
      });
    }
  });
});

//ADD HOSPITAL
router.post(
  '/',
  auth,
  upload.single('hospital_img'),
  [
    check('hospital_name', 'Hospital Name is required').not().isEmpty(),

    check('location', 'Location is required').not().isEmpty(),
    check('services', 'Services is required').not().isEmpty(),
    check('contact_number', 'Contact Number is required').not().isEmpty(),
  ],
  function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({
        errors: errors.array(),
      });
    } else {
      //check if user is admin
      userModel.findById({ _id: req.user.user.id }).exec(function (err, user) {
        if (err) return res.json({ msg: 'Server Error !' });
        //if user role is not admin
        if (user) {
          if (user.role !== 1) {
            return res.json({
              msg: 'unauthorized Access',
            });
          } else {
            //CHECK IF Hospital EXISTS
            hospitalModel
              .findOne({ hospital_name: req.body.hospital_name })
              .exec(function (error, hospital) {
                if (error)
                  return res.json({
                    msg: 'Server ERROR',
                  });
                if (hospital) {
                  return res.json({
                    msg: 'Hospital already Exists',
                  });
                } else {
                  //CLoudinary upload
                  const result = cloudinary.v2.uploader.upload(req.file.path);
                  result.then((success) => {
                    if (!hospital) {
                      //Creating a new Hospital
                      const newHospital = new hospitalModel({
                        hospital_name: req.body.hospital_name,
                        hospital_img: success.url,
                        rating: req.body.rating,
                      });

                      //Splitting Services by comma and Looping through it Add each element to array of Schema hospital

                      var services_item = req.body.services.split(',');
                      services_item.forEach((service) => {
                        newHospital.services.push(service);
                      });

                      //Split number by comma and add it to new hospital

                      var numbers = req.body.contact_number.split(',');
                      numbers.forEach((number) => {
                        newHospital.contact_number.push(number);
                      });

                      //Split Location by comma and pushing it to newHospital
                      var loc_points = req.body.location.split(',');
                      loc_points.forEach((point) => {
                        newHospital.location.push(point);
                      });

                      //Saving newHospital

                      newHospital.save(function (error, hospital) {
                        if (error)
                          next({
                            msg: 'Server Error',
                          });
                        if (hospital) {
                          //Creating Payload Object
                          res.json({
                            msg: 'Hospital Added',
                            hospital: hospital,
                          });
                        }
                      });
                    }
                  });
                }
              });
          }
        }
      });
    }
  }
);

//MODIFY HOSPITAL DETAILS

router.put('/:id', function (req, res, next) {
  console.log(req.body.location);

  var newHospital = {};
  if (req.body.hospital_name)
    newHospital.hospital_name = req.body.hospital_name;
  if (req.body.services) {
    //Splitting Services by comma and Looping through it Add each element to array of Schema hospital
    var services = [];
    var services_item = req.body.services.split(',');
    services_item.forEach((service) => {
      services.push(service);
    });
    newHospital.services = services;
  }
  if (req.body.contact_number) {
    //Split number by comma and add it to new hospital
    var numtoinsert = [];
    var numbers = req.body.contact_number.split(',');
    numbers.forEach((number) => {
      numtoinsert.push(number);
    });
    newHospital.contact_number = numtoinsert;
  }
  if (req.body.rating) {
    newHospital.rating = req.body.rating;
  }
  if (req.body.location) {
    var modifiedlocation = [];

    var loc_points = req.body.location.split(',');
    loc_points.forEach((point) => {
      modifiedlocation.push(point);
    });
    newHospital.location = modifiedlocation;
  }

  hospitalModel.findByIdAndUpdate(
    { _id: req.params.id },
    newHospital,
    function (error, done) {
      if (error) return res.json({ msg: 'server error', error: error });
      else {
        res.json({
          msg: 'Modified',
          data: done,
        });
      }
    }
  );
});

//DELETE HOSPITAL BY ID

router.delete('/:id', auth, function (req, res, next) {
  hospitalModel
    .findOneAndDelete({ _id: req.params.id })
    .exec(function (error, hospitals) {
      if (error) return res.status(500).json({ msg: 'Server Error !' });
      if (!hospitals)
        return res.json({
          msg: 'Hospital doesnot exist',
        });
      res.status(200).json({
        msg: 'Deleted !',
        data: hospitals,
      });
    });
});

//Get Hospital By id

router.get('/hospital/:id', auth, function (req, res, next) {
  console.log(req.params.id);
  hospitalModel
    .findById({ _id: req.params.id })
    .then((hospital) => {
      return res.json({
        hospital: hospital,
      });
    })
    .catch((error) => {
      return res.json({ msg: 'Error Occured' });
    });
});

module.exports = router;
