// server.js

const express = require('express');
let app = express();
app.set('view engine', 'pug');

const MongoClient = require('mongodb').MongoClient;
let userRouter = require("./user-router");
app.use("/users", userRouter);
let moviesRouter = require("./movies-router");
//app.use("/movies", movieRouter);
let reviewsRouter = require("./reviews-router");
//app.use("/reviews", reviewsRouter);
let personRouter = require("./person-router");
//app.use("/people", personRouter);

/*
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
let follows = {};*/

app.get('/', (req, res) => {
  	res.render('pages/home', {
		title: 'Home'
	});
});

app.get('/profile', (req, res, user) => {
	console.log(movies);
	
	res.render('profile', {
		title: 'User Profile',
		//user: user
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
    res.render('someUser', {
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
	res.render('somePerson', {
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

	res.render('someMovie', {
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

	res.render('someMovie', {
		title: mov.title,
		movie: mov,
		score: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10']
	});
});

app.get('/reviews/:someReviewID', (req, res) => {
  	//res.send('some review');
	res.render('someReview', {
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
	res.render('search', {
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
		res.render('searchResults', {
			title: 'Search Results',
			name: 'any',
			genre:'any',
			actor:'any',
			results:['movie 1', 'movie 2', 'movie 3', 'movie 4', 'movie 5']
		});
	}
	else {
		res.render('searchResults',{
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
		res.render('searchResults', {
			title: 'Search Results',
			name: 'any',
			genre: 'any',
			actor: 'any',
			results:['movie 1', 'movie 2', 'movie 3', 'movie 4', 'movie 5']
		});
	}
	else {
		res.render('searchResults', {
			title: 'Search Results',
			name: req.body.name,
			genre: req.body.genre,
			actor: req.body.actor,
			results:['movie 1', 'movie 2', 'movie 3', 'movie 4', 'movie 5']
		});
	}
});

app.get('/login', (req, res) => {
	let username = req.query.username;
	let password = req.query.password;
  	let create = req.query.create;
  	//res.send('login');
	res.render('login', {
		title: 'Login',
		username: false
	});
});
app.post('/login', (req, res) => {
    if (!req.body.username){
        return res.status(400).send('ERROR 400: Username Not Entered');
    }
    else if (!req.body.password) {
        return res.status(400).send('ERROR 400: Password Not Entered');
    }
    else {
        let username = req.body.username;
        let password = req.body.password;
		let user = getUser(username);

		if ((user) & (username == user.name) & (password == user.password)) {
			res.render('pages/profile', {
				title: 'User Profile',
				user: user
				// username: 'Welcome, ' + username,
				// type: false,
				// peopleFollows: ['me', 'you', 'nobody', 'everybody'],    // people the user is following
				// userFollows: ['me', 'you', 'nobody', 'everybody'],    // users the user is following
				// watched: movies,
				// recc: movies,
				// notifs: ['they are acting in a new movie']
			});
			return res.status(200);
		}

		return res.status(400).send('ERROR 400: Login credentials do not match');
    }
});
/*
app.get('/createUser', (req, res) => {
	let username = req.query.username;
	let password = req.query.password;
  	let create = req.query.create;
  	//res.send('login');
	res.render('login', {
		title: 'Login',
		username: false
	});
});
app.post('/createUser', (req, res) => {
    if (!req.body.username){
        return res.status(400).send('ERROR 400: Username Not Entered');
    }
    else if (!req.body.password) {
        return res.status(400).send('ERROR 400: Password Not Entered');
    }
    else {
        let username = req.body.username;
        let password = req.body.password;
		let user = getUser(username);

		if ((user) & (username == user.name) & (password == user.password)) {
			res.render('pages/profile', {
				title: 'User Profile',
				user: user
			});
		}
		else if (!user) {
			let newUser = {
				//_id = ObjectID('what'),
				roles = 1,	// read only
				recommendedMovies = [],
				watchedMovies = [],
				usersFollowing = [],
				peopleFollowing = [],
				reviews = [],
				name = username,
				password = password,
				loggedIn = true,
				contributing = false,
				//notifications = []
			};
			userList.push(newUser);

			res.render('pages/profile', {
				title: 'User Profile',
				user: newUser
			});
		}
		return res.status(200);
    }
});
*/
app.get('/contribute', (req, res) => {
    //let actor = res.query.actor;
    //let movie = req.query.movie;
	res.render('contribute', {
		title: 'Contribute'
	});
});

app.post('/contribute', (req, res) => {
    if (!((req.body.name && req.body.runtime && req.body.year && req.body.writers && req.body.directors && req.body.actors && req.body.genre)||req.body.actorName)) {
        return res.status(200).send('error: ensure all textboxes are filled');
    }
		else if (req.body.actorName) {
			let name = req.body.actorName;
			res.render('somePerson', {
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
      res.render('someMovie', {
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

// ---------------------------------user functions --------------------------------------------------

function getUser(username) {
	for (let user in userList) {
		if (username == user.name) {
			return user;
		}
	}
	return null;
}

function createUser(user) {
	if (!getUser(user.name)) {

	}
}