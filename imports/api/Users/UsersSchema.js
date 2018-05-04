import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import TimestampedSchema from '/imports/common/TimestampedSchema'

export const UserProfileSchema = new SimpleSchema({
  name: {
    type: String,
    defaultValue: ""
  },
  avatarUrl: {
    type: String,
    regEx: Meteor.settings.public.isDebug ? /^(\/\w+)+\.\w+(\?(\w+=[\w\d]+(&\w+=[\w\d]+)+)+)*$/i : SimpleSchema.RegEx.Url,
    optional: true
  }
});

export const UserSchema = new SimpleSchema([{
  emails: {
    type: Array,
    // For accounts-password, either emails or username is required, but not both. It is OK to make this
    // optional here because the accounts-password package does its own validation.
    // Third-party login packages may not require either. Adjust this schema as necessary for your usage.
    optional: true
  },
  "emails.$": {
    type: Object
  },
  "emails.$.address": {
    type: String,
    regEx: SimpleSchema.RegEx.Email
  },
  "emails.$.verified": {
    type: Boolean
  },
  amount: {
    type: Number,
    defaultValue: 500
  },
  // // Use this registered_emails field if you are using splendido:meteor-accounts-emails-field / splendido:meteor-accounts-meld
  // registered_emails: {
  //   type: Array,
  //   optional: true
  // },
  // 'registered_emails.$': {
  //   type: Object,
  //   blackbox: true
  // },
  profile: {
    type: UserProfileSchema
  },
  // Make sure this services field is in your schema if you're using any of the accounts packages
  services: {
    type: Object,
    optional: true,
    blackbox: true
  },
  // Add `roles` to your schema if you use the meteor-roles package.
  // Option 1: Object type
  // If you specify that type as Object, you must also specify the
  // `Roles.GLOBAL_GROUP` group whenever you add a user to a role.
  // Example:
  // Roles.addUsersToRoles(userId, ["admin"], Roles.GLOBAL_GROUP);
  // You can't mix and match adding with and without a group since
  // you will fail validation in some cases.
  // roles: {
  //   type: Object,
  //   optional: true,
  //   blackbox: true
  // },
  // // Option 2: [String] type
  // // If you are sure you will never need to use role groups, then
  // // you can specify [String] as the type
  // roles: {
  //   type: Array,
  //   optional: true
  // },
  // 'roles.$': {
  //   type: String
  // },
  // In order to avoid an 'Exception in setInterval callback' from Meteor
  heartbeat: {
    type: Date,
    optional: true
  },
  md5hash: {
    type: String,
    optional: true
  },
  gravatarExistis: {
    type: Boolean,
    defaultValue: false
  },
}, TimestampedSchema]);


export default UserSchema;
