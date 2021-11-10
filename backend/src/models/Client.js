const mongoose = require('mongoose');

const { Schema } = mongoose;

const clientSchema = new Schema({
  _id: String,

  user: {
    id: String,
    login: String,
    display_name: String,
    type: {
      type: String
    },
    broadcaster_type: String,
    description: String,
    profile_image_url: String,
    offline_image_url: String,
    view_count: Number,
    created_at: String,
  }
});


const Client = mongoose.model('client', clientSchema);

module.exports = Client;
