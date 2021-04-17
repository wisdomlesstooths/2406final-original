const mongoose = require("mongoose");
const ObjectId= require('mongoose').Types.ObjectId
const Product = require("./MovieModel");
const express = require('express');
const faker = require('faker');
let router = express.Router();

// router.get("/", queryParser);
// router.get("/", loadProductsDatabase);
// //router.get("/", respondProducts);

// router.post("/", express.json(), createProduct);

// router.get("/:id", sendSingleProduct);
// router.put("/:id", express.json(), saveProduct);

//If the id parameter exists, try to load a product
// that matches that ID. Respond with 404 error
// if invalid object ID or ID is not found.
router.param("id", function(req, res, next, value){
	let oid;
	console.log("Finding product by ID: " + value);
	try{
		oid = new ObjectId(value);
	}catch(err){
		res.status(404).send("Product ID " + value + " does not exist.");
		return;
	}

	Product.findById(value, function(err, result){
		if(err){
			console.log(err);
			res.status(500).send("Error reading product.");
			return;
		}

		if(!result){
			res.status(404).send("Product ID " + value + " does not exist.");
			return;
		}

		req.product = result;
		console.log("Result:");
		console.log(result);


		result.findPurchases(function(err, result){
			if(err){
				console.log(err);
				//we will assume we can go on from here
				//we loaded the product information
				//but couldn't get the people who bought the product
				//so no need to send error status
				next();
				return;
			}

			req.product.purchases = result;
			next();
		})
	});
});

//Parse the query parameters
//limit: integer specifying maximum number of results to send back
//page: the page of results to send back (start is (page-1)*limit)
//name: string to find in product name to be considered a match
//minprice: the minimum price to find
//maxprice: the maximum price to find
function queryParser(req, res, next){
	const MAX_MOVIES = 10;

	//build a query string to use for pagination later
	let params = [];
	for(prop in req.query){
		if(prop == "page"){
			continue;
		}
		params.push(prop + "=" + req.query[prop]);
	}
	req.qstring = params.join("&");

	try{
		req.query.limit = req.query.limit || 10;
		req.query.limit = Number(req.query.limit);
		if(req.query.limit > MAX_MOVIES){
			req.query.limit = MAX_MOVIES;
		}
	}catch{
		req.query.limit = 10;
	}

	try{
		req.query.page = req.query.page || 1;
		req.query.page = Number(req.query.page);
		if(req.query.page < 1){
			req.query.page = 1;
		}
	}catch{
		req.query.page = 1;
	}
/*
	try{
		req.query.minprice = req.query.minprice || 0;
		req.query.minprice = Number(req.query.minprice);
	}catch(err){
		req.query.minprice = 0;
	}

	try{
		req.query.maxprice = req.query.maxprice || Number.MAX_SAFE_INTEGER;
		req.query.maxprice = Number(req.query.maxprice);
	}catch{
		req.query.maxprice = Number.MAX_SAFE_INTEGER;
	}

	if(!req.query.name){
		req.query.name = "?";
	}*/

	next();
}

//Find mathching products by querying Movie model
function loadProductsDatabase(req, res, next){
	let startIndex = ((req.query.page-1) * req.query.limit);
	let amount = req.query.limit;

	Movie.find()
	//.where("price").gte(req.query.minprice).lte(req.query.maxprice)
//	.where("name").regex(new RegExp(".*" + req.query.name + ".*", "i"))
	.limit(amount)
	.skip(startIndex)
	.exec(function(err, results){
		if(err){
			res.status(500).send("Error reading movies.");
			console.log(err);
			return;
		}
		console.log("Found " + results.length + " matching movies.");
		res.movies = results;
		next();
		return;
	})
}

//Saves a movie using the request body
//Used for updating movies with a PUT request
function saveMovie(req, res, next){
	delete req.body._id;
	req.movie = Object.assign(req.movie, req.body);
	req.movie.save(function(err, result){
		if(err){
			console.log(err);
			res.status(500).send("Error updating movie.");
			return;
		}
		res.status(200).send(JSON.stringify(result));
	});
}

//Sends an array of products in response to a request
//Uses the products property added by previous middleware
//Sends either JSON or HTML
function respondMovies(req, res, next){
	res.format({
		"text/html": () => {res.render("pages/movies", {movies: res.movies, qstring: req.qstring, current: req.query.page } )},
		"application/json": () => {res.status(200).json(res.movies)}
	});
	next();
}

//Create a new random product in response to POST /products
//Again, in a real system, we would likely provide a page
// to specify a new products information
function createMovie(req, res, next){
	//Generate a random product
  let m = new Movie();
  m.title = movie.Title;
  m.year = movie.Year;
  m.runtime = movie.Runtime;
  m.plot = movie.Plot;
  m.genre = movie.Genre;
  /* MAKE NEW PERSON OR UPDATE EXISTING; NEED A FUNCTION FOR THIS
  m.director = movie.Director;
  m.writer = movie.Writer;
  m.actors = movie.Actors;*/

	m.save(function(err, result){
		if(err){
			console.log(err);
			res.status(500).send("Error creating product.");
			return;
		}
		res.status(201).send(JSON.stringify(p));
	})
}

//Create and send representation of a single product
//Sends either JSON or HTML
function sendSingleMovie(req, res, next){
	res.format({
		"application/json": function(){
			res.status(200).json(req.movie);
		},
		"text/html": () => { res.render("pages/movies", {movie: req.movie}); }
	});

	next();
}

//Export the router so it can be mounted in the main app
module.exports = router;
