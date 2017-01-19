import {Meteor} from "meteor/meteor";
import {createContainer} from "meteor/react-meteor-data";
import {every} from "lodash";

import Games from "/imports/api/Games/GamesCollection"
import GamesListActiveComponent from "./GamesListActiveComponent";

export default createContainer(({params}) => {
  let subscriptions = [];
  subscriptions.push(Meteor.subscribe('Games.active'));
  const isLoading = !every(subscriptions, subscription => subscription.ready());
  const games = Games.find().fetch();
  return {
    isLoading,
    games,
  };
}, GamesListActiveComponent);
