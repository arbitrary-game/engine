import { LoggedInMixin } from 'meteor/tunifight:loggedin-mixin'
import { ValidatedMethod } from 'meteor/mdg:validated-method'
import { ActionsSchema } from "./ActionsSchema";

export const ActionsInsert = new ValidatedMethod({
  name: 'Actions.insert',
  mixins: [LoggedInMixin],
  checkLoggedInError: {
    error: 'notLogged',
    message: 'You need to be logged in to call this method',
    reason: 'You need to login'
  },
  validate: ActionsSchema.validator(),
  run: (action) => {
    //action logic here
  }
});
