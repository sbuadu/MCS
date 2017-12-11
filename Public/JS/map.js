
//gobal variables
var map;
var LAUVMarker;
var markerArray = [];  //move to map


var Map = (function() {



	var RedIcon =L.icon({
		iconUrl: 'Images/redMarker.png',
		iconSize:     [45, 50], 
		iconAnchor:   [22.5, 25], 
	});


	var YellowIcon =L.icon({
		iconUrl: 'Images/yellowMarker.png',
		iconSize:     [45, 50], 
		iconAnchor:   [22.5, 25],   
	});



	var GreenIcon =L.icon({
		iconUrl: 'Images/greenMarker.png',
		iconSize:     [45, 50], 
		iconAnchor:   [22.5, 25],
	});



//Functions 

var setMap = function(){
	map = L.map('map').setView([63.441138, 10.349211], 15.5);
	/*var basemapUrl='https://api.mapbox.com/styles/v1/mapbox/streets-v10/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWF0aGlsZG8iLCJhIjoiY2lrdHZvMHdsMDAxMHdvbTR0MWZkY3FtaCJ9.u4bFYLBtEGNv4Qaa8Uaqzw';
	L.tileLayer(basemapUrl).addTo(map);*/
	map.on('click', onMapClick); 

}


var addWpMarker = function(id, e){
	var newMarker = new L.marker(e.latlng).addTo(map).on("mouseover", showPopup);
	newMarker.bindPopup( "Waypoint: " + id ).openPopup(); 

	markerArray[id-1]= newMarker; 

	setTimeout(function(){
		newMarker.closePopup(); 
	}, 2000);
}

var showPopup = function(e){
	e.target.openPopup(); 

	setTimeout(function(){
		e.target.closePopup(); 
	}, 500);
}


var removeWpMarker = function(i){
	map.removeLayer(markerArray[i]); 
}

var updateMarker = function(lat, lng){
	if (!LAUVMarker){
    	LAUVMarker =  L.marker([lat, lng], {icon: GreenIcon}).addTo(map);//HERE
  
	}else{
		var newLatLng = new L.LatLng(lat, lng); 
		LAUVMarker.setLatLng(newLatLng); 
	}
}

var rotateMarker = function(angle){
	if(LAUVMarker){
	LAUVMarker.setIconAngle( angle); 
}
}

var setMarkerColor = function(color){

	switch(color) {
		case 'red':
		LAUVMarker.setIcon(RedIcon);
		break;
		case 'yellow':
		LAUVMarker.setIcon(YellowIcon); 

		break;
		case 'green':
		LAUVMarker.setIcon(GreenIcon);
		break;

		default:
	}
}

var hideModule = function(){
	document.getElementById("gridItemMap").style.display ="none";
}

var showModule = function(){
	document.getElementById("gridItemMap").style.display ="block";
}

return {
	updateMarkerCol : setMarkerColor,
	hideModule : hideModule,
	showModule : showModule,
	onLoad : setMap, 
	addMarker : addWpMarker,
	removeMarker : removeWpMarker, 
	updateMarker : updateMarker,
	updateHeading : rotateMarker

};

})();