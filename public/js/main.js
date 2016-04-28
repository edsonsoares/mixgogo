var empty = true;
var notPlaying = true;

// CUSTOM JS FILE //
// This is where frontend Javascript runs //

function init() {
	pullData();
	soundcloudSDK();
}


function initEvent(){
	soundcloudSDK();
	renderEvent();
}

function initSubscribe() {
	//renderNextFour();
	renderCopyright();
}
 

function initAdd() {
	preventEnter();
	googleMaps();
}



// FEED & PLAYER //
//Let's pull the data MongoDB
function pullData(){

	console.log('Pulling the Data:');

	jQuery.ajax({
		url : '/api/get/',
		dataType : 'json',
		success : function(response) {
			
			// console.log('got data: ');
			// console.log(response);
			var sets = response.sets;
			
			// Pass out the index
			var currentSet = 0;
			
			for(var i=0; i< sets.length; i++){		
				sets[currentSet].index = currentSet;
	           	//console.log("Esse é o index");
	           	//console.log(i);
				// renderCards(sets[currentSet]);
	           	renderDateTitle(sets[currentSet]);
	           	currentSet++;  	
	        }
		}
	});

	pullDays();
	
}



//create an category/object of a date
var aDay = {}

function renderDateTitle(currentSet){

	//console.log('inside render date');

	var dateTitle = moment(currentSet.dateEvent, 'YYYY-MM-DD').format('ddd <br> D <br> MMM');

	var dateTitleToAdd = document.createElement('div');

		var html = 
				'<div class="col-md-3">'+
					'<div class="thumbnail center-block"><h1 class="date-title">'+ dateTitle + '</h1></div>' +
				'</div>';

	$(dateTitleToAdd).html(html)



	//If there is no Date Title for one specific day, create it
	if (!aDay[dateTitle]){
		//initialize category
		aDay[dateTitle] = {};
		//include an array of Sets
		aDay[dateTitle].sets = [];
		//include an array of thumbnails
		aDay[dateTitle].thumbnails = [];
		//Atribute this object to a div
		aDay[dateTitle].aDayContainer = document.createElement('div');

		$('#sets-container').append(aDay[dateTitle].aDayContainer);

		$(aDay[dateTitle].aDayContainer).append(dateTitleToAdd);

		//Gennerate an ID For this item
		$(dateTitleToAdd).attr('id', dateTitle + 'title' + aDay[dateTitle].sets.length);
	}

	//Add the current set to the array of Sets inside the aDay object
	aDay[dateTitle].sets.push(currentSet);

	//Append the container Date Title to the div recently created
	renderEvents(currentSet, dateTitle);

}




//RENDER EVENTS //
function renderEvents(currentSet, dateTitle){

	console.log("inside render");

	var thumbToAdd = document.createElement('div');

				var html = 
				'<div class="col-md-3">'+
					'<div id="artcover" class="thumbnail"><img src="'+currentSet.artcover+'">'+				
					'<input type="image" src="/img/site/event_play.png" class="bigplay" id="bigplay'+currentSet.index+'" alt="Play">'+
			        '<p><div class="text-uppercase"><a href="api/get/'+currentSet._id+'"><h2>' + currentSet.title + '</h2></a></div></p>' +
			        '<div class="track-thumb"><h2><small>' + currentSet.lineup.artist+'</small></h2></div>'+
				'</div>';
				

				$(thumbToAdd).html(html);

				// console.log(currentSet);

				// console.log( $("#bigplay"+currentSet.index) );

				// setTimeout(function() {
				// 	$("#bigplay"+currentSet.index).click(function(){
	  	// 				console.log('clicked!');
	  	// 				loadMixgogoPlayer(currentSet);
	  	// 			});
				// }, 1);

				
				aDay[dateTitle].thumbnails.push(thumbToAdd);

				$(aDay[dateTitle].aDayContainer).append(thumbToAdd);

				$("#bigplay"+currentSet.index).click(function(){
  					console.log('clicked!');
  					loadMixgogoPlayer(currentSet);
  				});

				//Generate an id for this item
  				$(thumbToAdd).attr('id', dateTitle + 'thumbnail' + aDay[dateTitle].thumbnails.length);
			
}




