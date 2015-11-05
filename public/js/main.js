// CUSTOM JS FILE //
// This is where frontend Javascript runs //

function init() {
  renderEvents();
  renderEvent();

}

function renderEvents(){

	console.log('renderEvents function');

	jQuery.ajax({
		url : '/api/get',
		dataType : 'json',
		success : function(response) {
			console.log('got data: ');
			console.log(response);

			var sets = response.sets;

			for(var i=0; i< sets.length; i++){
				
				var htmlToAdd = 
					'<div class="col-md-4">'+
		            '<p><b><a href="/event/'+sets[i]._id+'">' + sets[i].title + '</a></b></p>' +
		            '<p>Date: ' + sets[i].dateEvent +' </p>' +
		            '<p>Line Up:' + sets[i].artist+  '</p>' +
		            '<p>About:' + sets[i].description+ '</p>' +
				'</div>';
			
				jQuery("#events-holder").append(htmlToAdd);


			}

		}
	})	

}



function renderEvent(){

	console.log('Got into render the event detail');

	var urlArray = window.location.href.split('/');
	var id = urlArray[urlArray.length-1];

	jQuery.ajax({

		url : '/api/get/'+id,
		dataType : 'json',
		success : function(response) {
			console.log('got data: ');
			console.log(response);

			var set = response.set;
			
			var htmlToAdd = 
					'<div class="col-md-4">'+
		            '<p><b><a href="/event/'+set._id+'>">' + set.title + '</a></b></p>' +
		            '<p>Date: ' + set.dateEvent +' </p>' +
		            '<p>Line Up:' + set.artist+  '</p>' +
		            '<p>About:' + set.description+ '</p>' +
				'</div>';
			
				jQuery("#event-detail").append(htmlToAdd);


		}
	})	
}




window.addEventListener('load', init())