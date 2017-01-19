import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import AppComponent from './AppComponent';

export default createContainer(({ params }) => {
  return {};
}, AppComponent);
