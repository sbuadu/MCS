var MissionPlan = (function() {

	var addTableRow = function(i,e) {

		var table = document.getElementById("wpTable"); 
		var rowCount = document.getElementById('wpTable').rows.length;

		var row = table.insertRow(rowCount)

		var cell1=row.insertCell(0); 
		var cell2=row.insertCell(1); 
		var cell3=row.insertCell(2); 
		var cell4=row.insertCell(3); 
		var cell5=row.insertCell(4); 
		var cell6=row.insertCell(5); 

		cell1.innerHTML=  i.toString(); 
		cell2.innerHTML = e.latlng.lat.toString().substring(0,9) + " &#xb0"; 
		cell3.innerHTML= e.latlng.lng.toString().substring(0,9) + " &#xb0";
		cell4.innerHTML = e.depth + " m"; 
		cell5.innerHTML = '<img src="Images/no.png" alt=""  height=21px></img>';
	}

	var actionAborted = function(){

		table =document.getElementById('wpTable'); 
		table.rows[currentActionWPID].cells[5].innerHTML = '<img src="Images/no.png" alt="" height=21px></img>'; 
	}

	var actionRemoved = function(actionId){
		document.getElementById("wpTable").deleteRow(actionId); 
	}

	var getTableLength = function(){
		return document.getElementById('wpTable').rows.length;
	}

	
	var addWaitingAction = function(id, request){
		waitingActions.push(id);
		waitingActions.push(request);
	}

	var getWaitingAction = function(){
		var id=waitingActions.shift(); 
    	var request = waitingActions.shift(); 
		return [id, request];
	}

	var resetWaitingActions = function(){
  		waitingActions = []; 
	}

	var setMissionComplete =  function(i){
		table =document.getElementById('wpTable'); 
		if( table.rows[i].cells[5].innerHTML == ''){
			table.rows[i].cells[5].innerHTML = '<img src="Images/yes.png" alt="" height=21px></img>';
		} 

	}

	var setMissionReceived = function(i){
   var table = document.getElementById('wpTable'); 
  table.rows[i].cells[4].innerHTML = '<img src="Images/yes.png" alt="" height=21px></img>'; 
  
	}

	var showModule = function(){
		document.getElementById("gridItemTable").style.display ="block";
	}

	var hideModule = function(){
		document.getElementById("gridItemTable").style.display ="none";
	}


	return {
		addAction: addTableRow, 
		actionAborted: actionAborted,
		removeAction : actionRemoved,
		getMissionLength : getTableLength,
		showModule : showModule,
		hideModule : hideModule,
		addWaitingAction : addWaitingAction,
		getWaitingAction : getWaitingAction,
		resetWaitingActions : resetWaitingActions, 
		setMissionComplete : setMissionComplete,
		setMissionReceived : setMissionReceived

	};

})();
