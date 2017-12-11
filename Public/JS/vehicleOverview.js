
var VehicleOverview = (function() {


	var velocity = ""; 
	var vehicleName = ""; 
	var latitude; 
	var longitude; 
	var state;
	var progress;
	var altitudeVector = []; 

	var altitudeGraph  = new CanvasJS.Chart("altitudeGraph",{
	  title:{text: "Vehicle Depth"
	}, 
	axisY:{
	  title:"Depth",
	  reversed: true
	}, 
	data:[{
	  markerType:"none", 
	  type: "spline", 
	  dataPoints: altitudeVector
	}]
	}); 



	var setVelocity = function(vel) {
		velocity = vel.toString();

		document.getElementById("VelMsg").innerHTML = velocity.substring(0,4); 
	}

	var setVehicleName = function(header){
		vehicleName = header; 
		document.getElementById("overviewHeaderData").innerHTML = vehicleName;
	}

	var setPosition = function(lat, lng, z, t){
		latitude = lat.toString(); 
		longitude = lng.toString();

		document.getElementById("LatMsg").innerHTML =latitude.substring(0,9);
		document.getElementById("LonMsg").innerHTML = longitude.substring(0,9);

		altitudeVector.push({x: new Date(t), y: z});  

		if(altitudeVector.length > 100){
			altitudeVector.shift();
		}
		altitudeGraph.render();

	}

	var setState = function(s){
		state = s; 
		document.getElementById('stateTxt').innerHTML = state; 
	}


	var setProgress = function(p){
		progress = p; 
		
		if (progress== 0){
			document.getElementById('progressPercentage').innerHTML= "";
		}else{
			document.getElementById('progressPercentage').innerHTML = Math.floor(progress) + "%";
	  	}
	  	
	  	document.getElementById('progressBar').style.width = Math.floor(progress) + "%";
	}

	var setCurrentAction = function(str){
		document.getElementById('currentActionTxt').innerHTML = str;
	}


	var onLoad = function(){
		  altitudeGraph.render();

	}

	var showModule = function(){
		document.getElementById("gridItemOverview").style.display ="block";
	}

	var hideModule = function(){
	    document.getElementById("gridItemOverview").style.display ="none";
	}

	return {
		updateVehicleVel: setVelocity, 
		updateOverviewHeader : setVehicleName, 
		updateVehiclePosition : setPosition,
		updateVehicleState : setState,
		onLoad : onLoad,
		hideModule : hideModule,
		showModule : showModule,
		updateProgress : setProgress,
		updateCurrentAction : setCurrentAction
	};

})();