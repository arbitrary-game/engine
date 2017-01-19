import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import GamesListActiveComponent from './GamesListActiveComponent';

export default createContainer(({ params }) => {
  return {};
}, GamesListActiveComponent);
