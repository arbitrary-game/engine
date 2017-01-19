import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import GamesListActive from './GamesListActiveComponent';

export default createContainer(({ params }) => {
  return {};
}, GamesListActive);
