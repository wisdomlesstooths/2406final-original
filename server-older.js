// server.js

const http = require('http');
const express = require('express');
const bodyParser= require('body-parser');
let app = express();
app.set('view engine', 'pug');
app.use(bodyParser.urlencoded({ extended: true })); // put form data into req.body

let httpServer = http.createServer(app);
httpServer.listen(8080);	//Start server

// Movie Data type
function Movie(title, year, runtime, plot, genre, director, writer, actors){
	this.title = title;
  this.year = year;
  this.rating = '7';
  this.runtime = runtime;
  this.plot = plot;
  this.genre = genre;
  this.director = director;
  this.writer = writer;
  this.actors = actors;
  this.similar = ['similar 1', 'similar 2', 'similar 3'];
  this.watched = ['wateched 1', 'wateched 2', 'wateched 3'];
  this.reviews = ['1/10 i hate all movies equally', 'review 2', 'review 3'];
}
// Import all movie data from JSON to array
let movieData = require('./movie-data/movie-data-10.json');
let movies = {};
let firstFive = {};
let i = 0;
movieData.forEach(movie => {
    movies[movie.Title] = new Movie(movie.Title, movie.Year, movie.Runtime, movie.Plot, movie.Genre, movie.Director, movie.Writer, movie.Actors);
    if (i<5) {
        firstFive[i] = movies[movie.Title];
        i = i+1;
    }
});

// User Data Type
let users = {};
function User(username, password) {
	this.username = username;
	this.password = password;
  this.loggedIn = true;
  this.contributing = false;
  this.follow = [];
  this.recommendedMovies = [];
  this.watchedMovies = [];
  this.notifications = [];
  this.reviews = [];
}

// People Data Type

function People(name) {
  //this.history = [];
	this.name = name;
  this.directedMovies = [];
  this.writtenMovies = [];
  this.actedMovies = [];
  this.collaborators = [];
  this.followers = [];
}
let people = {};
// example person
people['example person'] = new People('example Person');

// Review Data Type

function Review(rating, sumText, fullText, reviewer) {
	this.id = '';
  this.rating = rating;
  this.sumText = sumText;
  this.fullText = fullText;
  this.reviewer = reviewer;
	//this.id = ;
}
let reviews = {};
//example reviewer
//reviews.push('review': new Review(1, 'summary', 'full review', 'user'));

// Notifications Data Type
function Notification(currUser, notifText) {
  this.currUser = currUser;
  this.notifText = notifText;
}
let notifications = {};
//example notification
//notifications.push('curUser': new Notification('current user', 'notification content'));

// Follows Data Type
function Follows(user) {
    // loop, check for currUser.follow type people, users, followers
	this.user = user;
  this.people = peopleFollowing;
  this.users = usersFollowing;
  this.followers = currFollowers;
}
let follows = {};

app.get('/', (req, res) => {
  	res.render('pages/home', {
		title: 'Home'
	});
});

app.get('/profile', (req, res) => {
	console.log(movies);
	res.render('pages/profile', {
		title: 'User Profile',
		username: 'you',
		type: false,
		peopleFollows: ['me', 'you', 'nobody', 'everybody'],	// people the user is following
		userFollows: ['me', 'you', 'nobody', 'everybody'],	// users the user is following
		watched: movies,
		recc: movies,
		notifs: ['they are acting in a new movie']
	});
});

app.get('/users/:someUserName', (req, res) => {
     //res.send('some user');
    //let username = req.param.someUserName;
    res.render('pages/someUser', {
        title: 'Example User',
        username: 'randomUser',
        contributing: 0,
        follows: ['me', 'you', 'nobody', 'everybody'],
        watched: ['a good movie', 'an ok movie', 'some weird obscure german impressionism "film"'],
        reviews: [movies['The Ballad of Cable Hogue'].title]
    });
});


app.get('/people/:somePersonName', (req, res) => {
	// for each movie: if in movies.actors; movie.writers;OR movie.Directors
	//if not in people, add to people
	//add movie to writtenMovies; actedMovies; or directedMovies
	//do collaborator algorithm
  	//res.send('some person');
	res.render('pages/somePerson', {
		title: 'Example Person',
		name: 'Famous Person',
		collaborators: ['Brad Pitt', 'Johnny Depp', 'Angelina Jolie'],
		writer: ['wrote in Movie 1', 'wrote in Movie 2', 'wrote in Movie 3'],
		director: ['directed Movie 1', 'directed Movie 2', 'directed Movie 3'],
		actor: ['acted in Movie 1', 'acted in Movie 2', 'acted in Movie 3']
	});
});


app.get('/movies/:someMovieName', (req, res) => {
    //make if/else cases for the queries
		//let movieName = param :someMovieName;

	//let rating = req.query.rating;
  //let sumText = req.query.sumText;
  //let fullText = req.query.fullText;
	//add example rating
  	//res.send('some movie');
	let movieName = 'The Ballad of Cable Hogue';
	let mov = movies[movieName];

	res.render('pages/someMovie', {
		title: mov.title,
		movie: mov,
		score: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10']
	});
});
app.post('/movies/:someMovieName', (req, res) => {
    //make if/else cases for the queries
		//let movieName = param :someMovieName;

	//let rating = req.query.rating;
  //let sumText = req.query.sumText;
  //let fullText = req.query.fullText;
	//add example rating
  	//res.send('some movie');
	let movieName = 'The Ballad of Cable Hogue';
	let mov = movies[movieName];

	res.render('pages/someMovie', {
		title: mov.title,
		movie: mov,
		score: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10']
	});
});

