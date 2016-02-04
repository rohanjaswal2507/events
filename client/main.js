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
  if(Meteor.userId()){
    this.render("addEventForm", {to:"main"});
  } else {
    this.render("loginForm", {to:"main"});
  }
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
  },
  posterUrl: function(posterId){
    console.log("Poster: "+posterId);
    file = Posters.findOne({_id:posterId});
    fileURL = file.url();
    //eventData = Events.findOne({poster:posterId});
    //file.title = eventData.title;
    return fileURL;
  }
});

Template.eventPage.helpers({
  eventData: function(){
    //console.log(Session.get("eventId"));
    Event = Events.findOne({_id:Session.get("eventId")});
    Event.begin = new Date(Event.startTime);
    return Event;
  },
  calStartTime: function(){
    eventData = Events.findOne({_id:Session.get("eventId")});
    eDate = eventData.startTime;
    date = new Date(Date.parse(eDate));
    hour = date.getHours();
    min = date.getMinutes();
    if(hour > 12){
      hour = hour%12;
      return hour + min + " PM";
    } else {
      return hour + min + " AM";
    }
  },
  calEndTime: function(){
    eventData = Events.findOne({_id:Session.get("eventId")});
    eDate = eventData.endTime;
    date = new Date(Date.parse(eDate));
    hour = date.getHours();
    min = date.getMinutes();
    if(hour > 12){
      hour = hour%12;
      return hour + min + " PM";
    } else {
      return hour + min + " AM";
    }
  }
});


Template.authorTemplate.helpers({
  name: function(author){
    club = Meteor.users.findOne({_id:author});
    return club.profile["first-name"];
  }
});

Template.eventTiming.helpers({
  eventData: function(){
    console.log(Session.get("eventId"));
    Event = Events.findOne({_id:Session.get("eventId")});
    Event.begin = new Date(Event.startTime);
    return Event;
  },

});
Template.eventDate.helpers({
  day: function(eDate){
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
    return months[month] + " " + day;
  },
  time: function(){

  }
});

/*Template.eventTime.helpers({
  time: function(){
    console.log("date at eventTime helper: " + eDate)
    eventData = Events.findOne({_id:Session.get("eventId")});
    eDate = Events.startTime;
    date = new Date(Date.parse(eDate));
    hour = date.getHours();
    min = date.getMinutes();
    if(hour > 12){
      hour = hour%12;
      return hour + min + " PM";
    } else {
      return hour + min + " AM";
    }
  }
});*/

Template.eventPoster.helpers({
  posterUrl: function(posterId){
    console.log("Poster: "+posterId);
    file = Posters.findOne({_id:posterId});
    fileURL = file.url();
    eventData = Events.findOne({poster:posterId});
    file.title = eventData.title;
    return file;
  },
  eventTitle: function(title){
    console.log("title: "+title);
    return title;
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
