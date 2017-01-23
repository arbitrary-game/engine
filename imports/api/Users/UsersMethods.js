import {LoggedInMixin} from "meteor/tunifight:loggedin-mixin";
import {ValidatedMethod} from "meteor/mdg:validated-method";
import Users from "./UsersCollection";

export const UsersPushLoginToken = new ValidatedMethod({
  name: 'Users.pushLoginToken',
  validate({_id}) {
    if (!Meteor.settings.public.isDebug) {
      throw new Meteor.Error("security:debug", "This function is only available in debug environment");
    }
  },
  run: (_id) => {
    if (!Meteor.isServer) {
      return;
    }
    return Users.update(_id, {
      $push: {
        "services.resume.loginTokens": {
          hashedToken: Accounts._hashLoginToken(_id),
          when: new Date()
        }
      }
    });
  }
});
