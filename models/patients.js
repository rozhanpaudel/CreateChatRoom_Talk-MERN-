const mongooose = require('mongoose');
const patientSchema = new mongooose.Schema(
  {
    patient_bed_no: {
      type: String,
      required: true,
    },
    sugar: {
      type: String,
    },
    bloodpressure: {
      type: String,
    },
    spo2: { type: String },
    bmi: { type: String },
    weight: { type: String },
    pulse: { type: String },
    complain: { type: String },
    observation: { type: String },
    plan: { type: String },
    previous_vitals: {},
    patient_history: [],
    created_by: { type: String },
    last_updated_time: { type: String },
    last_updated_by: { type: String },
  },
  {
    timestamps: true,
  }
);

const patientModel = mongooose.model('patients', patientSchema);
module.exports = patientModel;
