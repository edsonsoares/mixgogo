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
  	'name': 'Mixgogo',
  	'api-status':'OK'
  }

  // respond with json data
  //res.json(jsonData)

  // respond with html
  res.render('upcoming.html')

});



router.get('/upcoming', function(req,res){


res.render('upcoming.html')



})  












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

    // res.render('upcoming.html', jsonData);

  })

});









router.get('/event/:id', function(req,res){

res.render('event.html')


// var requestedId = req.param('id');

//   // mongoose method, see http://mongoosejs.com/docs/api.html#model_Model.findById
//   Set.findById(requestedId, function(err,data){

//     // if err or no user found, respond with error 
//     if(err || data == null){
//       var error = {status:'ERROR', message: 'Could not find that set'};
//        return res.json(error);
//     }

//     // otherwise respond with JSON data of the set
//     var jsonData = {
//       status: 'OK',
//       set: data
//     }

//     console.log("hit");

//     //return res.json(jsonData);
//     return res.render('event.html',jsonData);
  
//   })

})  








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

    // DOUBT?? DO I need this??? var set = results[0]

    // otherwise respond with JSON data of the set
    var jsonData = {
      status: 'OK',
      set: data
    }

   return res.json(jsonData);
  
  })
});




/* ____________________________________________________________________________
  
  GET '/add'

  Default add new event route. loads the form for adding a new Set (event).
 
 */

router.get('/api/add', function(req,res){

  console.log('got into the add set page');

  res.render('add.html')


 });



















router.get('/edit/:id', function(req,res){

  var requestedId = req.params.id;

  Set.findById(requestedId,function(err,data){
    if(err){
      var error = {
        status: "ERROR",
        message: err
      }
      return res.json(err)
    }

    var viewData = {
      status: "OK",
      set: data
    }

    return res.render('edit.html',viewData);
  })

})











// /** ____________________________________________________________________________

//  * POST '/api/create'
//  * Receives a POST request of the new Set, saves to db, responds back
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
    var isfree = req.body.isfree ? true : false;
    var minPrice = req.body.minPrice;
    var maxPrice = req.body.maxPrice;
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
      minPrice: minPrice,
      maxPrice: maxPrice,
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
      } else {
          console.log('saved a new set!');
          console.log(data);

          // now return the json data of the new set
          var jsonData = {
            status: 'OK',
            pageTitle: set.title,
            set: data
        }


        //respond with rendering a page
        res.render('event.html', jsonData)

        //respond by redirecting to anything
        //res.redirect('blablabla')

        //respond with JSON
        //return res.json(jsonData);
      }

      
    })  
});














// /** ____________________________________________________________________________

//  * POST '/api/update/:id'
//  * Receives a POST request with data of the set to update, updates db, responds back
//  * @param  {String} req.param('id'). The setId to update
//  * @param  {Object} req. An object containing the different attributes of the Set
//  * @return {Object} JSON
//  */

router.post('/api/edit/:id', function(req, res){

   var requestedId = req.param.id;

   var setObj ={ 

   // pull out the information from the req.body
    title: req.body.title,
    artist: req.body.artist.split(","),
    soundcloudUrl: req.body.soundcloudUrl.split(","),
    description: req.body.description,
    isfree: req.body.isfree,
    minPrice: req.body.minPrice,
    maxPrice: req.body.maxPrice,
    buyUrl: req.body.buyUrl,
    artcover: req.body.artcover,

    dateEvent: req.body.dateEvent,
    startTime: req.body.startTime,
    endTime: req.body.endTime,
    address: req.body.adress,
    zip: req.body.zip,
    city: req.body.city,

   }

   console/log(setObj);

 
    // now, update that set
    // mongoose method findByIdAndUpdate, see http://mongoosejs.com/docs/api.html#model_Model.findByIdAndUpdate  
    Set.findByIdAndUpdate(requestedId, setObj, function(err,data){
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

      //return res.json(jsonData);

      return res.redirect('/upcoming');

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