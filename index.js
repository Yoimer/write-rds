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


    //nuevos cambios
    console.log('datos de entrada fuera de la funcion');
    console.log('id:', event.id);
    console.log('temperature:', event.temperature);
    console.log('humidity:', event.humidity);
    console.log('pressure:', event.pressure);
    console.log('lpg:', event.lpg);
    console.log('co2:', event.co2);
    console.log('latitude:', event.latitude);
    console.log('longitude:', event.longitude);
    console.log('siteid:', event.siteid);
    console.log('site:', event.site);
    console.log('location:', event.location);
    // fin nuevos cambios
    //read_location(event.id);

    function data_write(mydata) {

        const pool = mysql.createPool({
            host: process.env.RDS_HOSTNAME,
            user: process.env.RDS_USERNAME,
            password: process.env.RDS_PASSWORD,
            port: process.env.RDS_PORT,
            database: process.env.RDS_DATABASE
        });

        //variables de la base de datos 
        console.log('datos de la base de datos');
        console.log('host:', process.env.RDS_HOSTNAME);
        console.log('host:', process.env.RDS_USERNAME);
        console.log('host:', process.env.RDS_PASSWORD);
        console.log('host:', process.env.RDS_PORT);
        console.log('host:', process.env.RDS_DATABASE);

        console.log('datos dentro de la funcion', mydata);
        var idd = JSON.stringify(event.id);
        var timestamp = Date.now();
        var latitude = mydata.latitude;
        var longitude = mydata.longitude;
        var siteid = mydata.site_id;
        var site = mydata.site;
        var location = mydata.address;

        // nuevos cambios
        var siteid = mydata.siteid;
        var location = mydata.location;
        var temperature = mydata.temperature;
        var humidity = mydata.humidity;
        var pressure = mydata.pressure;
        var co2 = mydata.co2;
        var lpg = mydata.lpg;
        //fin nuevos cambios




        console.log('variables procesada en la funcion');

        //variables procesadas por la funcion 
        console.log('id:', idd);
        console.log('timestamp:', timestamp);
        console.log('humidity:', event.humidity);
        console.log('pressure:', event.pressure);
        console.log('lpg:', event.lpg);
        console.log('co2:', event.co2);
        console.log('latitude:', latitude);
        console.log('longitude:', longitude);
        console.log('siteid:', siteid);
        console.log('site:', event.site);
        console.log('location:', location);

    console.log("Hola soy lambda");
    data_write(event);
};