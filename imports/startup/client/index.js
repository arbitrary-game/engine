Meteor.startup(function() {
  Tracker.autorun(function() {
    const user = Meteor.user();
    if (!user) return;
    mixpanel.identify(user._id);

    const person = {
      "Name": user.profile.name,
      $first_name: user.profile.name,
      "$email": user.emails[0].address,
    };

    mixpanel.people.set(person);
  });
});