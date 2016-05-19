// THIS I THE ROUTES
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var moment = require('moment');

// our db models
var Set = require("../models/model.js");
var Email = require("../models/emails.js");


// S3 File dependencies
var AWS = require('aws-sdk');
var awsBucketName = process.env.AWS_BUCKET_NAME;
var s3Path = process.env.AWS_S3_PATH; // TODO - we shouldn't hard code the path, but get a temp URL dynamically using aws-sdk's getObject
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY
});
var s3 = new AWS.S3();

// file processing dependencies
var fs = require('fs');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();





// * ____________________________________________________________________________
// * HOLD ON message
// * When web site is not active

router.get('/', multipartMiddleware, function(req, res) {

  res.render('templates/temp_holdon.html',{
    layout: 'noplayer-layout',
    status: 'OK',
    pageTitle: 'Mixgogo prototype',
  })

});




router.post('/testers', function(req, res) {

  var email = req.body.email;

  var emailObj ={

    email: email

  }

  var tester = new Email(emailObj);

  // now, save that set instance to the database
  // mongoose method, see http://mongoosejs.com/docs/api.html#model_Model-save    
  tester.save(function(err,data){
    // if err saving, respond back with error
    if (err){
      console.log(err);
      var error = {status:'ERROR', message: 'Error saving email'};
      return res.json(error);
    } else {
        console.log('saved a new email!');
        console.log(data);
        res.render('templates/temp_thankyou.html',{
          layout: 'noplayer-layout',
          status: 'OK',
         })

        // res.redirect ("/thankyou"); 

    }

  })

});



router.get('/thankyou', multipartMiddleware, function(req, res) {

  res.render('templates/temp_thankyou.html',{
    layout: 'noplayer-layout',
    status: 'OK',
    pageTitle: 'Mixgogo prototype',
  })

});






// router.get('/', function(req, res) {


//   console.log(moment().startOf('day').toDate());

//   Set.find( 
//     {
//       'dateEvent':
//         {

//           $gte: moment().startOf('day').toDate()

//         }

//     }).sort('dateEvent').limit(6).exec(function(err, data){
//           // if err or no sets found, respond with error 
//         if(err || data == null){
//           var error = {status:'ERROR', message: 'Could not find sets'};
//           return res.json(error);
//         }else{
//           console.log(data),
//           res.render('templates/temp_subscribe.html',{
//           layout: 'noplayer-layout',
//           status: 'OK',
//           pageTitle: 'Mixgogo',
//           sets: data
//           }
//         );
//       }
//   })
// });





router.get('/upcoming', function(req,res){
  res.render('templates/temp_upcoming.html', {layout:'layout'})
})  





// * ____________________________________________________________________________
// * TEMP


