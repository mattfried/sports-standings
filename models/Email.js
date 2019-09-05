var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Email Modal Model
 * =============
 */

var Email = new keystone.List('Email');

Email.add({
  email: { type: Types.Email, required: true, initial: true },
});

Email.defaultColumns = 'id, displayName, email';
Email.register();
