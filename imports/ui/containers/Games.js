import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import Games from '../components/Games';

export default createContainer(({ params }) => {
  return {};
}, Games);
