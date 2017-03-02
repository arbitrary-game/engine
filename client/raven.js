RavenLogger.initialize({
  client: Meteor.settings.public["ravenClientDSN"]
}, {
  trackUser: true
});

window.addEventListener("unhandledrejection", function(error) {
  // A hack that allows us not to send client validation erros to sentry
  if (!(error && error.reason && error.reason.error &&  error.reason.error ===  'validation-error')){
    console.log('send error to sentry', error)
    RavenLogger.log(error.reason);
  } else {
    console.log('dont send error - its validation', error)
  }
});
