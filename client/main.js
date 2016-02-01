//Subscription to the various collections published by Server
Meteor.subscribe("events");
Meteor.subscribe("posters");
//Meteor.subscribe("users");



// Routes and their configuration
Router.configure({
  layoutTemplate: 'ApplicationLayout'
});

Router.route('/', function(){
  console.log("rendering /");
  this.render("navbar", {to:"header"});
  this.render("eventList", {to:"main"});
});

Router.route('/event/:_id', function(){
  console.log('rendering an Event page with id: ' + this.params._id);
  Session.set("eventId", this.params._id);
  this.render("navbar", {to:"header"});
  this.render("eventPage", {to:"main"});
});

Router.route('/addEvent', function(){
  console.log("Rendering add Event page");
  this.render("navbar", {to:"header"});
  this.render("addEventForm", {to:"main"});
});

Meteor.setInterval(function(){
  Session.set("current_date", new Date());
}, 1000);


Template.addEventForm.helpers({
  current_date: function(){
    return Session.get("current_date");
  },
  author: function(){
    return Meteor.userId();
  }
});

Template.eventList.helpers({
  events: function(){
    console.log("Events queried");
    //eventList = Events.find({}).sort({startTime: 1});
    eventList = Events.find({}, {"sort" : {'startTime':1}} );
    //console.table(eventList);
    return eventList;

  }
});

Template.eventPage.helpers({
  eventData: function(){
    console.log(Session.get("eventId"));
    Event = Events.findOne({_id:Session.get("eventId")});
    Event.begin = new Date(Event.startTime);
    return Event;
  }
});


Template.authorTemplate.helpers({
  name: function(author){
    club = Meteor.users.findOne({_id:author});
    return club.profile["first-name"];
  }
});

Template.eventDate.helpers({
  day: function(eDate){
    console.log(eDate);
    date = new Date(eDate);
    days = {
      "1" : "Mon",
      "2" : "Tue",
      "3" : "Wed",
      "4" : "Thu",
      "5" : "Fri",
      "6" : "Sat",
      "0" : "Sun",
    };
    return days[date.getDay()];
  },
  date: function(eDate){
    date = new Date(eDate);
    months = {
      "0" : "Jan",
      "1" : "Feb",
      "2" : "Mar",
      "3" : "Apr",
      "4" : "May",
      "5" : "Jun",
      "6" : "Jul",
      "7" : "Aug",
      "8" : "Sep",
      "9" : "Oct",
      "10" : "Nov",
      "11" : "Dec"
    };
    month = date.getMonth();
    day = date.getDate();
    console.log(day);
    return months[month] + " " + day + ", " + (1900+date.getYear());
  },
  time: function(){

  }
});

Template.eventPoster.helpers({
  posterUrl: function(poster){
    console.log(poster);
    file = Posters.findOne({_id:poster});
    console.log(file);
    return file;
  }
});

Template.afQuickField.events({
  'change .fileInput': function(event, template) {
    console.log("event called");
    FS.Utility.eachFile(event, function(file){
      var fileObj = new FS.File(file);
      Posters.insert(fileObj, function(err, fileObj){
          if(!err){
            console.log(fileObj);
          }
        });
      });
    }
});
