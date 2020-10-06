const mongooose = require('mongoose');
const chatGroupSchema = new mongooose.Schema(
  {
    group_name: {
      type: String,
      required: true,
    },
    users: [],
    messages: [],
  },
  {
    timestamps: true,
  }
);

const groupModel = mongooose.model('groups', chatGroupSchema);
module.exports = groupModel;
