var express = require('express');
var router = express.Router();
var patientModel = require('../models/patients');

//Get All patients
router.get('/all', function (req, res, next) {
  patientModel.find().exec((err, patients) => {
    if (err) return res.json({ msg: 'Server Error' });
    if (!patients) return res.json({ msg: 'No Patients Found' });
    else {
      res.json({
        msg: 'Patients fetched',
        data: patients,
      });
    }
  });
});

//Get patient by id
router.get('/patient/:id', function (req, res, next) {
  patientModel.findById({ _id: req.params.id }).exec((err, result) => {
    if (err) return res.json({ msg: 'Server Error' });
    else {
      res.send(result);
    }
  });
});

//Create Patient
router.post('/create', function (req, res, next) {
  patientModel
    .findOne({ patient_bed_no: req.body.patient_bed_no })
    .exec((err, patient) => {
      if (err) return res.json({ msg: 'Server Error' });
      if (patient) return res.json({ msg: 'Patient already in bed' });
      if (!patient) {
        //creating new Patient
        var newPatient = new patientModel({
          patient_bed_no: req.body.patient_bed_no,
          created_by: req.body.created_by,
        });

        if (req.body.sugar) newPatient.sugar = req.body.sugar;
        if (req.body.bloodpressure)
          newPatient.bloodpressure = req.body.bloodpressure;
        if (req.body.spo2) newPatient.spo2 = req.body.spo2;
        if (req.body.bmi) newPatient.bmi = req.body.bmi;
        if (req.body.weight) newPatient.weight = req.body.weight;
        if (req.body.pulse) newPatient.pulse = req.body.pulse;
        if (req.body.complain) newPatient.complain = req.body.complain;
        if (req.body.observation) newPatient.observation = req.body.observation;
        if (req.body.plan) newPatient.plan = req.body.plan;

        //saving the patient
        newPatient.save(function (error, data) {
          if (error)
            return res.json({
              msg: 'Server Error ',
            });
          else {
            res.json({
              msg: 'Patient Created ',
              data: data,
            });
          }
        });
      }
    });
});

//Update patient by id
router.put('/patient/:id', function (req, res, next) {
  //last updated
  var dateObj = new Date();
  var month = dateObj.getUTCMonth() + 1;
  var day = dateObj.getUTCDate();
  var year = dateObj.getUTCFullYear();

  //mappint the update
  var update = {
    last_updated_time: year + '/' + month + '/' + day,

    last_updated_by: req.body.last_updated_by,
    previous_vitals: req.body.previous_vitals,
  };
  if (req.body.sugar) update.sugar = req.body.sugar;
  if (req.body.bloodpressure) update.bloodpressure = req.body.bloodpressure;
  if (req.body.spo2) update.spo2 = req.body.spo2;
  if (req.body.bmi) update.bmi = req.body.bmi;
  if (req.body.weight) update.weight = req.body.weight;
  if (req.body.pulse) update.pulse = req.body.pulse;
  if (req.body.complain) update.complain = req.body.complain;
  if (req.body.observation) update.observation = req.body.observation;
  if (req.body.plan) update.plan = req.body.plan;

  patientModel
    .findByIdAndUpdate({ _id: req.params.id }, update)
    .exec(function (error, result) {
      if (error)
        return res.json({
          msg: 'server error',
        });
      else {
        patientModel.findByIdAndUpdate(
          { _id: req.params.id },
          { $push: { patient_history: req.body.previous_vitals } },
          function (err, done) {
            if (err)
              return res.json({
                msg: 'server error',
              });
            else {
              res.json({
                msg: 'Updated',
                data: done,
              });
            }
          }
        );
      }
    });
});

//Get patient by id
router.delete('/patient/:id', function (req, res, next) {
  patientModel.findByIdAndDelete({ _id: req.params.id }).exec((err, result) => {
    if (err) return res.json({ msg: 'Server Error' });
    else {
      res.json({
        msg: 'Patient Deleted',
        data: result,
      });
    }
  });
});

module.exports = router;
