export default {
  pre(users) {
    let _id, lastWeek, user;
    lastWeek = new Date(Date.now() - 7 * 24 * 3600 * 1000);
    for (_id in users) {
      user = users[_id];
      _.defaults(user, {
        username: _id,
        isNew: false,
        isAliasedByMixpanel: true,
        emails: [
          {
            address: _id.toLowerCase() + "@example.com",
            verified: true
          }
        ],
        createdAt: lastWeek
      });
      _.defaults(user.profile, {
        avatarUrl: `/images/avatars/${_id.replace("User", "")}.jpg`
      });
    }
  },

  post(users, Users) {
    let _id, now, user;
    now = new Date();
    for (_id in users) {
      user = users[_id];
      Accounts.setPassword(_id, "123123");
      Users.update(_id, {
        $push: {
          "services.resume.loginTokens": {
            hashedToken: Accounts._hashLoginToken(_id),
            when: now
          }
        }
      });
    }
  }
}
