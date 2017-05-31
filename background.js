
// TODO: upload image as such instead of url 
// read the latest time from database



 var config = {
    apiKey: "AIzaSyA29-7KAZWoHRkAndJKj4yq-i2h2UsKYWg",
    authDomain: "schedule-c07db.firebaseapp.com",
    databaseURL: "https://schedule-c07db.firebaseio.com",
    projectId: "schedule-c07db",
    storageBucket: "schedule-c07db.appspot.com",
    messagingSenderId: "997485096643"
  };
  firebase.initializeApp(config);
    var database = firebase.database();
    var interval = 30*60;

    function getScheduledTime(callback) {
       readData(
            function(prevTime) {
                console.log(prevTime);
                var nextTime = prevTime + interval;
                // nextTime = getCorrectedTime(nextTime);
                writeData(nextTime);
                callback(nextTime);
            }
        );
    }

  function readData(callback) {
   database.ref('/schedule/').once('value').then(function(snapshot){
    callback(snapshot.val());
   });
  }

  function writeData(value) {
    var obj = {
        'schedule' : value
    }
    database.ref('/').update(obj);
    console.log('written next time '+ value);
  }

 var schedulePost = function(image){
     console.log(image.srcUrl);
     var success = function(){
        console.log("successfully posted");
    }
    var pageId = 1884816475065657;
    var baseDomain = "https://graph.facebook.com";
    var pageAccessToken = "EAAEw28ggKzcBAEQFUt6qvii3IDHEZA2G1WtMlDJEDEM11BqhbbwgOEz3hgAPwnGkZCZAuEquDVpdZB9f5Sk4xgAVeiv4RN9h2XFBNP5FniqvOjB3bId0Pt53eYbwM9aBm3GUQb5EJZCzfiEHAq3mGxZBP2OUJZCp380lPtO7mQdhgZDZD";
    var url = baseDomain+"/"+pageId+"/photos?access_token="+pageAccessToken;
    getScheduledTime(function(scheduledTime){
        var data = {
            "page_access_token": pageAccessToken,
            "url": image.srcUrl, 
            "scheduled_publish_time": scheduledTime,
            "published": false
        };
        $.ajax({
        type: "POST",
        url: url,
        data: data,
        success: success,
        dataType: "json"
    });
    });
 };

chrome.contextMenus.create({
 title: "Schedule post",
 contexts:["image"],  // ContextType.. video context menu is somehow fucking up.. mostly because fb is overriding it
 onclick: schedulePost // A callback function
});