//
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let personSchema = Schema({
	//Names will be strings between 1-30 characters
	//Must consist of only A-Z characters
	//Will be trimmed automatically (i.e., outer spacing removed)
	name: {
		type: String,
		required: true,
		match: /[A-Za-z]+/,
		trim: true
	},
  directed: {
		type: [String]
	},
  wrote: {
		type: [String]
	},
  acted: {
		type: [String]
	}


});

personSchema.methods.isPerson = function(person,callback){
	if (!person){
		return false;
	}
	if (!person.hasOwnProperty("name")){
		return false;
	};
	return true;
};

/*
personSchema.methods.getPerson = function(person,callback){
	if (!personSchema.methods.isPerson(person)){
		return undefined;
	}
//peopleDB.find(person => person.name.toLowerCase() === person.toLowerCase()
};
personSchema.methods.newPerson = function(newPerson,callback){
	if (personSchema.methods.isPerson(person) || personSchema.methods.getPerson(person)){
		return null;
	}
	newPerson.directed = [];
	newPerson.written = [];
	newPerson.acted = [];
	peopleDB.set(newPerson.name, newPerson)
	return newPerson
};*/

module.exports = mongoose.model("Person", personSchema);
