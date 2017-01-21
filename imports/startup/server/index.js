import "./publications";
import "./methods";
import "./accounts";
import reload from "./reload";
import FixtureManager from "./FixtureManager";
import Users from "/imports/api/Users/UsersCollection";
// import ServiceConfigurationsData from '/imports/api/ServiceConfigurations/ServiceConfigurationsData'
import UsersData from "/imports/api/Users/UsersFixturesData";
import UsersHooks from "/imports/api/Users/UsersFixturesHooks";

process.env.MAIL_URL = Meteor.settings['mailUrl'];

let fixtureManager = new FixtureManager();

// fixtureManager.push(ServiceConfigurations, ServiceConfigurationsData); // required for login

if (Meteor.settings.fixtures.isEnabled) {
  fixtureManager.pre(Users, UsersHooks.pre);
  fixtureManager.post(Users, UsersHooks.post);
  fixtureManager.push(Users, UsersData);
}

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