//RENDER NEXT 4 EVENTS //
function renderNextFour(){

	// console.log('Render Next 4 Events');

	// 			var thumbToAdd = 
	// 			'<div class="col-md-3">'+
	// 				'<div id="dateTitle">'+ currentSet.dateEvent + '</div>' +
	// 				'<div id="artcover" class="thumbnail"><img src="'+currentSet.artcover+'">'+				
	// 				'<input type="image" src="/img/site/event_play.png" class="bigplay" id="bigplay'+currentSet.index+'" alt="Play">'+
	// 		        '<p><div class="text-uppercase"><a href="api/get/'+currentSet._id+'"><h2>' + currentSet.title + '</h2></a></div></p>' +
	// 		        // '<div class="track-thumb"><h2><small>' + currentSet.lineup.artist+'</small></h2></div>'+
	// 			'</div>';

	// 			jQuery("#nextFour-holder").append(thumbToAdd);


	// 			$("#bigplay"+currentSet.index).click(function(){
 //  					console.log('clicked!');
 //  					loadMixgogoPlayer(currentSet);
 //  				});	 



console.log('Pull next four data');

	jQuery.ajax({
		url : '/api/get/subscribe',
		dataType : 'json',
		success : function(response) {
			
			console.log('got next four data: ');
			console.log(response);
			
			var sets = response.sets;
			
			// Pass out the index
			// var oneSet = 0;
			
			// for(var i=0; i< sets.length; i++){		
			// 	sets[one].index = currentSet;
	  //          	//console.log("Esse é o index");
	  //          	//console.log(i);


			// 	renderCards(sets[currentSet]);
	  //          	//renderDateTitle(sets[currentSet]);
	  //          	currentSet++;  	


		 //           	// if (i < 4) {
		 //           	// 	renderNextFour(sets[currentSet]);
		 //           	// }	         

	  //       }

		}
	});

}








//WEEK NAVIGATION //
// WEEK 1st STEP : Pull dates based on today

function pullDays(){
			
			var week = [0,1,2,3,4,5,6];
			var currentDay = 0;

			for(var i = 0; i < week.length; i++){
				week[currentDay].index = currentDay;
				currentDay++;
				renderWeek(week[currentDay]);

			}

			console.log('This is the CurentDay being passed -->');
			console.log(currentDay);

}




//WEEK 2nd STEP: Now fill in the other days of the week
function renderWeek(currentDay){

			//console.log('inside render week');
			var now = moment();
			var format = 'D <br> MMM';
			var result = moment(now).add(currentDay, 'day').format(format);
			//dayCounter++;
			var htmlToAdd = '<button type="button" class="btn btn-calendar btn-lg" id="day-holder">'+result+'</button></div>';

			jQuery("#dates-holder").append(htmlToAdd);
}



	
//WEEK 3rd STEP: move days forwad and backwards at week toolbar

$("#next-week").click(function(){
		pullDays();
		// console.log('Moved to Next Week');
	});




//initialize Soundcloud SDK
function soundcloudSDK(){

	console.log("SDK On!");

	SC.initialize({
    	client_id: "95761a6a9b70583b71e0f8436edc8db3",
    	//redirect_uri: "http://localhost:3000/callback.html",
    	redirect_uri: "https://mixgogo-prot.herokuapp.com/callback.html",
  	});
}
    


