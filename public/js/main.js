var empty = true;



// CUSTOM JS FILE //
// This is where frontend Javascript runs //

function init() {
	//getSoundcloud();
	pullData();
  	
  	
}



// FEED & PLAYER //

//Let's pull the data MongoDB

function pullData(){

	console.log('Pulling the Data:');

	jQuery.ajax({
		url : '/api/get',
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

				// var htmlToAdd = 
				// '<div class="col-md-4">'+
		  //       '<p><b><a href="/event/'+currentSet._id+'">' + currentSet.title + '</a></b></p>' +
		  //       '<p>Date: ' + currentSet.dateEvent +' </p>' +
		  //       '<p>Line Up:' + currentSet.artist+  '</p>' +
		  //       '<input type="image" src="/img/site/event_play.png" alt="Play" id="bigplay'+currentSet.index+'" class="bigplaybutton">'+
				// '</div>';
			
				// jQuery("#events-holder").append(htmlToAdd);

				// $("#bigplay"+currentSet.index).click(function(){
  		// 			loadMixgogoPlayer(currentSet.index);
  		// 		});	 

  	// 		postPlayer(sets[currentSet]); 

			// }

		}
	});

	soundcloudSDK();
	renderEvent();

}





//RENDER EVENTS //


function renderEvents(currentSet){

	//console.log('Render Events')

				console.log(currentSet);

				var htmlToAdd = 
				'<div class="col-md-4">'+
				'<div id="bigplay" class="thumbnail"><img src="'+currentSet.artcover+'">'+				
				'<input type="image" src="/img/site/event_play.png" alt="Play" '+currentSet.index+'"></div>'+
		        '<p><b><a href="/event/'+currentSet._id+'">' + currentSet.title + '</a></b></p>' +
		        '<p>Date: ' + currentSet.dateEvent +' </p>' +
		        '<p>Line Up: ' + currentSet.lineup.artist+
				'</div>';
			
				jQuery("#events-holder").append(htmlToAdd);


				$("#bigplay"+currentSet.index).click(function(){
  					console.log('clicked!');
  					loadMixgogoPlayer(currentSet);
  				});	 

  					



}









//initialize Soundcloud SDK
function soundcloudSDK(){

	console.log("Let's play with Soundcloud SDK!");

	SC.initialize({
    	client_id: "95761a6a9b70583b71e0f8436edc8db3",
    	redirect_uri: "http://localhost:3000/callback.html",
  	});

	SC.connect({
			'connect': function(e)
				{
					console.log(e);
				}
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


}

//Once the player is loaded woth rigth Set, let's play its sound
function playNow (currentSet){

				console.log(currentSet._id);

				SC.stream("/tracks/"+currentSet.id, function(sound){
					sound.play();
					console.log("I'm playing!!!");
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
			//console.log(response);

			var set = response.set;


			
			var htmlToAdd = 
					'<div class="col-md-4">'+
		            '<p><b><a href="/event/'+set._id+'>">' + set.title + '</a></b></p>' +
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