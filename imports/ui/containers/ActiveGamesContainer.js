import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import ActiveGames from '../components/ActiveGames';

export default createContainer(({ params }) => {
  return {};
}, ActiveGames);
