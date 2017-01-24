import { LoggedInMixin } from 'meteor/tunifight:loggedin-mixin'
import { ValidatedMethod } from 'meteor/mdg:validated-method'
import { ActionsCreateSchema } from "/imports/api/Actions/ActionsSchema"
import Actions from './ActionsCollection'

export const ActionsInsert = new ValidatedMethod({
  name: 'Actions.insert',
  mixins: [LoggedInMixin],
  checkLoggedInError: {
    error: 'notLogged',
    message: 'You need to be logged in to call this method',
    reason: 'You need to login'
  },
  validate: ActionsCreateSchema.validator(),
  run: (action) => {
    //action logic here
    console.log('ActionsInsert')
    return Actions.insert(action);
  }
});

