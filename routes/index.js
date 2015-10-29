var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

// our db model
var Set = require("../models/model.js");

/**
 * GET '/'
 * Default home route. Just relays a success message back.
 * @param  {Object} req
 * @return {Object} json
 */
router.get('/', function(req, res) {
  
  var jsonData = {
  	'name': 'node-express-api-boilerplate',
  	'api-status':'OK'
  }

  // respond with json data
  res.json(jsonData)
});




/* ____________________________________________________________________________
  
  GET '/add'

  Default add new event route. loads the form for adding a new Set (event).
 
 */

router.get('/api/add', function(req,res){

  console.log('got into the add set page');

  res.render('add.html')


 });







// /** ____________________________________________________________________________

//  * POST '/api/create'
//  * Receives a POST request of the new user and location, saves to db, responds back
//  * @param  {Object} req. An object containing the different attributes of the Person
//  * @return {Object} JSON
//  */

router.post('/api/create', function(req, res){

    console.log(req.body);

    // pull out the information from the req.body
    
    var title = req.body.title;
    var artist = req.body.artist.split(",");
    var soundcloudUrl = req.body.soundcloudUrl.split(",");
    var description = req.body.description;
    var isfree = req.body.isfree;
    var price = req.body.price;
    var buyUrl = req.body.buyUrl;
    var artcover = req.body.artcover;

    var dateEvent = req.body.dateEvent;
    var startTime = req.body.startTime;
    var endTime = req.body.endTime;
    var address = req.body.adress;
    var zip = req.body.zip;
    var city = req.body.city;


    // hold all this data in an object
    // this object should be structured the same way as your db model
    var setObj = {
    
      title: title,
      lineup: {
        artist: artist,
        soundcloudUrl: soundcloudUrl
      },
      description: description,
      isfree: isfree,
      price: price,
      buyUrl: buyUrl,
      artcover: artcover,


      dateEvent: dateEvent,
      startTime: startTime,
      endTime: endTime,
      address: address,
      zip: zip,
      city: city
    };


    // create a new set model instance, passing in the object
    var set = new Set(setObj);

    // now, save that set instance to the database
    // mongoose method, see http://mongoosejs.com/docs/api.html#model_Model-save    
    set.save(function(err,data){
      // if err saving, respond back with error
      if (err){
        var error = {status:'ERROR', message: 'Error saving set'};
        return res.json(error);
      }

      console.log('saved a new set!');
      console.log(data);

      // now return the json data of the new set
      var jsonData = {
        status: 'OK',
        set: data
      }

      return res.json(jsonData);

    })  
});






// /** ____________________________________________________________________________

//  * GET '/api/get/:id'
//  * Receives a GET request specifying the set to get
//  * @param  {String} req.param('id'). The setId
//  * @return {Object} JSON
//  */

router.get('/api/get/:id', function(req, res){

  var requestedId = req.param('id');

  // mongoose method, see http://mongoosejs.com/docs/api.html#model_Model.findById
  Set.findById(requestedId, function(err,data){

    // if err or no user found, respond with error 
    if(err || data == null){
      var error = {status:'ERROR', message: 'Could not find that set'};
       return res.json(error);
    }

    // otherwise respond with JSON data of the set
    var jsonData = {
      status: 'OK',
      set: data
    }

    return res.json(jsonData);
  
  })
});







// /** ____________________________________________________________________________

//  * GET '/api/get'
//  * Receives a GET request to get all set details
//  * @return {Object} JSON
//  */

router.get('/api/get', function(req, res){

  // mongoose method to find all, see http://mongoosejs.com/docs/api.html#model_Model.find
  Set.find(function(err, data){
    // if err or no sets found, respond with error 
    if(err || data == null){
      var error = {status:'ERROR', message: 'Could not find sets'};
      return res.json(error);
    }

    // otherwise, respond with the data 

    var jsonData = {
      status: 'OK',
      sets: data
    } 

    res.json(jsonData);

  })

});






// /** ___________________ DOUBT: How do I create a Today's date variable so I can compare? ____________________________________________________________________________

//  * GET '/api/get/upcoming'
//  * Receives a GET request to list the sets of upcoming dates
//  * @return {Object} JSON
//  */

/* router.get('/api/get-upcoming', function(req, res){


  var today = new Date(); { type: Date, default: Date.now }

  // mongoose method to find all, see http://mongoosejs.com/docs/api.html#model_Model.find
  Set.find().where('dateEvent').gt(today).exe(function(err, data){
    // if err or no sets found, respond with error 
    if(err || data == null){
      var error = {status:'ERROR', message: 'Could not find sets'};
      return res.json(error);
    }

    // otherwise, respond with the data 

    var jsonData = {
      status: 'OK',
      sets: data
    } 

    res.json(jsonData);

  })

}); */






