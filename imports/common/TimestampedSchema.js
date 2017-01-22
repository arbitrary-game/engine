import {SimpleSchema} from 'meteor/aldeed:simple-schema';

export default new SimpleSchema({
  createdAt: {
    type: Date,
    autoValue: function() {
      if (this.isInsert) {
        return new Date();
      } else if (this.isUpsert) {
        return {$setOnInsert: new Date()};
      } else {
        this.unset();  // Prevent user from supplying their own value
      }
    },
    denyUpdate: true
  },
  // Force value to be current date (on server) upon update
  updatedAt: {
    type: Date,
    autoValue: function() {
      if (this.isInsert || this.isUpdate) {
        return new Date();
      } else if (this.isUpsert) {
        return {$setOnInsert: new Date()};
      }
    },
  },
});
