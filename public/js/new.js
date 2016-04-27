
function addEventListeners(){

	loadPlayer();


}




function loadPlayer(){

	$(".bigplay").on('click', function(){
		console.log(this.id);
		console.log($(this).data('artist'));
		updatePlayer(artistName, artistImage, waveformPath, songPath)
	});


}






function upcoming2(){
	pullData2();
	soundcloudSDK2();
}




// FEED & PLAYER //
//Let's pull the data MongoDB
function pullData2(){

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
	           	renderDateTitle2(sets[currentSet]);
	           	currentSet++;  	
	        }
		}
	});	
}




//create an category/object of a date
var aDay = {}

function renderDateTitle2(currentSet){

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
function renderEvents2(currentSet, dateTitle){

	var thumbToAdd = document.createElement('div');

			
				
				aDay[dateTitle].thumbnails.push(thumbToAdd);

				$(aDay[dateTitle].aDayContainer).append(thumbToAdd);

				$("#bigplay"+currentSet.index).click(function(){
  					console.log('clicked!');
  					loadMixgogoPlayer(currentSet);
  				});

				//Generate an id for this item
  				$(thumbToAdd).attr('id', dateTitle + 'thumbnail' + aDay[dateTitle].thumbnails.length);
			
}









//initialize Soundcloud SDK
function soundcloudSDK2(){

	console.log("SDK On!");

	SC.initialize({
    	client_id: "95761a6a9b70583b71e0f8436edc8db3",
    	redirect_uri: "http://localhost:3000/callback.html",
  	});
}



window.addEventListener("DOMContentLoaded", addEventListeners );

