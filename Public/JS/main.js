//GLOBAL VARIABLES
var currentAction; 
var currentActionWPID; 
var currentStatus = ""; 
var vehicleBusy = false; 
var waitingActions = [];


const rad2deg =180/Math.PI;

var wpId = 001; 
const defaultDepth = 0; 



//FUNCTIONS


//Controlling the side menu

function openNav() {
  document.getElementById("mySidenav").style.right = "0";
  document.getElementById("mySidenav").style.opacity = 1;
//    document.getElementById("mySidenav").style.display = "inline-block";

}


function closeNav() {
  document.getElementById("mySidenav").style.right = "-250px";
    document.getElementById("mySidenav").style.opacity = 0;
//        document.getElementById("mySidenav").style.display = "none";

}


function resetContent(){
  var mapSwitch = document.getElementById("mapSwitch"); 
  var wayPointSwitch  =document.getElementById("wayPointSwitch");
  var LAUVStatusSwitch  = document.getElementById("LAUVStatusSwitch"); 

  if(mapSwitch.checked){
    Map.showModule();
  }else{
   Map.hideModule();
 }

 if(wayPointSwitch.checked){
  MissionPlan.showModule();
}else{
  MissionPlan.hideModule();
}

if(LAUVStatusSwitch.checked){
  VehicleOverview.showModule();

}else{
  VehicleOverview.hideModule();
}
}


window.onload = console.log("Initializing Mission Control System");

var prev_handler = window.onload; 
window.onload = function () {
  if (prev_handler) {
    prev_handler();
  }
  Map.onLoad();
  VehicleOverview.onLoad();
};



document.getElementById("abortButton").onclick = function(){
  abortAction();


}


function abortAction(){
 Communication.abortAction(currentAction);

      map.removeLayer(markerArray[currentActionWPID-1]);
     
     MissionPlan.actionAborted(currentActionWPID);

     //move to vehicle overview
     VehicleOverview.updateCurrentAction("N/A");
    VehicleOverview.updateProgress(0);

     currentActionWPID=""; 
     currentAction=""; 
     currentStatus=""; 
 vehicleReady();
}

document.getElementById("resetBtn").onclick = function(){
  resetMission();
}


function onMapClick(e){

	var inputDepth = prompt("Please enter the desired depth for the new way point. (Default is 0 m if a valid number is not set)" , "eg. 10"); 
    var depth = parseInt(inputDepth);
  if (isNaN(depth) || depth < 0 ){
		return
  }


  wpId += 1;
  var actionRequest = e;

  Map.addMarker(wpId-1, e);


  actionRequest.depth = depth; 


  MissionPlan.addAction(wpId-1, actionRequest);


  //sending request or storing it for later if vehicle busy 
  if(!vehicleBusy){
    vehicleBusy=true;
    sendWP(wpId-1, actionRequest); 
  }else{
    MissionPlan.addWaitingAction(wpId-1, actionRequest);
  }
}


function sendWP(wpId, e){
  Map.updateMarkerCol('red');
  Communication.sendWP(wpId, e);

}


function setState(str, progress){
 currentStatus=str; 

 if(progress> 0){
  VehicleOverview.updateProgress(progress);
}
if(currentStatus=="FINISHED"){
  VehicleOverview.updateVehicleState('Ready');
  Map.removeMarker(currentActionWPID-1);

  currentStatus=""; 
  MissionPlan.setMissionComplete(currentActionWPID);

  VehicleOverview.updateCurrentAction("");
  VehicleOverview.updateProgress(0);

  vehicleReady();

}else{

  setTimeout(function(){
    checkActionStatus(); 
  },2000)
}

}


function checkActionStatus(){
Communication.getActionStatus();

  if(currentStatus=="EXECUTING"){
    Map.updateMarkerCol('red');
    VehicleOverview.updateVehicleState('Maneuvering');
  }
}


function vehicleReady(){

  VehicleOverview.updateVehicleState('Busy');
  Map.updateMarkerCol('yellow');

  setTimeout(function(){

    if(waitingActions.length > 1){
      vehicleBusy=true;

      Map.updateMarkerCol('red');

      //extraction id and request
      var res = MissionPlan.getWaitingAction();
      sendWP(res[0], res[1]);
    }else{
     vehicleBusy=false;

     Map.updateMarkerCol('green');
     VehicleOverview.updateVehicleState('Ready');
   }
 },4000) 

}


function resetMission(){
  var rowCount = MissionPlan.getMissionLength();

  if(!vehicleBusy){ 
    wpId = 001; 
    for (var i = rowCount - 1; i >= currentActionWPID; i--) {
      MissionPlan.removeAction(i);
      Map.removeMarker(i);

    }

  }else{
    MissionPlan.resetWaitingActions();
      abortAction();

      wpId=001;
    
    for (var i = rowCount - 1; i > currentActionWPID; i--) {
      MissionPlan.removeAction(i);
      Map.removeMarker(i-1);

    }
  }
}


function updateVehiclePos(lat, lng, z, t){
  VehicleOverview.updateVehiclePosition(lat*rad2deg, lng*rad2deg, z, t);
  Map.updateMarker(lat*rad2deg, lng*rad2deg);
}


function updateRobotSituation(id, speed, x, y, z, w){
  VehicleOverview.updateOverviewHeader(id);
  VehicleOverview.updateVehicleVel(speed);
  var heading = Math.atan2((2*x*y)-(2*z*w),1-2*(Math.pow(y,2)+Math.pow(z,2))); //converting from quaternions to radians
	Map.updateHeading(-heading*rad2deg);

 // var heading = Math.atan2((2*x*y)-(2*z*w),1-2*(Math.pow(y,2)+Math.pow(z,2))); //converting from quaternions to radians
  //LAUVMarker.setIconAngle( - heading*rad2deg); //consider adding - 20.  //HERE 
 


}