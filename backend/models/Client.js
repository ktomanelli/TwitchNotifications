const mongoose = require('mongoose');

const { Schema } = mongoose;
const { ObjectId } = Schema;

const clientSchema = new Schema({
  _id: ObjectId,
  user: {
    id: String,
    login: String,
    display_name: String,
    type: String,
    broadcaster_type: String,
    description: String,
    profile_image_url: String,
    offline_image_url: String,
    view_count: Number,
    created_at: Date,
  },
  data: {
    access_token: String,
    expires_in: Number,
    refresh_token: String,
    scope: [String],
    token_type: String,
  },
});

const Client = mongoose.model('client', clientSchema);

module.exports = Client;
