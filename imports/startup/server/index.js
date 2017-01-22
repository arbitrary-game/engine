import "./publications";
import "./methods";
import "./accounts";
import reload from "./reload";
import fixtureManager from './FixtureRegistration'

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
});

process.on('SIGUSR2', Meteor.bindEnvironment(() => {
  reload(fixtureManager);
  // migrate();
}));
