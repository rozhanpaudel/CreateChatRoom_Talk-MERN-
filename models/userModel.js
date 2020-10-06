const mongooose = require('mongoose');
const userSchema = new mongooose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    qualification: {
      type: String,
      required: true,
    },
    img: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    contact_number: [{ type: Number }],
    dob: {
      type: String,
      required: true,
    },
    cloudinary_img_id: { type: String },
    role: {
      type: Number,
      required: true
      //1 for admin and 2 for normal user and 3 for unverified user
    },
  },
  {
    timestamps: true,
  }
);

const userModel = mongooose.model('users', userSchema);
module.exports = userModel;