// /** ____________________________________________________________________________

//  * POST '/api/update/:id'
//  * Receives a POST request with data of the set to update, updates db, responds back
//  * @param  {String} req.param('id'). The setId to update
//  * @param  {Object} req. An object containing the different attributes of the Set
//  * @return {Object} JSON
//  */

router.post('/api/update/:id', function(req, res){

   var requestedId = req.param('id');

   var dataToUpdate = {}; // a blank object of data to update

    // pull out the information from the req.body and add it to the object to update
    var title, artist, soundcloudUrl, description, isfree, price, buyUrl, artcover, dateEvent, startTime, endTime, address, zip, city; 


    // we only want to update any field if it actually is contained within the req.body
    // otherwise, leave it alone.
    if(req.body.name) {
      title = req.body.title;
      // add to object that holds updated data
      dataToUpdate['title'] = title;
    }
    if(req.body.artist) {
      artist = req.body.artist.split(",");
      // add to object that holds updated data
      dataToUpdate['lineup'] = {};
      dataToUpdate['lineup']['artist'] = artist;
    }
    if(req.body.soundcloudUrl) {
      soundcloudUrl = req.body.soundcloudUrl.split(",");
      // add to object that holds updated data
      dataToUpdate['lineup'] = {};
      dataToUpdate['lineup']['soundcloudUrl'] = soundcloudUrl;
    }
    if(req.body.description) {
      description = req.body.description;
      // add to object that holds updated data
      dataToUpdate['description'] = description;
    }
    if(req.body.isfree) {
      isfree = req.body.isfree;
      // add to object that holds updated data
      dataToUpdate['isfree'] = isfree;
    }
    if(req.body.price) {
      price = req.body.price;
      // add to object that holds updated data
      dataToUpdate['price'] = price;
    }
    if(req.body.buyUrl) {
      buyUrl = req.body.buyUrl;
      // add to object that holds updated data
      dataToUpdate['buyUrl'] = buyUrl;
    }
    if(req.body.artcover) {
      artcover = req.body.artcover;
      // add to object that holds updated data
      dataToUpdate['artcover'] = artcover;
    }
    if(req.body.dateEvent) {
      dateEvent = req.body.dateEvent;
      // add to object that holds updated data
      dataToUpdate['dateEvent'] = dateEvent;
    }
    if(req.body.startTime) {
      startTime = req.body.startTime;
      // add to object that holds updated data
      dataToUpdate['startTime'] = startTime;
    }
    if(req.body.endTime) {
      endTime = req.body.endTime;
      // add to object that holds updated data
      dataToUpdate['endTime'] = endTime;
    }
    if(req.body.address) {
      address = req.body.address;
      // add to object that holds updated data
      dataToUpdate['address'] = address;
    }
    if(req.body.zip) {
      zip = req.body.zip;
      // add to object that holds updated data
      dataToUpdate['zip'] = zip;
    }
    if(req.body.city) {
      city = req.body.city;
      // add to object that holds updated data
      dataToUpdate['city'] = city;
    }


    console.log('the data to update is ' + JSON.stringify(dataToUpdate));

    // now, update that set
    // mongoose method findByIdAndUpdate, see http://mongoosejs.com/docs/api.html#model_Model.findByIdAndUpdate  
    Set.findByIdAndUpdate(requestedId, dataToUpdate, function(err,data){
      // if err saving, respond back with error
      if (err){
        var error = {status:'ERROR', message: 'Error updating set'};
        return res.json(error);
      }

      console.log('updated the set!');
      console.log(data);

      // now return the json data of the new person
      var jsonData = {
        status: 'OK',
        set: data
      }

      return res.json(jsonData);

    })

})

/** ____________________________________________________________________________


 * GET '/api/delete/:id'
 * Receives a GET request specifying the set to delete
 * @param  {String} req.param('id'). The setId
 * @return {Object} JSON
 */

router.get('/api/delete/:id', function(req, res){

  var requestedId = req.param('id');

  // Mongoose method to remove, http://mongoosejs.com/docs/api.html#model_Model.findByIdAndRemove
  Set.findByIdAndRemove(requestedId,function(err, data){
    if(err || data == null){
      var error = {status:'ERROR', message: 'Could not find that set to delete'};
      return res.json(error);
    }

    // otherwise, respond back with success
    var jsonData = {
      status: 'OK',
      message: 'Successfully deleted id ' + requestedId
    }

    res.json(jsonData);

  })

})

module.exports = router;