app.get('/reviews/:someReviewID', (req, res) => {
  	//res.send('some review');
	res.render('pages/someReview', {
		title: 'Example Review',
		reviewer: 'me',
		score: 2,
		avgRating: 3,
		sumText:'short but not sweet',
		review: 'the only reason i did not give a 1 is because i was in a good mood. keyword: "was"'
	});
});

app.get('/search', (req, res) => {
  	//res.send('search');
	res.render('pages/search', {
		title: 'Search',
		name: 'any',
		genre: 'any',
		actor: 'any'
	});
});
app.get('/searchResults?title=:searchTitle&genre=:searchGenre&actor=:searchActor', (req, res) => {
	let title = req.query.title;
	let genre = req.query.genre;
  let actor = req.query.actor;
  	//res.send('search results');
	if (!(title && genre && actor)){
		res.render('pages/searchResults', {
			title: 'Search Results',
			name: 'any',
			genre:'any',
			actor:'any',
			results:['movie 1', 'movie 2', 'movie 3', 'movie 4', 'movie 5']
		});
	}
	else {
		res.render('pages/searchResults',{
			title: 'Search Results',
			name: title,
			genre: genre,
			actor: actor,
			results:['movie 1', 'movie 2', 'movie 3', 'movie 4', 'movie 5']
		});
	}
});
app.post('/searchResults', (req, res) => {
	if (!(req.body.name && req.body.genre && req.body.actor)){
		res.render('pages/searchResults', {
			title: 'Search Results',
			name: 'any',
			genre: 'any',
			actor: 'any',
			results:['movie 1', 'movie 2', 'movie 3', 'movie 4', 'movie 5']
		});
		return res.status(200);
	}
	else {
		res.render('pages/searchResults', {
			title: 'Search Results',
			name: req.body.name,
			genre: req.body.genre,
			actor: req.body.actor,
			results:['movie 1', 'movie 2', 'movie 3', 'movie 4', 'movie 5']
		});
		return res.status(200);
	}
});

app.get('/login', (req, res) => {
	let username = req.query.username;
	let password = req.query.password;
  let create = req.query.create;
  	//res.send('login');
	res.render('pages/login', {
		title: 'Login',
		username: false
	});
	return res.status(200);
});
app.post('/login', (req, res) => {
	if (!req.body.username){
		return res.status(400).send('ERROR 400: Username Not Found');
	}
	else if (!req.body.password) {
		return res.status(400).send('ERROR 400: Password Not Found');
	}
	else {
		let username = req.body.username;
		//let password = req.body.password;
		res.render('pages/profile', {
			title: 'User Profile',
			username: 'Welcome, ' + username,
			type: false,
			peopleFollows: ['me', 'you', 'nobody', 'everybody'],	// people the user is following
			userFollows: ['me', 'you', 'nobody', 'everybody'],	// users the user is following
			watched: movies,
			recc: movies,
			notifs: ['they are acting in a new movie']
		});
		return res.status(200);
	}
});

app.get('/contribute', (req, res) => {
    //let actor = res.query.actor;
    //let movie = req.query.movie;
	res.render('pages/contribute', {
		title: 'Contribute'
	});
	return res.status(200);
});

app.post('/contribute', (req, res) => {
    if (!((req.body.name && req.body.runtime && req.body.year && req.body.writers && req.body.directors && req.body.actors && req.body.genre)||req.body.actorName)) {
        return res.status(200).send('error: ensure all textboxes are filled');
    }
		else if (req.body.actorName) {
			let name = req.body.actorName;
			res.render('pages/somePerson', {
				title: 'New Person',
				name: name,
				collaborators: ['Brad Pitt', 'Johnny Depp', 'Angelina Jolie'],
				writer: ['wrote in Movie 1', 'wrote in Movie 2', 'wrote in Movie 3'],
				director: ['directed Movie 1', 'directed Movie 2', 'directed Movie 3'],
				actor: ['acted in Movie 1', 'acted in Movie 2', 'acted in Movie 3']
			});
		}
    else {
			let title = req.body.name;
			let year = req.body.year;
			let runtime = req.body.runtime;
			let plot = req.body.plot;
			let genre = (req.body.genre).replace(/^\{|\}$/g,'').split(','); //stored array, if user doesnt leave trailing commas; otherwise it'll be a SyntaxError, to fix later
			let director = (req.body.directors).replace(/^\{|\}$/g,'').split(',');
			let writer = (req.body.writers).replace(/^\{|\}$/g,'').split(',');
			let actors = (req.body.actors).replace(/^\{|\}$/g,'').split(',');
      mov = new Movie(title, year, runtime, plot, genre, director, writer, actors);
      res.render('pages/someMovie', {
          title: mov.title,
          movie: mov,
          score: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10']
      });
    }
});
app.listen(3000, () => {
	console.log('Listening on port 3000... beep bop beep bop');
	console.log('in your browser, open localhost:3000');
});
