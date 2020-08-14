const mysql = require('mysql');
const AWS = require('aws-sdk');
const attr = require('dynamodb-data-types').AttributeValue;
const ddb = new AWS.DynamoDB({
    region: 'us-west-2'
});
const docClient = new AWS.DynamoDB.DocumentClient({
    region: 'us-west-2'
});


exports.handler = (event, context, callback) => {
    console.log('Received event:', JSON.stringify(event, null, 2));

    //var registers = "INSERT INTO SENSORS (id , timestamp, temperature, humidity, pressure ,lpg ,co2 ,latitude ,longitude ,siteid ,site ,location) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)";

    const pool = mysql.createConnection({
        host: process.env.RDS_HOSTNAME,
        user: process.env.RDS_USERNAME,
        password: process.env.RDS_PASSWORD,
        port: process.env.RDS_PORT,
        database: process.env.RDS_DATABASE
    });


    console.log('datos dentro de la funcion', event);
    var idd = JSON.stringify(event.id);
    var timestamp = Date.now();
    var temperature = event.temperature;
    var humidity = event.humidity;
    var pressure = event.pressure;
    var lpg = event.lpg;
    var co2 = event.co2
    var latitude = event.latitude;
    var longitude = event.longitude;
    var siteid = event.siteid;
    var site = event.site;
    var location = event.location;

    context.callbackWaitsForEmptyEventLoop = false;


    //var records = [idd, timestamp, temperature, humidity, pressure, lpg, co2, latitude, longitude, siteid, site, location];
    
    //console.log("records", records);
    
    // make to connection to the database.
    pool.connect(function(err) {
        if (err) throw err;
        // if connection is successful
        var records = [[idd, timestamp, temperature, humidity, pressure, lpg, co2, latitude, longitude, siteid, site, location]];
        pool.query("INSERT INTO SENSORS (id , timestamp, temperature, humidity, pressure ,lpg ,co2 ,latitude ,longitude ,siteid ,site ,location) VALUES ?", [records], function(err, result, fields) {
            // if any error while executing above query, throw error
            if (err) throw err;
            // if there is no error, you have the result
            console.log(result);
        });
    });

}