const mysql = require('mysql');
const AWS = require('aws-sdk');
const attr = require('dynamodb-data-types').AttributeValue;
const ddb = new AWS.DynamoDB({region: 'us-west-2'});
const docClient = new AWS.DynamoDB.DocumentClient({region: 'us-west-2'});

exports.handler = (event, context, callback) => {
    console.log('Received event:', JSON.stringify(event, null, 2));
    
    // function for send data of dynamodb to database MySQL
    function data_write(mydata) {

        const pool = mysql.createPool({
              host: process.env.RDS_HOSTNAME,
              user: process.env.RDS_USERNAME,
              password: process.env.RDS_PASSWORD,
              port: process.env.RDS_PORT,
              database: process.env.RDS_DATABASE
        });
    
        var id = JSON.stringify(mydata.id).replace(/^"(.*)"$/, '$1');
        var siteid = JSON.stringify(mydata.site_id).replace(/^"(.*)"$/, '$1');
        var timestamp = Date.now();
        var latitude = mydata.latitude.replace(/^"(.*)"$/, '$1');
        var longitude = mydata.longitude.replace(/^"(.*)"$/, '$1');
        var site = mydata.site.replace(/^"(.*)"$/, '$1');
        var location = mydata.address.replace(/^"(.*)"$/, '$1');
        var temperature = mydata.temperature.replace(/^"(.*)"$/, '$1');
        var humidity = mydata.humidity.replace(/^"(.*)"$/, '$1');
        var pressure = mydata.pressure.replace(/^"(.*)"$/, '$1');
        var co2 = mydata.co2.replace(/^"(.*)"$/, '$1');
        var lpg = mydata.lpg.replace(/^"(.*)"$/, '$1');
        var registers = "INSERT INTO SENSORS (id," +
                                             "timestamp," +
                                             "temperature," +
                                             "humidity," +
                                             "pressure," +
                                             "lpg," +
                                             "co2," +
                                             "latitude," +
                                             "longitude," +
                                             "siteid," +
                                             "site," +
                                             "location)" +
                        "VALUES (?,?,?,?,?,?,?,?,?,?,?,?)";
                        
        // Insert values in the database of MySQL                
        context.callbackWaitsForEmptyEventLoop = false;
        pool.getConnection(function(error, connection) {
         connection.query(registers,
            [id,
             timestamp,
             temperature,
             humidity,
             pressure,
             lpg,
             co2,
             latitude,
             longitude,
             siteid,
             site,
             location],
             function(error, results, fields) {
                connection.release();
                    if (error) {
                        callback(error);
                     } else {
                        callback(null, results);
                        console.log(null,results);
                    }
             }); 
        });
    }
     
    // function for get data of dynamodb about location iot hardware`s
    function read_location(mydata) {
        var id = mydata.id;
        var params = {
            TableName: 'LOCATION',
            Key: {
                 'device_id': {
                  S: id
                 }
             },
             // items to read from db
             ProjectionExpression: 'latitude, longitude,address, site ,site_id'
         };
         // Call DynamoDB to read the item from the table
         ddb.getItem(params, function(error, data) {
            if (error) {
                console.log("error", error);
             } else {
                var dydata = attr.unwrap(data.Item);
                var alldata = {
                    ...mydata,
                    ...dydata
                };
                data_write(alldata);
           }
         });
     }
     
     // main function
    read_location(event)
}