//When the user hit any of the big Play button
//Lets load Mixgogo's own player
function loadMixgogoPlayer(currentSet){

	console.log(empty);
	console.log(currentSet);


	if (empty == true) {

		//console.log("born empty")

		//console.log("Let's load Mixgogo awesome player!");

		var setArtwork = '<img src="'+currentSet.artcover+'" height="96" width="96">';
		document.getElementById("art-work").innerHTML = setArtwork;

		var setsInfo = '<h3>'+currentSet.title+'</h3>';
		//return $('#nav-sets').append(setsNav);
		document.getElementById("set-info").innerHTML = setsInfo;


		var track_url = currentSet.lineup.soundcloudUrl;
		$.get('http://api.soundcloud.com/resolve.json?url='+track_url+'&client_id=95761a6a9b70583b71e0f8436edc8db3', function (result) {
		  	var track_waveform = result.waveform_url;
		  	//document.getElementById("wave-form").innerHTML = track_waveform;
		  	$('#wave-form').empty().prepend('<img class="img-responsive player-btn" src="'+track_waveform+'" />');			
		});

	

		// var waveForm = '<img src="'+currentSet.waveform+'" height="80" width="300">';
		// document.getElementById("wave-form").innerHTML = waveForm;

		//console.log(playingNow.innerHTML);


		playNow(currentSet);

		empty = false;



	} else {


		// // document.getElementById("#player").innerHTML = '';
		// document.getElementById("art-work").innerHTML = '';

		var setArtwork = '<img src="'+currentSet.artcover+'" height="96" width="96">';
		$('#art-work').empty().prepend(setArtwork);

		var setsInfo = '<h3>'+currentSet.title+'</h3>';
		$('#set-info').empty().prepend(setsInfo);

		var waveForm = '<img src="'+currentSet.waveform+'" height="80" width="300">';
		$('#wave-form').empty().prepend(waveForm);

		var track_url = currentSet.lineup.soundcloudUrl;
		$.get('http://api.soundcloud.com/resolve.json?url='+track_url+'&client_id=95761a6a9b70583b71e0f8436edc8db3', function (result) {
		  	var track_waveform = result.waveform_url;
		  	$('#wave-form').empty().prepend('<img class="img-responsive player-btn" src="'+track_waveform+'" />');			
		});


		playNow(currentSet);


		// document.getElementById("set-info").innerHTML = '';

		// document.getElementById("wave-form").innerHTML = '';


		// var setArtwork = '<img src="'+currentSet.artwork+'" height="96" width="96">';
		// $('#art-work').append(setArtwork);

		// var setsInfo = '<h3>'+currentSet.title+'</h3>';
		// //return $('#nav-sets').append(setsNav);
		// $('#set-info').append(setsInfo);

		// document.getElementById("wave-form").innerHTML = '';

		//loadMixgogoPlayer(currentSet);


		// 	// document.getElementById("#player").innerHTML = '';
		// 	var setArtwork = '<img src="'+currentSet.artcover+'" height="96" width="96">';
		// 	document.getElementById("art-work").innerHTML = setArtwork;


		// 	var setsInfo = '<h3>'+currentSet.title+'</h3>';
		// 	//return $('#nav-sets').append(setsNav);
		// 	document.getElementById("set-info").innerHTML = setsInfo;

		// 	var waveForm = '<img src="'+currentSet.waveform+'" height="80" width="300">';
		// 	document.getElementById("wave-form").innerHTML = waveForm;


		// 	// var setArtwork = '<img src="'+currentSet.artwork+'" height="96" width="96">';
		// 	// $('#art-work').append(setArtwork);

		// 	// var setsInfo = '<h3>'+currentSet.title+'</h3>';
		// 	// //return $('#nav-sets').append(setsNav);
		// 	// $('#set-info').append(setsInfo);

		// 	var waveForm = '<img src="'+currentSet.waveform+'" height="80" width="300">';
		// 	$('#wave-form').append(waveForm);


		// console.log("WAVEFORM");
		// console.log(currentSet.waveform);
	}


	console.log("THIS SHOULD BE PLAYING--->" + currentSet)


}



