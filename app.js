// requires mongodb
var MongoClient = require('mongodb').MongoClient;
var mongoDbObj;
var assert      = require('assert');

// requires server + socket
var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');
var server      = require('http').createServer(app);
var config      = require('./.env.json');
var validator   = require('validator');
var port        = 5003;

server.listen(port);

app.use(bodyParser.urlencoded({ extended: true }));

// Connection URL
var url = 'mongodb://'+config.host+':'+config.port+'/'+ config.scheme;

function validateData(data)
{
    if(!validator.isNumeric(data.device_id))
        return false;
    if(!validator.isFloat(data.latitude))
        return false;
    if(!validator.isFloat(data.longitude))
        return false;
    return true;
}

app.post('/device/insert/location', function(req, res, next)
{
    res.setHeader('Content-Type', 'application/json');
    data = req.body;
    var validation = {};
    validation.state = validateData(data);
    if(validation.state) {
       insert({ "device_id": data.device_id, "locs": [{"lng": parseFloat(data.longitude), "lat": parseFloat(data.latitude)}] });
    }
    res.send(validation);
    res.end();
});

// Use connect method to connect to the Server
MongoClient.connect(url, function(err, db) 
{
    if(err){
      console.log('error...', err);
    }
    else{
      console.log("Connected correctly to Server");
      mongoDbObj = {db: db, locations: db.collection('locations')};
    }
});


function insert (device) 
{
    mongoDbObj.locations.insert(device, function(err, result) 
    {
      if (err) {
        console.log("Inserting Error", err);
      } else{
        console.log('successfully inserted', device)
      };    
    });
}


/*
//actualizar un documento

var updateDocument = function(db, callback) {
  // Get the documents collection
  var collection = db.collection('documents');
  // Update document where a is 2, set b equal to 1
  collection.update({ a : 2 }
    , { $set: { b : 1 } }, function(err, result) {
    assert.equal(err, null);
    assert.equal(1, result.result.n);
    console.log("Updated the document with the field a equal to 2");
    callback(result);
  });  
}

//eliminar un documento

var removeDocument = function(db, callback) {
  // Get the documents collection
  var collection = db.collection('documents');
  // Insert some documents
  collection.remove({ a : 3 }, function(err, result) {
    assert.equal(err, null);
    //assert.equal(1, result.result.n);
    console.log("Removed the document with the field a equal to 3");
    callback(result);
  });    
}

//Encontrar documentos

var findDocuments = function(db, callback) {
  // Get the documents collection
  var collection = db.collection('documents');
  // Find some documents
  collection.find({}).toArray(function(err, docs) {
    assert.equal(err, null);
 //   assert.equal(12, docs.length);
    console.log("Found the following records");
    console.dir(docs);
    callback(docs);
  });
} */
