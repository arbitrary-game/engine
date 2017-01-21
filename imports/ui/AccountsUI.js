import { Accounts, STATES } from 'meteor/std:accounts-ui'
import './T9n'

Accounts.ui.config({
  passwordSignupFields: 'EMAIL_ONLY',
  profilePath: "/"
});
