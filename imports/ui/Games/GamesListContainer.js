import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import Games from './GamesListComponent';

export default createContainer(({ params }) => {
  return {};
}, Games);
