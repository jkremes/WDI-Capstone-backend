const mongoose = require('mongoose')

// var ObjectId = mongoose.Schema.Types.ObjectId;
// var Car = new Schema({ driver: ObjectId });

const subordinateSchema = new mongoose.Schema({
  // profilePhoto: {
  //   img: { data: Buffer, contentType: String }
  // },
  first_name: {
    type: String,
    required: true
  },
  last_name: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  owner: {
    type: String,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('Subordinate', subordinateSchema)
