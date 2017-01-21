import { Accounts } from 'meteor/accounts-base'
import { Meteor } from 'meteor/meteor'
import { SSR } from 'meteor/meteorhacks:ssr'

SSR.compileTemplate('verificationEmailTemplate', Assets.getText('verificationEmailTemplate.html'));
SSR.compileTemplate('verificationEmailTemplateText', Assets.getText('verificationEmailTemplateText.html'));

Accounts.emailTemplates.from = Meteor.settings.public.emails.from;
Accounts.emailTemplates.siteName = Meteor.settings.public.siteName;
Accounts.emailTemplates.verifyEmail.subject = (user) => Meteor.settings.public.emails.verification.subject;
Accounts.emailTemplates.verifyEmail.text = (user, url) => SSR.render("verificationEmailTemplateText", {user, url});
Accounts.emailTemplates.verifyEmail.html = (user, url) => SSR.render("verificationEmailTemplate", {user, url});

Accounts.onCreateUser((options, user) => {

  Meteor.setTimeout(() => {
    Accounts.sendVerificationEmail(user._id)
  }, 2000);

  return user;
});
