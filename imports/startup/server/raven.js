RavenLogger.initialize({
  client: Meteor.settings.public["ravenClientDSN"],
  server: Meteor.settings["ravenServerDSN"]
}, {
  trackUser: true,
  patchGlobal: true
});
