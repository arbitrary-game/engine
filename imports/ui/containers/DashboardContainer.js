import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import Dashboard from '../components/Dashboard';

export default createContainer(({ params }) => {
  return {};
}, Dashboard);
