require('./publications');
require('./methods');

process.env.MAIL_URL = Meteor.settings['mailUrl'];
