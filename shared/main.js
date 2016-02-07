Meteor.methods({
  addEvent: function(newEvent){
    console.log("addEvent method running");
    if (Meteor.userId()){
      newEvent.startTime = Date.parse(newEvent.startTime);
      newEvent.endTime = Date.parse(newEvent.endTime);
      newEvent.author = Meteor.userId();
      newEvent.something = "something";
      console.log(newEvent.something);
      Events.insert(newEvent);
    } else {
      alert("Please Login First!");
    }
  }
});
