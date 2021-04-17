
const mongoose = require("mongoose");
const User = require("./UserModel");
const Movie = require("./MovieModel");
const Person = require("./PersonModel");
const Review = require("./ReviewModel");
const MongoClient = require('mongodb').MongoClient;

const fs = require("fs");
const path = require("path");
const faker = require('faker');

//Connect to Mongo instance in the cloud

// Import all movie data from JSON to array
let movieData = require('./movie-data/movie-data-2500.json');
//make sure you can use the forEach function with this
let movieList = [];
let firstFive = [];
let i = 0;
movieData.forEach(movie => {
  let m = new Movie();
  m.title = movie.Title;
  m.year = movie.Year;
  m.rating = [];
  m.runtime = movie.Runtime;
  m.plot = movie.Plot;
  m.genre = movie.Genre;
  m.director = movie.Director;
  m.writer = movie.Writer;
  m.actors = movie.Actors;
  m.reviews = [];
  movieList.push(m);
  /*
  if (i<5) {
        firstFive.push(m);
        i = i+1;
    }*/
});

//MAKE PEOPLELIST
let peopleList = [];
movieList.forEach(movie => {
  let d = movie.director;
  let w = movie.writer;
  let a = movie.actors;
  d.forEach(director => {
    let p = peopleList.find(ele => ele.name == director);
    if (!p) {
      p = new Person();
      p.name = director;
      peopleList.push(p)
    };
    p.directed.push(movie.title);
  });
  w.forEach(writer => {
    let p = peopleList.find(ele => ele.name == writer);
    if (!p) {
      p = new Person();
      p.name = writer;
      peopleList.push(p)
    };
    p.wrote.push(movie.title);
  });
  a.forEach(actor => {
    let p = peopleList.find(ele => ele.name == actor);
    if (!p) {
      p = new Person();
      p.name = actor;
      peopleList.push(p)
    };
    p.acted.push(movie.title);
  });
});
/* MAKE NEW PERSON OR UPDATE EXISTING; NEED A FUNCTION FOR THIS
let directors = [];
for each person in m.director (same for writer, actors)
check if that person exists
if not, p = new Person();
p.name = name
p.directed = this;
p.everything else = []
personList.push(p)
p.directed.*/
//CHANGE CONNECTION URL

//MAKE USERLIST
let userList = [];
for (let n  = 0; n < 2500; n++){
  let u = new User();
  u.name = 'user' + n.toString();
  u.password = 'password';
  //u.roles = [{role: "read"}]
  u.loggedIn = false;
  u.contributing = false;
  u.recommendedMovies = [];
  u.watchedMovies = [];
  u.usersFollowing = [];
  u.peopleFollowing  = [];
  u.reviews = [];
  userList.push(u);
};

//Generating Reviews for each user, for randomized movies
let reviewList = [];
let minReviews = 2;
let maxReviews = 5;

userList.forEach(user => {
  let numReviews = minReviews + Math.floor(Math.random()*maxReviews);
  for (let i  = 0; i < numReviews; i++){
    let movie = movieList[Math.floor(Math.random()*(movieList.length))];
    let r = new Review();
    r.reviewer = user;
    r.movie = movie;
    r.rating = 1+Math.floor(Math.random()*9);
    r.summary = faker.lorem.sentence();
    r.review = faker.lorem.paragraph();
    reviewList.push(r);
    user.reviews.push(r.id);
    movie.reviews.push(r.id);
  }
});

//after all this, CALCULATE AVG RATING FOR MOVIE

mongoose.connect("mongodb+srv://hello:world@cluster0.j2hgm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", {useNewUrlParser: true, useUnifiedTopology: true});
//mongoose.connect('mongodb://localhost/project', {useNewUrlParser: true});
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
	mongoose.connection.db.dropDatabase(function(err, result){
		if(err){
			console.log("Error dropping database:");
			console.log(err);
			return;
		}
		console.log("Dropped database. Starting re-creation.");
    let completedMovies = 0;
    movieList.forEach(movie => {
      movie.save(function(err,result){
        if(err) throw err;
        completedMovies++;
        if(completedMovies >= movieList.length){
          console.log("All movies saved.");
        }
      })
    });
    //^ have to do that for all Models
    let completedPeople = 0;
    peopleList.forEach(person => {
      person.save(function(err,result){
        if(err) throw err;
        completedPeople++;
        if(completedPeople >= peopleList.length){
          console.log("All people saved.");
        }
      })
    });
    let completedReviews = 0;
    reviewList.forEach(review => {
      review.save(function(err,result){
        if(err) throw err;
        completedReviews++;
        if(completedReviews >= reviewList.length){
          console.log("All reviews saved.");
        }
      })
    });
    let completedUsers = 0;
    userList.forEach(user => {
      user.save(function(err,result){
        if(err) throw err;
        /*db.createUser({
          user: user.name,
          pwd: user.password,
          roles: ["read"]
        });*/
        completedUsers++;
        if(completedUsers >= userList.length){
          console.log("All users saved.");
          console.log("Finished.");
          db.close();
          process.exit();
        }
      })
    });
  });
});
