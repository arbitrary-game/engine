import { Accounts } from 'meteor/accounts-base'
import { Meteor } from 'meteor/meteor'
import { SSR } from 'meteor/meteorhacks:ssr'
import {Gravatar} from 'meteor/jparker:gravatar'

SSR.compileTemplate('verificationEmailTemplate', Assets.getText('verificationEmailTemplate.html'));
SSR.compileTemplate('resetPasswordTemplate', Assets.getText('resetPasswordTemplate.html'));
SSR.compileTemplate('verificationEmailTemplateText', Assets.getText('verificationEmailTemplateText.html'));
SSR.compileTemplate('resetPasswordTemplateText', Assets.getText('resetPasswordTemplateText.html'));

Accounts.emailTemplates.from = Meteor.settings.public.emails.from;
Accounts.emailTemplates.siteName = Meteor.settings.public.siteName;
Accounts.emailTemplates.verifyEmail.subject = (user) => Meteor.settings.public.emails.verification.subject;
Accounts.emailTemplates.verifyEmail.text = (user, url) => SSR.render("verificationEmailTemplateText", {user, url});
Accounts.emailTemplates.verifyEmail.html = (user, url) => SSR.render("verificationEmailTemplate", {user, url});
Accounts.emailTemplates.resetPassword.subject = (user) => Meteor.settings.public.emails.reset.subject;
Accounts.emailTemplates.resetPassword.text = (user, url) => SSR.render("resetPasswordTemplateText", {user, url});
Accounts.emailTemplates.resetPassword.html = (user, url) => SSR.render("resetPasswordTemplate", {user, url});

export default function setGravatars() {
  let users = Meteor.users.find();
  users.forEach( ( user ) => { //http://stackoverflow.com/questions/11582395/how-should-i-check-if-gravatar-exist
    Meteor.http.get(`https://www.gravatar.com/avatar/${user.md5hash || Gravatar.hash( user.emails[0].address )}.png?d=404`, function(err, res) {
      if (res.statusCode == 200){
        Meteor.users.update( { _id: user._id }, {
          $set: { gravatarExistis: true }
        });
      } else if  (res.statusCode == 404) {
        Meteor.users.update({_id: user._id}, {
          $set: {gravatarExistis: false}
        });
      }

    });
    Meteor.users.update( { _id: user._id }, {
      $set: { md5hash: Gravatar.hash( user.emails[0].address ) }
    });
  });
}

Accounts.onCreateUser((options, user) => {
  user.md5hash = Gravatar.hash( user.emails[0].address );

  user.profile = options.profile || {};

  Meteor.setTimeout(() => {
    Accounts.sendVerificationEmail(user._id)
  }, 2000);

  return user;
});
