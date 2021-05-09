// Require express to make easy
// routing on server side.
const express = require("express");

// Creating express object
const app = express();

// Require path module
const path = require('path');

// Require pug template engine
var bodyParser=require("body-parser");

// Require mongoose to use mongoDb
// in a easier way
const mongoose = require("mongoose");

const { check, validationResult } = require('express-validator');
const { send } = require("process");

// Define a port number
const port = 3000;

// Make a static route to use your
// static files in client side
app.use('/static', express.static('static'));

// Middleware for parsing
app.use(express.urlencoded());

// Define and use pug engine so also
// declare path on rendering
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Database Connection
mongoose.connect(
	"mongodb://localhost:27017/Online_Feedback_System",
	{ useUnifiedTopology: true }
);
var db=mongoose.connection;
db.on('error', console.log.bind(console, "connection error"));
db.once('open', function(callback){
	console.log("connection succeeded");
})

// Create schema
const feedback_Schecma = mongoose.Schema({
	name: String,
	email: String,
	Manager: String,
	q1: Number,
	q2: Number,
	q3: Number,
	q4: Number,
	q5: Number,
	q6: Number,
	q7: Number,
	feedi: String

});
const Student_Schecma = mongoose.Schema({
	Student_Id: Number,
	Name: String,
	Username: String,
	Password: String,
	Batch_Id: Number
});
// Making a modal on our already
// defined schema

const feedback_Modal = mongoose.model('tbl_E_Feedback', feedback_Schecma);
const Student_Modal = mongoose.model('tbl_Student', Student_Schecma);
app.get('/', function (req, res) {
		// Rendering your form
		res.render('login');
	});

	app.get('/home', function (req, res) {
		// Rendering your form
		res.render('home');
	});
		

// Handling get request
app.get('/login', function (req, res) {
	// Rendering your form
	res.render('login');
});

//login check
app.post('/login', async(req, res) =>{
	try{
		const username= req.body.Username;
		const password= req.body.Password;
		const Student_Details = db.collection('tbl_Student').find({"UserName":{$eq:"Student1.TRN"}, "Password":{$eq:"Student1_TRN#1"}}, {_id:0, Student_Id:1, Name:1});
		if(Student_Details)
		{
			res.status(201).render("feedback_form");
			console.log(Student_Details.Name);
		} else{
			res.send("Invalid");
			console.log(Student_Details.Name);
		}

	} catch(error) {
		res.status(400).send("Invalid login details")
		console.log(error);
	}
});
app.get('/feedback_form', function (req, res) {
	// Rendering your form
	res.render('feedback_form');
});

// Handling data after submission of form
app.post("/feedback_form",  function (req, res) { 
	  
	const feedData = new feedModal({
		name: req.body.name,
		email: req.body.email,
		Manager: req.body.Manager,
		q1: req.body.q1,
		q2: req.body.q2,
		q3: req.body.q3,
		q4: req.body.q4,
		q5: req.body.q5,
		q6: req.body.q6,
		q7: req.body.q7,
		feedi: req.body.feedi

	});
	feedData.save()
		.then(data => {
			res.render('feedback_form',
{ msg: "Your feedback successfully saved." });
		})
		.catch(err => {
			res.render('feedback_form',
				{ msg: "Check Details." });
		});
})

// Server setup
app.listen(port, () => {
	console.log("server is runing");
});
