var request = require('request');

function generateRandomLatitude() {
    var min = 5.004376, 
        max = 5.107859,
        random = Math.random() * (max - min) + min;
    return random.toFixed(5);
}

function generateRandomLongitude() {
    var min = -75.350595,
        max = -75.581877,
        random = Math.random() * (max - min) + min;
    return random.toFixed(5);
}

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

function generateLocations()		
{		
   request.post('http://localhost:5003/device/insert/location', {form:{device_id : Math.floor(Math.random() * 100), 
   	                                                                   latitude  : generateRandomLatitude(), 
   	                                                                   longitude : generateRandomLongitude()}});		
}

setInterval(function() {
	generateLocations();
} , 500);


