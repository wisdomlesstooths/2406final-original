//
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const User = require("./UserModel");
const Movie = require("./MovieModel");

let reviewSchema = Schema({

  //now when making new rewiew, have to do _id: new mongoose.Types.ObjectId()
  rating: {
    type: Number,
    min: 1,
    max: 10,
    //required: checkReview
  },
  summary: {
    type: String,
  },
  review: {
    type: String,
  },
  reviewer: { type: Schema.Types.ObjectId, ref: 'User' },
  movie: { type: Schema.Types.ObjectId, ref: 'Movie' },

});

module.exports = mongoose.model("Review", reviewSchema);
