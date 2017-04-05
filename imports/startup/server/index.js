import "./publications";
import "./methods";
import "./accounts";
import "./raven"
import reload from "./reload";
import fixtureManager from './FixtureRegistration'
import setGravatars from "./accounts"
import recalculateAmount from "./transactions"

process.env.MAIL_URL = Meteor.settings['mailUrl'];

Meteor.startup(() => {
  // let control = Migrations._getControl();
  // let databaseReset = !control || !control.version;
  // if (databaseReset) {
  //   fixtureManager.insertAll([]);
  // } else {
  //   fixtureManager.ensureAll([]);
  // }
  // migrate();
  fixtureManager.insertAll([]);
  setGravatars();
  recalculateAmount();
});

process.on('SIGUSR2', Meteor.bindEnvironment(() => {
  reload(fixtureManager);
  // migrate();
}));
