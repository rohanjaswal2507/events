Meteor.startup(function () {
  // code to run on server at startup
  Meteor.publish("events", function(){
    return Events.find({});
  });
  Meteor.publish("posters", function(){
    return Posters.find({});
  });

  Posters.allow({
  'insert': function () {
    // add custom authentication code here
    return true;
  }
});
});
