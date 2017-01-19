import {SimpleSchema} from 'meteor/aldeed:simple-schema';

export default new SimpleSchema({
  name: {
    type: String,
    defaultValue: '',
    min: 3,
    max: 255
  },

  isPublic: {
    type: Boolean,
    defaultValue: true,
    min: 3,
    max: 255
  },
});
