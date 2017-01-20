import {Meteor} from "meteor/meteor";
import {createContainer} from "meteor/react-meteor-data";
import {every} from "lodash";

import Games from "/imports/api/Games/GamesCollection"
import GamesListActiveComponent from "./GamesListActiveComponent";

export default createContainer(({params}) => {
  let subscriptions = [];
  subscriptions.push(Meteor.subscribe('Games.active'));
  const isLoading = !every(subscriptions, subscription => subscription.ready());
  // const games = Games.find().fetch();
  const games = [
    {
      _id: "Yandex2Game",
      name: "Yandex #2",
      ruleset: "Classic",
      maxPlayers: 5,
      players: () => ([{}, {}, {}, {}]),
      owner: () => ({
        avatarUrl: 'http://semantic-ui.com/images/avatar/small/elliot.jpg'
      })
    },
    {
      _id: "TopSecretGame",
      name: "Top secret",
      ruleset: "Fixed bets",
      maxPlayers: 3,
      players: () => ([{}, {}]),
      owner: () => ({
        avatarUrl: 'http://semantic-ui.com/images/avatar/small/helen.jpg'
      })
    },
    {
      _id: "ProSeriesGame",
      name: "Pro series - only players with 500+ rating",
      ruleset: "Classic",
      maxPlayers: 5,
      players: () => ([{}, {}]),
      owner: () => ({
        avatarUrl: 'http://semantic-ui.com/images/avatar/small/jenny.jpg'
      })
    }
  ];
  return {
    isLoading,
    games,
  };
}, GamesListActiveComponent);
