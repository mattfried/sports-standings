var keystone = require('keystone');
var Email = keystone.list('Email');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'standings';
	locals.formData = req.body || {};
	locals.validationErrors = {};
	locals.emailSubmitted = false;

	// On POST requests, add the Email item to the database
	view.on('post', function (next) {

		var newEmail = new Email.model();
		var updater = newEmail.getUpdateHandler(req);

		updater.process(req.body, {
			flashErrors: true,
			fields: 'email',
			errorMessage: 'There was a problem submitting your email:',
		}, function (err) {
			if (err) {
				locals.validationErrors = err.errors;
			} else {
				locals.emailSubmitted = true;
			}
			next();
		});
	});

	// Render the view
	view.render('index');
};
