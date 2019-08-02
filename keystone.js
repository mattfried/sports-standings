// Simulate config options from your production environment by
// customising the .env file in your project's root folder.
require('dotenv').config();

// Require keystone
var keystone = require('keystone');
var handlebars = require('express-handlebars');

// Initialise Keystone with your project's configuration.
// See http://keystonejs.com/guide/config for available options
// and documentation.

keystone.init({
	'name': 'Sport Standings',
	'brand': 'Sport Standings',

	'sass': 'public',
	'static': 'public',
	'favicon': 'public/favicon.ico',
	'views': 'templates/views',
	'view engine': '.hbs',

	'custom engine': handlebars.create({
		layoutsDir: 'templates/views/layouts',
		partialsDir: 'templates/views/partials',
		defaultLayout: 'default',
		helpers: new require('./templates/views/helpers')(),
		extname: '.hbs',
	}).engine,

	'emails': 'templates/emails',

	'auto update': true,
	'session': true,
	'auth': true,
	'user model': 'User',
});

// Load your project's Models
keystone.import('models');

// Setup common locals for your templates. The following are required for the
// bundled templates and layouts. Any runtime locals (that should be set uniquely
// for each request) should be added to ./routes/middleware.js
keystone.set('locals', {
	_: require('lodash'),
	env: keystone.get('env'),
	utils: keystone.utils,
	editable: keystone.content.editable,
});

// Load your project's Routes
keystone.set('routes', require('./routes'));


// Configure the navigation bar in Keystone's Admin UI
keystone.set('nav', {
	enquiries: 'enquiries',
	users: 'users',
});

// Start Keystone to connect to your database and initialise the web server


if (!process.env.MAILGUN_API_KEY || !process.env.MAILGUN_DOMAIN) {
	console.log('----------------------------------------'
	+ '\nWARNING: MISSING MAILGUN CREDENTIALS'
	+ '\n----------------------------------------'
	+ '\nYou have opted into email sending but have not provided'
	+ '\nmailgun credentials. Attempts to send will fail.'
	+ '\n\nCreate a mailgun account and add the credentials to the .env file to'
	+ '\nset up your mailgun integration');
}




// Require data.js
const data = require('./routes/data.js');

// Global variable to store the league data
let nhlData;
let nbaData;
let nflData;
let mlbData;


// Load each league data for when client's first connect
data.getData_nhl().then((result) => {
  nhlData = result;
});

data.getData_nba().then((result) => {
  nbaData = result;
});

data.getData_nfl().then((result) => {
  nflData = result;
});

data.getData_mlb().then((result) => {
  mlbData = result;
});


keystone.start({
  onHttpServerCreated : function() {

    var io = require('socket.io');
    io = io.listen(keystone.httpServer);

		// When client connects execute this function
		io.on('connection', (socket) => {
		  console.log('Client connection received');

		  // When clients connect, send the data for each league
			socket.emit('hello', 'hello, this is me from the server side');
		  socket.emit('nhl-data', nhlData);
		  socket.emit('nba-data', nbaData);
		  socket.emit('nfl-data', nflData);
		  socket.emit('mlb-data', mlbData);
		});

  }
});