router.get('/api/get', function(req, res){

  
  // console.log(moment().startOf('day').toDate());
  // mongoose method to find sets from events happening later than today, 
  //see http://mongoosejs.com/docs/api.html#model_Model.find
  Set.find( 
    {
      'dateEvent':
        {
          $gte: moment().startOf('day').subtract(10, 'days').toDate()
        }

    }).sort('dateEvent').exec(function(err, data){

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









// // * ____________________________________________________________________________
// // * Receives a GET request to get all set details
// //  * @return {Object} JSON


// router.get('/api/get', function(req, res){

  
//   // console.log(moment().startOf('day').toDate());
//   // mongoose method to find sets from events happening later than today, 
//   //see http://mongoosejs.com/docs/api.html#model_Model.find
//   Set.find( 
//     {
//       'dateEvent':
//         {
//           $gte: moment().startOf('day').subtract(1, 'days').toDate()
//         }

//     }).sort('dateEvent').exec(function(err, data){

//           // if err or no sets found, respond with error 
//         if(err || data == null){
//           var error = {status:'ERROR', message: 'Could not find sets'};
//           return res.json(error);
//         }

//         // otherwise, respond with the data 
//         var jsonData = {
//           status: 'OK',
//           sets: data
//         } 

//         res.json(jsonData);
//         // res.render('upcoming.html', jsonData);
//     })

// });





// /** ____________________________________________________________________________

//  * GET '/api/get/:id'
//  * Receives a GET request specifying the set to get
//  * @param  {String} req.param('id'). The setId
//  * @return {Object} JSON
router.get('/api/get/:id', function(req, res){

  var requestedId = req.param('id');

  // mongoose method, see http://mongoosejs.com/docs/api.html#model_Model.findById
  Set.findById(requestedId, function(err,data){

    // if err or no user found, respond with error 
    if(err || data == null){
      var error = {status:'ERROR', message: 'Could not find that set'};
       return res.json(error);
    }else{

      //console.log(data);
        res.render('templates/temp_event.html', {
        status: 'OK',
        layout:'layout', 
        set: data      
        });

    }  
  })

});




/* ____________________________________________________________________________
  GET '/add'
  Default add new event route. loads the form for adding a new Set (event).
 */


router.get('/api/add', function(req,res){
  //console.log('got into the add set page');
  res.render('templates/temp_add.html', {layout:"add-layout"})
 });




// /** ____________________________________________________________________________

//  * POST '/api/create'
//  * Receives a POST request of the new Set, saves to db, responds back
//  * @param  {Object} req. An object containing the different attributes of the Person
//  * @return {Object} JSON
//  */

router.post('/api/create', multipartMiddleware, function(req, res){

  //console.log('the incoming data >> ' + JSON.stringify(req.body));
  //console.log('the incoming image file >> ' + JSON.stringify(req.files.artcover));

  //console.log("BODY", req.body);

    // pull out the information from the req.body
    var title = req.body.title;
    var tags = req.body.tags.split(',');
    var artist = req.body.artist;
    var soundcloudUrl = req.body.soundcloudUrl;
    var description = req.body.description;
    var isfree = req.body.isfree ? true : false;
    var minPrice = req.body.minPrice;
    var maxPrice = req.body.maxPrice;
    var buyUrl = req.body.buyUrl;
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
      tags: tags,
      lineup:{
        artist: artist,
        soundcloudUrl: soundcloudUrl
      },
      description: description,
      isfree: isfree,
      minPrice: minPrice,
      maxPrice: maxPrice,
      buyUrl: buyUrl,
      dateEvent: dateEvent,
      startTime: startTime,
      endTime: endTime,
      address: address,
      zip: zip,
      city: city
    };



  // NOW, we need to deal with the image
  // the contents of the image will come in req.files (not req.body)
  var filename = req.files.artcover.name; // actual filename of file
  var path = req.files.artcover.path; // will be put into a temp directory
  var mimeType = req.files.artcover.type; // image/jpeg or actual mime type
 // create a cleaned file name to store in S3
  // see cleanFileName function below
  var cleanedFileName = cleanFileName(filename);
  // We first need to open and read the uploaded image into a buffer
  fs.readFile(path, function(err, file_buffer){

    // reference to the Amazon S3 Bucket
    var s3bucket = new AWS.S3({params: {Bucket: 'mixgogo-img-uploads'}});

    // Set the bucket object properties
    // Key == filename
    // Body == contents of file
    // ACL == Should it be public? Private?
    // ContentType == MimeType of file ie. image/jpeg.
    var params = {
      Key: cleanedFileName,
      Body: file_buffer,
      ACL: 'public-read',
      ContentType: mimeType
    };



    // Put the above Object in the Bucket
    s3bucket.putObject(params, function(err, data) {
      if (err) {
        //console.log(err)
        return;
      } else {
        //console.log("Successfully uploaded data to s3 bucket");
        // now that we have the image
        // we can add the s3 url our person object from above
        setObj['artcover'] = s3Path + cleanedFileName;


        // create a new set model instance, passing in the object
        var set = new Set(setObj);


        // now, save that set instance to the database
        // mongoose method, see http://mongoosejs.com/docs/api.html#model_Model-save    
        set.save(function(err,data){
          // if err saving, respond back with error
          if (err){
            console.log(err);
            var error = {status:'ERROR', message: 'Error saving set'};
            return res.json(error);
          } else {
              //console.log('saved a new set!');
              //console.log(data);
              // now return the json data of the new set
              var jsonData = {
                status: 'OK',
                pageTitle: set.title,
                set: data
              }
          }

              //respond with rendering a page
              //res.render('event.html', jsonData);

              res.render('templates/temp_event.html', jsonData);

             //console.log(set.id);

            res.redirect ("/api/get/" + set.id); 


        })  //end of set save

      }

    }); //end of put object

  }); //end of read file

}) //end of router




function cleanFileName (filename) {

    // cleans and generates new filename for example userID=abc123 and filename="My Pet Dog.jpg"
    // will return "abc123_my_pet_dog.jpg"
    var fileParts = filename.split(".");

    //get the file extension
    var fileExtension = fileParts[fileParts.length-1]; //get last part of file

    //add time string to make filename a little more random
    d = new Date();
    timeStr = d.getTime();

    //name without extension
    newFileName = fileParts[0];

    return newFilename = timeStr + "_" + fileParts[0].toLowerCase().replace(/[^\w ]+/g,'').replace(/ +/g,'_') + "." + fileExtension;

}





router.get('/api/edit/:id', function(req,res){

  var requestedId = req.params.id;

  Set.findById(requestedId,function(err,data){
    if(err){
      var error = {
        status: "ERROR",
        message: err
      }
      return res.json(err)
    }


    //insert the variable dataString into data, so the tags come separated by commas
    var tagString = data.tags.join(', ');
    data.tagString = tagString;

    console.log('tagString', tagString);

    var viewData = {
      status: "OK",
      set: data,      
      layout:"add-layout"
    }


    return res.render('templates/temp_edit.html', viewData)

  })

})





// /** ____________________________________________________________________________
//  * POST '/api/update/:id'
//  * Receives a POST request with data of the set to update, updates db, responds back
//  * @param  {String} req.param('id'). The setId to update
//  * @param  {Object} req. An object containing the different attributes of the Set
//  * @return {Object} JSON
//  */

router.post('/api/update/:id', multipartMiddleware, function(req, res){


  console.log('UPDATINGGG');


   var requestedId = req.params.id;

   console.log(requestedId);


   // pull out the information from the req.body
    var title = req.body.title;
    var tags = req.body.tags.split(',');
    var artist = req.body.artist;
    var soundcloudUrl = req.body.soundcloudUrl;
    var description = req.body.description;
    var isfree = req.body.isfree ? true : false;
    var minPrice = req.body.minPrice;
    var maxPrice = req.body.maxPrice;
    var buyUrl = req.body.buyUrl;
    var dateEvent = req.body.dateEvent;
    var startTime = req.body.startTime;
    var endTime = req.body.endTime;
    var address = req.body.adress;
    var zip = req.body.zip;
    var city = req.body.city;




   var setObj = {

    title: title,
      tags: tags,
      lineup:{
        artist: artist,
        soundcloudUrl: soundcloudUrl
      },
      description: description,
      isfree: isfree,
      minPrice: minPrice,
      maxPrice: maxPrice,
      buyUrl: buyUrl,
      dateEvent: dateEvent,
      startTime: startTime,
      endTime: endTime,
      address: address,
      zip: zip,
      city: city

   }

   //console.log(setObj);

    // now, update that set
    // mongoose method findByIdAndUpdate, see http://mongoosejs.com/docs/api.html#model_Model.findByIdAndUpdate  
    Set.findByIdAndUpdate(requestedId, setObj, function(err,data){

      console.log('inside the update');

      // if err saving, respond back with error
      if (err){
        console.log('its an error');
        var error = {status:'ERROR', message: 'Error updating set'};
        return res.json(error);
      } else {

          console.log('sucess');
          res.render('templates/temp_event.html', {
          status: 'OK',
          layout:'layout', 
          set: data      
        })

        console.log('updated the set!');
        
      }

      // res.render('templates/temp_event.html', jsonData);

      // //console.log(set.id);

      // res.redirect ("/api/get/" + set.id); 

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



/** ____________________________________________________________________________
 ____________________________________________________________________________
 _____________________________  MIXGOGO 2_______________________________________
 ____________________________________________________________________________
 __________________________a cleaner code _______________________________________
  ____________________________________________________________________________
 */




// router.get('/upcoming2', function(req, res){

  
//   // console.log(moment().startOf('day').toDate());
//   // mongoose method to find sets from events happening later than today, 
//   //see http://mongoosejs.com/docs/api.html#model_Model.find
//   Set.find( 
//     {
//       'dateEvent':
//         {
//           $gte: moment().startOf('day').subtract(1, 'days').toDate()
//         }

//     }).sort('dateEvent').exec(function(err, data){

//           // if err or no sets found, respond with error 
//         if(err || data == null){
//           var error = {status:'ERROR', message: 'Could not find sets'};
//           return res.json(error);
//         }else{
//           //console.log(data);
//           res.render('templates/temp_upcoming2.html', {
//           status: 'OK',
//           layout:'layout', 
//           sets: data      
//           })

//         }

//     })

// });





// /** ____________________________________________________________________________







module.exports = router;