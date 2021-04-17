//
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
//const Review = require("./ReviewModel");

let userSchema = Schema({
	//Names will be strings between 1-30 characters
	//Must consist of only A-Z characters
	//Will be trimmed automatically (i.e., outer spacing removed)

	//HAVE TO ENSURE NAMES DONT REPEAT
	name: {
		type: String,
		required: true,
		//minlength: 1,
		//maxlength: 30,
		match: /[A-Za-z0-9]+/,
		trim: true
	},
	password: {
		type: String,
		required: true,
	},
	roles: {
		type: [],
		required: true,
	},
	loggedIn: {
		type: Boolean,
	},
	contributing: {
		type: Boolean,
	},
	recommendedMovies: {
		type: [String],

	},
	watchedMovies: {
		type: [String],

	},
	//follows
	usersFollowing: {
		type: [String],

	},
	peopleFollowing: {
		type: [String],

	},

	//Notifications
	reviews:  {
		type: [String]
	},
});


//---------------Methods---------------------

//Instance method finds reviews of this user
userSchema.methods.findReviews = function(callback){
	this.model("Reviews").find()
	.where("reviewer").equals(this._id)
	.populate("movie")
	.exec(callback);
};

module.exports = mongoose.model("User", userSchema);
