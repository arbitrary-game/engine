export default () => {
  if (Meteor.settings["public"].isDevLoginActive) {
    if (!Meteor.userId() && (location.host === "localhost:3000" || location.host.indexOf("192.168") !== -1) && document.cookie.indexOf("autologin=false") === -1) {
      if (jQuery.browser.mozilla) {
        Meteor.loginWithToken("AliceRipleyUser");
      } else {
        if (navigator.vendor === "Google Inc."){
          Meteor.loginWithToken("WinstonChurchillUser");
        } else {
          Meteor.loginWithToken("BobDylanUser");
        }
      }
    }
  }
}
