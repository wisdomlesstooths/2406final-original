const mongoose = require("mongoose");
const Schema = mongoose.Schema;
//const Review = require("./ReviewModel");

let movieSchema = Schema({
  title:{
    type: String,
    required: true
  },
  year: {
    type: String,
    required: true
  },
  rating: {
    type: [Number],
    min: 1,
    max: 10,
    //required: checkReview
  },
  runtime: {
    type: String,
    required: true
    //required: checkReview
  },
  plot: {
    type: String,
    required: true
    //required: checkReview
  },
  genre: {
    type: [String],
    required: true
    //required: checkReview
  },
	director: {
    type: [String],
    required: true
  },
  writer: {
    type: [String],
    required: true
  },
	actors: {
    type: [String],
    required: true
  },
	//amount: {type: Number, required: true},

	reviews:  {
		type: [String],

	}
    //string of IDs
		//required: checkReview
});

/*
function checkReview(){
	return this.rating || this.summary || this.review;
}*/
//Instance method finds reviews of this movie
movieSchema.methods.findReviews = function(callback){
	this.model("Reviews").find()
	.where("movie").equals(this._id)
	// .populate("reviewer") //or sumText
	.exec(callback);
};

module.exports = mongoose.model("Movie", movieSchema);