//Once the player is loaded woth rigth Set, let's play its sound
function playNow (currentSet){

	// We need to get the Track Id from soundcloud (do not mistake with Set ID on the set database) 
	var track_url = currentSet.lineup.soundcloudUrl;
	console.log('Essa é a track_url');
	console.log(track_url);


	$.get('http://api.soundcloud.com/resolve.json?url='+track_url+'&client_id=95761a6a9b70583b71e0f8436edc8db3', function (result) {
		  	console.log("THIS IS THE RESULT ---->");
		  	console.log(result);
		  	var track_id = result.id;

			SC.stream('/tracks/'+track_id, function(sound){

				// Save this sound element in a object or somewhere in the page. If the element exists, 
				//stop it first, delete it, attach the coming element to the object and play the new one
				    if (window.currentSong){
				    	window.currentSong.pause();
				    	window.currentSong = null;
				    }
				    window.currentSong = sound;
					window.currentSong.play();
					console.log("Track playing-->" + track_id);	
			});
		});

	

	

	// if (empty == true) {
	// 	// With ajax we use the soundcloudUrl to access the tracks' JSON file, and find its id
	// 	$.get('http://api.soundcloud.com/resolve.json?url='+track_url+'&client_id=95761a6a9b70583b71e0f8436edc8db3', function (result) {
	// 		  	console.log("THIS IS THE RESULT ---->");
	// 		  	console.log(result);

	// 			var track_id = result.id;

	// 			SC.stream('/tracks/'+track_id, function(sound){
	// 				sound.play();
	// 				console.log("Track playing-->" + track_id);	
	// 			});
	// 		});


	// 	empty = false;

	// 	}else{
			
	// 		SC.sound.stop();

	// 		$.get('http://api.soundcloud.com/resolve.json?url='+track_url+'&client_id=95761a6a9b70583b71e0f8436edc8db3', function (result) {
	// 		  	console.log("THIS IS THE RESULT ---->");
	// 		  	console.log(result);

	// 			var track_id = result.id;

	// 			SC.stream('/tracks/'+track_id, function(sound){
	// 				sound.play();
	// 				console.log("Track playing-->" + track_id);	
	// 			});
	// 		});

	// 	}






}



// EVENT PAGE //
function renderEvent(){

	// console.log("inside the Render event function");
	var urlArray = window.location.href.split('/');
	var id = urlArray[urlArray.length-1];

	jQuery.ajax({

		url : '/api/get/'+id,
		dataType : 'json',
		success : function(response) {
			//console.log('got data for single event: ');
			
			//console.log("THIS IS THE RESPONSE" + response);

			var set = response.set;

			
			var htmlToAdd = 
					'<div class="col-md-4">'+
		            '<p><b><a href="api/event/'+set._id+'>">' + set.title + '</a></b></p>' +
		            '<p>Date: ' + set.dateEvent +' </p>' +
		            '<p>Line Up:' + set.artist+  '</p>' +
		            '<p>About:' + set.description+ '</p>' +
		            '<a href="../edit/'+set._id +'" class="btn btn-default btn-lg btn-block">Edit</a>' +

				'</div>';
			
				jQuery("#event-detail").append(htmlToAdd);

				//document.getElementById("deleteEvent").addEventListener('click', deleteEvent(set._id));

		}
	})	


}




// DELETE EVENT//
function deleteEvent(setId){

	//var targetedId = event.target.id;
	//console.log('the event to delete is ' + targetedId);

	// Console.log("inside the delete event function")


	// now, let's call the delete route with AJAX
	jQuery.ajax({
		url : '/api/delete/'+setId,
		dataType : 'json',
		success : function(response) {
			// now, let's re-render the animals

			renderEvents();

		}
	})

	event.preventDefault();
	
}


// FORM  / ADD PAGE



function preventEnter(){

	$(document).ready(function() {
	  $(window).keydown(function(event){
	    if(event.keyCode == 13) {
	      event.preventDefault();
	      return false;
	    }
	  });
	});

}




function googleMaps(){

	//GOOGLE MAPS
	var defaultBounds = new google.maps.LatLngBounds(
	  new google.maps.LatLng(-90, -180),
	  new google.maps.LatLng(90, 180));


	//Get the HTML input element for the autocomplete search box
	var input = document.getElementById("address");
	var options = {
	  bounds: defaultBounds,
	};

	var autocomplete = new google.maps.places.Autocomplete(input,options);

}




function renderCopyright(){

	var now = moment();
	var format = 'YYYY';
	var year = moment(now).format(format);

	var htmlToAdd = '<p><em>Copyright</em> ' + year + ' Mixgogo </p>';

	jQuery("#copyright").append(htmlToAdd);

}





//window.addEventListener("DOMContentLoaded", init );