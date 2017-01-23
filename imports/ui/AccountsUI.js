import { Accounts, STATES } from 'meteor/std:accounts-ui'

Accounts.ui.config({
  passwordSignupFields: 'EMAIL_ONLY',
  profilePath: "/"
});
