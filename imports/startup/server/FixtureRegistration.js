import FixtureManager from "./FixtureManager";
import Users from "/imports/api/Users/UsersCollection";
import Games from "/imports/api/Games/GamesCollection";
// import ServiceConfigurationsData from '/imports/api/ServiceConfigurations/ServiceConfigurationsData'
import UsersData from "/imports/api/Users/UsersFixturesData";
import UsersHooks from "/imports/api/Users/UsersFixturesHooks";
import GamesData from "/imports/api/Games/GamesFixturesData";

let fixtureManager = new FixtureManager();

// fixtureManager.push(ServiceConfigurations, ServiceConfigurationsData); // required for login

if (Meteor.settings.fixtures.isEnabled) {
  fixtureManager.pre(Users, UsersHooks.pre);
  fixtureManager.post(Users, UsersHooks.post);
  fixtureManager.push(Users, UsersData);
  fixtureManager.push(Games, GamesData);
}

export default fixtureManager;
