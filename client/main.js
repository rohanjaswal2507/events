//Subscription to the various collections published by Server
Meteor.subscribe("events");
Meteor.subscribe("posters");
//Meteor.subscribe("users");



// Routes and their configuration
Router.configure({
  layoutTemplate: 'ApplicationLayout'
});

Router.route('/', function(){
  $('head').append( '<title>NITH Events Portal</title>' );
  this.render("navbar", {to:"header"});
  this.render("eventList", {to:"main"});
});

Router.route('/pastEvents', function(){
  $('head').append( '<title>NITH Events Portal</title>' );
  this.render("navbar", {to:"header"});
  this.render("pastEventList", {to:"main"});
});
Router.route('/event/:_id', function(){
  Session.set("eventId", this.params._id);
  this.render("navbar", {to:"header"});
  this.render("eventPage", {to:"main"});
});

Router.route('/addEvent', function(){
  this.render("navbar", {to:"header"});
  if(Meteor.userId()){
    this.render("addEventForm", {to:"main"});
  } else {
    this.render("loginForm", {to:"main"});
  }
});

Router.route('/editEvent/:_id', function(){
  Session.set("eventId", this.params._id);
  this.render("navbar", {to:"header"});
  eventData = Events.findOne({_id:this.params._id});
  if(eventData.author == Meteor.userId()){
    this.render("editEventForm", {to:"main"});
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

    //eventList = Events.find({}).sort({startTime: 1});
    date = Session.get("current_date");
    date = Date.parse(date);
    date = date.toString();
    eventList = Events.find({startTime: {$gt: date}}, {"sort" : {'startTime':1}} );
    return eventList;
  },
  posterUrl: function(posterId){
    file = Posters.findOne({_id:posterId});
    fileURL = file.url();
    //eventData = Events.findOne({poster:posterId});
    //file.title = eventData.title;
    return fileURL;
  }
});

Template.eventPage.helpers({
  eventData: function(){
    Event = Events.findOne({_id:Session.get("eventId")});
    Event.begin = new Date(Event.startTime);
    $('head').append( '<title>'+Event.title+' - NITH Events Portal</title>' );
    return Event;
  },
  calStartTime: function(){
    eventData = Events.findOne({_id:Session.get("eventId")});
    eDate = eventData.startTime;
    date = new Date(parseInt(eDate));
    hour = date.getHours();
    min = date.getMinutes();
    if(min < 10){
      min = "0" + min.toString();
    }
    if(hour > 12){
      hour = hour%12;
      return hour + ":" + min + " PM";
    } else {
      return hour + ":" + min + " AM";
    }
  },
  calEndTime: function(){
    eventData = Events.findOne({_id:Session.get("eventId")});
    eDate = eventData.endTime;
    date = new Date(parseInt(eDate));
    hour = date.getHours();
    min = date.getMinutes();
    if(min < 10){
      min = "0" + min.toString();
    }
    if(hour > 12){
      hour = hour%12;
      return hour + ":" + min + " PM";
    } else {
      return hour + ":" + min + " AM";
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
    log(Session.get("eventId"));
    Event = Events.findOne({_id:Session.get("eventId")});
    Event.begin = new Date(Event.startTime);
    return Event;
  },

});
Template.eventDate.helpers({
  day: function(eDate){
    date = new Date(parseInt(eDate));
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
    date = new Date(parseInt(eDate));
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
    file = Posters.findOne({_id:posterId});
    fileURL = file.url();
    eventData = Events.findOne({poster:posterId});
    file.title = eventData.title;
    return file;
  },
  eventTitle: function(title){
    return title;
  }
});

Template.afQuickField.events({
  'change .fileInput': function(event, template) {
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


// Past Events template helpers

Template.pastEventList.helpers({
  events: function(){

    //eventList = Events.find({}).sort({startTime: 1});
    date = Session.get("current_date");
    date = Date.parse(date);
    date = date.toString();
    eventList = Events.find({startTime: {$lt: date}}, {"sort" : {'startTime':-1}} );
    return eventList;
  },
  posterUrl: function(posterId){
    file = Posters.findOne({_id:posterId});
    fileURL = file.url();
    //eventData = Events.findOne({poster:posterId});
    //file.title = eventData.title;
    return fileURL;
  }
});


Template._loginButtonsLoggedOutPasswordService.showCreateAccountLink = function () {
  return Accounts._options.forbidClientAccountCreation;
};



Template.editEventForm.helpers({
  eventTitle: function(){
    eventData = Events.findOne({_id:Session.get("eventId")});
    return eventData.title;
  },
  autoSaveMode: function () {
    return Session.get("autoSaveMode") ? true : false;
  },
  selectedEvent: function () {
    return Events.findOne(Session.get("eventId"));
  },
  isSelectedEvent: function () {
    return Session.equals("eventId", this._id);
  },
  formType: function () {
    if (Session.get("eventId")) {
      return "update";
    } else {
      return "disabled";
    }
  },
  disableButtons: function () {
    return !Session.get("eventId");
  }
});

Template.editEventForm.events({
  'click .person-row': function () {
    Session.set("eventId", this._id);
  },
  'change .autosave-toggle': function () {
    Session.set("autoSaveMode", !Session.get("autoSaveMode"));
  }
});
