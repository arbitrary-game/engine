export default {
  "google": {
    "service": "google",
    "clientId": Meteor.settings.public.google.clientId,
    "secret": Meteor.settings.google.secret
  },
  "facebook": {
    "service": "facebook",
    "appId": Meteor.settings.public.facebook.appId,
    "secret": Meteor.settings.facebook.secret
  }
}
