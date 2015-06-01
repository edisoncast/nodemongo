var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

var collections='places';

var document = [
  {name: "Citytaxi", loc: [-75.49767,5.074065]},
  {name:"Fatima",    loc:[-75.496755,5.054169]},
  {name:"Palermo",   loc:[-75.46543,5.054169]}
];

var url = 'mongodb://localhost:27017/geodb';

MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  console.log("Connected correctly to Server");
   
   findDocuments(db, function() {
          db.close();
   });
});



//Insertar un documento
var insertDocuments = function(db, callback) {
  // Get the documents collection
  var collection = db.collection(collections);
  // Insert some documents
  collection.insert(document, function(err, result) {
    assert.equal(err, null);
    //assert.equal(3, result.result.n);
    //assert.equal(3, result.ops.length);
    console.log("Inserted Citytaxi");
    callback(result);
  });
}


//actualizar un documento

var updateDocument = function(db, callback) {
  // Get the documents collection
  var collection = db.collection(collections);
  // Update document 
  collection.update({name:"Citytaxi"}, {"$set": {loc:[-75.49767,5.074065]}}, function(err, result) {
    assert.equal(err, null);
    assert.equal(1, result.result.n);
    console.log("Updated the document ");
    callback(result);
  });
}

var findDocuments = function(db, callback) {
  // Get the documents collection
  var collection = db.collection(collections);
  //Limites cuadrados
  //var box = [[-70, 3], [-76, 6]];
  //Limites triangulares
  var triangle = [[-80, 6], [-90, 6], [-90, 6]]; 
  
  // Find some documents
  collection.find({loc: {$near: [-75.49767,5.074065], $maxDistance: 10}}).toArray(function(err, docs) {
     // collection.find({loc: {$within: {$box: box}}}).toArray(function(err, docs) {
      // collection.find({loc: {$within: {$polygon: triangle}}}).toArray(function(err, docs) {
      assert.equal(err, null);
 //   assert.equal(12, docs.length);
    console.log("Found the following records");
   console.dir(docs);
    callback(docs);
  });
}




