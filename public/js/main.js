var empty = true;

// CUSTOM JS FILE //
// This is where frontend Javascript runs //

function init() {
	pullData();
	soundcloudSDK();
	getSoundcloudDetails();	
 }
 

// FEED & PLAYER //
//Let's pull the data MongoDB
function pullData(){

	console.log('Pulling the Data:');

	jQuery.ajax({
		url : '/api/get/',
		dataType : 'json',
		success : function(response) {
			
			console.log('got data: ');
			console.log(response);
			var sets = response.sets;
			
			// Pass out the index
			var currentSet = 0;
			
			for(var i=0; i< sets.length; i++){		
				sets[currentSet].index = currentSet;
	           	//console.log("Esse é o index");
	           	//console.log(i);
	           	renderEvents(sets[currentSet]);
	           	renderDateTitle(sets[currentSet]);
	           	renderNextFour(sets[currentSet]);

	           	currentSet++;
	        }


		}
	});

	renderEvent();
	//renderWeek();
	pullDays();
	
}



function renderDateTitle(currentSet){

	var dateTitle = moment(currentSet.dateEvent, 'YYYY-MM-DD').format('ddd D MMM');

		var dateTitleToAdd = 
				'<div class="col-md-3">'+
					'<div id="dateTitle" class="thumbnail">'+ dateTitle + '</div>' +
				'</div>';


	jQuery("#dateTitle-holder").append(dateTitleToAdd);


}


//RENDER EVENTS //
function renderEvents(currentSet){

				var thumbToAdd = 
				'<div class="col-md-3">'+
					'<div id="artcover" class="thumbnail"><img src="'+currentSet.artcover+'">'+				
					'<input type="image" src="/img/site/event_play.png" class="bigplay" id="bigplay'+currentSet.index+'" alt="Play">'+
			        '<p><div class="text-uppercase"><a href="api/event/'+currentSet._id+'"><h2>' + currentSet.title + '</h2></a></div></p>' +
			        '<div class="track-thumb"><h2><small>' + currentSet.lineup.artist+'</small></h2></div>'+
				'</div>';

				jQuery("#events-holder").append(thumbToAdd);


				$("#bigplay"+currentSet.index).click(function(){
  					console.log('clicked!');
  					loadMixgogoPlayer(currentSet);
  				});	 

}




//RENDER NEXT 5 EVENTS //
function renderNextFour(currentSet){

	console.log('Render Next 4 Events');

				var thumbToAdd = 
				'<div class="col-md-3">'+
					'<div id="dateTitle">'+ currentSet.dateEvent + '</div>' +
					'<div id="artcover" class="thumbnail"><img src="'+currentSet.artcover+'">'+				
					'<input type="image" src="/img/site/event_play.png" class="bigplay" id="bigplay'+currentSet.index+'" alt="Play">'+
			        '<p><div class="text-uppercase"><a href="api/event/'+currentSet._id+'"><h2>' + currentSet.title + '</h2></a></div></p>' +
			        '<div class="track-thumb"><h2><small>' + currentSet.lineup.artist+'</small></h2></div>'+
				'</div>';

				jQuery("#nextFour-holder").append(thumbToAdd);


				$("#bigplay"+currentSet.index).click(function(){
  					console.log('clicked!');
  					loadMixgogoPlayer(currentSet);
  				});	 

}





//WEEK NAVIGATION //


// WEEK 1st STEP : Pull dates based on today

function pullDays(){
			
			var week = [0,1,2,3,4,5,6];
			var currentDay = 0;

			for(var i = 0; i < week.length; i++){
				week[currentDay].index = currentDay;
				renderWeek(week[currentDay]);
				currentDay++;
			}

			console.log('This is the CurentDay being passed -->');
			console.log(currentDay);
}




//WEEK 2nd STEP: Now fill in the other days of the week

function renderWeek(currentDay){

			// console.log('inside render week');
			var now = moment();
			var format = 'ddd <br> D <br> MMM';
			var result = moment(now).add(currentDay, 'day').format(format);
			//dayCounter++;

			var htmlToAdd = '<button type="button" class="btn btn-calendar btn-default" id="day-holder">'+result+'</button></div>';

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
    	redirect_uri: "http://localhost:3000/callback.html",
  	});

	SC.connect({

			// 'connect': function(e)
			// 	{
			// 		console.log("Im inside connect");

			// 		console.log("This is E --->" +  e);
			// 	}
	});
}
    


//When the user hit any of the big Play button
//Lets load Mixgogo's own player
function loadMixgogoPlayer(currentSet){

	console.log(currentSet);

	//var playingNow = document.getElementById('set-info');
	//console.log("This is playing now ->")
	//console.log(playingNow);
	
	console.log(empty);
	console.log(currentSet);



	if (empty == true) {

		console.log("born empty")

				console.log("Let's load Mixgogo awesome player!");

				var setArtwork = '<img src="'+currentSet.artcover+'" height="96" width="96">';
				document.getElementById("art-work").innerHTML = setArtwork;

				var setsInfo = '<h3>'+currentSet.title+'</h3>';
				//return $('#nav-sets').append(setsNav);
				document.getElementById("set-info").innerHTML = setsInfo;

				var waveForm = '<img src="'+currentSet.waveform+'" height="80" width="300">';
				document.getElementById("wave-form").innerHTML = waveForm;

				//console.log(playingNow.innerHTML);

				empty = false;


	} else {

				// document.getElementById("#player").innerHTML = '';

				var setArtwork = '<img src="'+currentSet.artcover+'" height="96" width="96">';
				document.getElementById("art-work").innerHTML = setArtwork;


				var setsInfo = '<h3>'+currentSet.title+'</h3>';
				//return $('#nav-sets').append(setsNav);
				document.getElementById("set-info").innerHTML = setsInfo;

				var waveForm = '<img src="'+currentSet.waveform+'" height="80" width="300">';
				document.getElementById("wave-form").innerHTML = waveForm;


				// var setArtwork = '<img src="'+currentSet.artwork+'" height="96" width="96">';
				// $('#art-work').append(setArtwork);

				// var setsInfo = '<h3>'+currentSet.title+'</h3>';
				// //return $('#nav-sets').append(setsNav);
				// $('#set-info').append(setsInfo);

				// var waveForm = '<img src="'+currentSet.waveform+'" height="80" width="300">';
				// $('#wave-form').append(waveForm);


		console.log("turned into a empty");

	}

	playNow(currentSet);

	console.log("THIS SHOULD BE PLAYING--->" + currentSet)


}

//Once the player is loaded woth rigth Set, let's play its sound
function playNow (currentSet){

		// We need to get the Track Id from soundcloud (do not mistake with Set ID on the set database) 
		var track_url = currentSet.lineup.soundcloudUrl;
		
	

		// With ajax we use the soundcloudUrl to access the tracks' JSON file, and find its id
		$.get('http://api.soundcloud.com/resolve.json?url='+track_url+'&client_id=95761a6a9b70583b71e0f8436edc8db3', function (result) {
			  	console.log("THIS IS THE RESULT ---->"+result);
				var track_id = result.id;

				SC.stream('/tracks/'+track_id, function(sound){
					sound.play();
					console.log("Track playing-->" + track_id);	
				});
			});
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


window.addEventListener("DOMContentLoaded", init());