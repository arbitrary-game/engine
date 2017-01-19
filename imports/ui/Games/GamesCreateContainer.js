import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import GamesCreateComponent from './GamesCreateComponent';

export default GamesCreateContainer = createContainer(({ params }) => {
  return {};
}, GamesCreateComponent);
