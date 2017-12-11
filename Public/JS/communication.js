var Communication = (function() {
  const deg2rad  =Math.PI/180;


// ROS node
var ros = new ROSLIB.Ros({
 url : 'ws://localhost:9090'
});

ros.on('connection', function() {
  console.log('Connected to websocket server.');
});

ros.on('error', function(error) {
  console.log('Error connecting to websocket server: ', error);
});

ros.on('close', function() {
  console.log('Connection to websocket server closed.');
});



//ROS Service Caller objects
var goToSimpleCaller = new ROSLIB.Service({
  ros : ros,
  name : '/GotoSimple',
  serviceType : 'rsi_lauv_ntnu/runGotoSimple' 
});

var abortActionCaller = new ROSLIB.Service({
  ros : ros,
  name : '/abort_Action',
  serviceType : 'g2s_interface/abort_Action'
});

var checkActionCaller = new ROSLIB.Service({
  ros : ros,
  name : '/actionStatus',
  serviceType : 'g2s_interface/actionStatus' 
});


//ROS Topic Listener objects
var robotPosSimpleListener = new ROSLIB.Topic({
  ros : ros,
  name : '/robotPosSimple',
  messageType : 'rsi_lauv_ntnu/robotPosSimple'
});

var robotSituationListener = new ROSLIB.Topic({
  ros : ros,
  name : '/robotSituation',
  messageType : 'g2s_interface/robotSituation'
});


//subscribing
robotPosSimpleListener.subscribe(function(message) {
  var t = message.header.stamp.secs*1000 + message.header.stamp.nsecs*0.000001; 
  updateVehiclePos(message.pos.x, message.pos.y, message.pos.z, t); 
  
});


robotSituationListener.subscribe(function(message){
	updateRobotSituation(message.header.frame_id, message.robotSpeed, message.robotPose.orientation.x, message.robotPose.orientation.y, message.robotPose.orientation.z, message.robotPose.orientation.w);
}); 


var abortActionRequest = function(currentAction){

  if (currentAction >= 0){
    var request = new ROSLIB.ServiceRequest(); 
    request.actionId = currentAction;

    abortActionCaller.callService(request,function(result){

   });
  }

}


var sendActionRequest = function(wpId, e){

  currentStatus="";
  var now = Date.now();


  var request = new ROSLIB.ServiceRequest(); 
  request.pos = {x:e.latlng.lat*deg2rad , y: e.latlng.lng*deg2rad, z:e.depth}
  
  //sending a service call 
  goToSimpleCaller.callService(request, function(result) {
   console.log(" Action: " + wpId + "\n Lat: " + e.latlng.lat + "\n Lon: " + e.latlng.lng + "\n Depth: " + e.depth +  "\n Time: " + now);
   

   VehicleOverview.updateCurrentAction(wpId);
   
   
   currentAction = result.actionId; 
   currentActionWPID=wpId;

   if(result.actionId > -1){
    MissionPlan.setMissionReceived(currentActionWPID);

  }

});

  setTimeout(function(){
    checkActionStatus(); 
  },500)

}


var actionStatusRequest = function(){
  var request = new ROSLIB.ServiceRequest(); 
  request.actionId = currentAction;

  checkActionCaller.callService(request, function(result){

  var actionStatus=result.actionStatus;
  var progress=result.progress;
  setState(actionStatus, progress);

});

}

return {
  sendWP: sendActionRequest,
  abortAction: abortActionRequest,
  getActionStatus: actionStatusRequest
};

})();



