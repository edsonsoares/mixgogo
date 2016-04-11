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
	           	currentSet++;
	        }


		}
	});

	renderEvent();
	//renderWeek();
	addMoreDays();
	
}





//RENDER EVENTS //
function renderEvents(currentSet){

	//console.log('Render Events')
	//console.log(currentSet);

				var htmlToAdd = 
				'<div class="col-md-4">'+
				'<div id="artcover" class="thumbnail"><img src="'+currentSet.artcover+'">'+				
				'<input type="image" src="/img/site/event_play.png" id="bigplay'+currentSet.index+'" alt="Play">'+
		        '<p><b><a href="api/event/'+currentSet._id+'">' + currentSet.title + '</a></b></p>' +
		        '<p>Date: ' + currentSet.dateEvent +' </p>' +
		        '<p>Line Up: ' + currentSet.lineup.artist+
				'</div>';
			
				jQuery("#events-holder").append(htmlToAdd);


				$("#bigplay"+currentSet.index).click(function(){
  					console.log('clicked!');
  					loadMixgogoPlayer(currentSet);
  				});	 


}





var dayCounter = 0;
var week = 7;


// //RENDER WEEK NAVIGATION //
function renderWeek(){

// 	//console.log('Render Events')
// 	//console.log(currentSet);


// 				// '<div class="col-md-1">
// 				// 	<input type="image" src="/img/site/week_left.png"
// 				// </div>'



// 				// '<div class="col-md-1">
// 				// 	<input type="image" src="/img/site/week_right.png"
// 				// </div>'

// 				// console.log("inside the Render week function");

// 				// var weekDays=["Sun","Mon","Tue","Wed","Thu","Fri","Sat","Sund"];
// 				// var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun","Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// 				// var today = new Date();
				
// 				// var thisDay = today.getDay();
// 				// thisDay = weekDays[thisDay];

// 				// var thisMonth = today.getMonth();
// 				// thisMonth = monthNames[thisMonth];

// 				// var htmlToAdd = '<div class="col-md-7">'+thisDay+'<br>'+today.getDate()+'<br>'+thisMonth+'</div>'
			
// 				// jQuery("#dates-holder").append(htmlToAdd);


// 				addMoreDays();


			
				

// 				// var allDays = [Date()];

// 				// var todayIs = 0;

// 				// for(var i=0; i< allDays.length; i++){		
// 				// allDays[todayIs].index = todayIs;
// 	   //         	renderEvents(sets[currentSet]);
// 	   //         	todayIs++;
// 	   // 		    }


}

$('body').click(function(){
	addMoreDays();
});


//$('#buttonID').click(addMoreDays)


function addMoreDays(){

		console.log('Adding More Days');

			for(var i = dayCounter; i < week; i++){
				var now = moment();
				var format = 'ddd, D, MMM';
				var result = moment(now).add(i, 'day').format(format);
				var htmlToAdd = '<div class="col-md-7">'+result+'</div>';
				dayCounter++;

				jQuery("#dates-holder").append(htmlToAdd);
			}


}






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

	console.log("inside the Render event function");


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

	Console.log("inside the delete event function")


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