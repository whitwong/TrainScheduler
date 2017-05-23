// Initialize Firebase
var config = {
  apiKey: "AIzaSyBTEYvtoqeo5iHwWDim_rif0GnSvep2mXY",
  authDomain: "trainhw-7c836.firebaseapp.com",
  databaseURL: "https://trainhw-7c836.firebaseio.com",
  projectId: "trainhw-7c836",
  storageBucket: "trainhw-7c836.appspot.com",
  messagingSenderId: "339587231309"
};
firebase.initializeApp(config);

//Run functions
$(document).ready(function(){
  //Variable for database
  var database = firebase.database(); 

  //Initial values
  var name = "";
  var destination ="";
  var time ="";
  var frequency = 0;
  var firstTime;
  
  //Submit function
  $("#submit").on("click", function(event) {
    event.preventDefault();

    //Store input values into variables
    name = $("#name-input").val().trim();
    destination = $("#destination-input").val().trim();
    time = $("#time-input").val().trim();
    firstTime = moment(time, "HH:mm").format();
    frequency = parseInt($("#frequency-input").val().trim());

    //Initial database reference
    database.ref().push({
      dataName: name,
      dataDestination: destination,
      dataTime: firstTime,
      dataFrequency: frequency
    });

    //Clear input fields after submitting information
    $("#name-input").val("");
    $("#destination-input").val("");
    $("#time-input").val("");
    $("#frequency-input").val("");
  });

  //On-value function
  database.ref().on("child_added", function(childSnapshot){
    //Variables
    var child = childSnapshot.val();
    var nextArrival;
    var minAway;

    // Time math
    if (moment(child.dataTime).unix() < moment().unix()) {
      minAway = child.dataFrequency-((moment().diff(moment(child.dataTime), "minutes"))%child.dataFrequency);
      nextArrival = moment(moment().add(minAway, "minutes")).format("hh:mm A");
    }
    else {
      nextArrival = moment(child.dataTime).format("hh:mm A");
      minAway = moment(child.dataTime).diff(moment(), "minutes");
    }

    //Table population and display
    var table = $("<tr class='"+ childSnapshot.key +"'>");
    $("#table-display").append(table);
    table.append("<td><button class='remove' id='"+ childSnapshot.key + "'>" + "Delete" + "</button></td>");
    table.append("<td>" + child.dataName + "</td>");
    table.append("<td>" + child.dataDestination + "</td>");
    table.append("<td>" + child.dataFrequency + "</td>");
    table.append("<td>" + nextArrival + "</td>");
    table.append("<td>" + minAway + "</td>");

    //Error handling
  }, function(errorObject) {
  console.log("The read failed: " + errorObject.code);
  });

  //Removing train information and deleting information from database
  $(document).on("click", ".remove", function(){
    var dataKey=$(this).attr("id");
    database.ref().child(dataKey).remove();
  });

  database.ref().on("child_removed", function(snapshot){
    $("."+snapshot.key).remove();
    }, function(errorObject) {
    console.log("The read failed: " + errorObject.code);
  });
});