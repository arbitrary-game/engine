import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import App from '../components/App';

export default createContainer(({ params }) => {
  return {};
}, App);
