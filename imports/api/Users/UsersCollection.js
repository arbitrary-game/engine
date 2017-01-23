import UsersSchema from "./UsersSchema";

const Users = Meteor.users;

// Deny all client-side updates since we will be using methods to manage this collection
Users.deny({
  insert() {
    return true;
  },
  update() {
    return true;
  },
  remove() {
    return true;
  },
});

Users.attachSchema(UsersSchema);

Users.publicFields = {
  profile: 1,
};

export default Users;
