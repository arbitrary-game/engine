RavenLogger.initialize({
  client: Meteor.settings.public["ravenClientDSN"]
}, {
  trackUser: true
});

window.addEventListener("unhandledrejection", function(error) {
  RavenLogger.log(error.reason);
});
