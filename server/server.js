const fs = require('fs');
const path = require('path');
const ip = require('ip');
const util = require('util');
const http = require('http');
require('dotenv').config()
//const express = require('express');

// import the additional web-app server modules
const conf = require('./config');
const common = require('./common');
const app = require('./index');

// create express application
//let app = express();

// create HTTP server
let appServer = http.createServer(app);

// define the global variables
let currentUserName, serverIntervalID;
let testDataArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];

// ********************************************
// ********** Environment parameters ********** 
// ********************************************

let logger = conf.DEFAULT_LOGGER;
let env = conf.ENVIRONMENT;
// print the applcation parameters
conf.printParams(env);   

// ********************************************
// **************** MIDDLEWARE **************** 
// ********************************************

const appPort = env.port;
const appHost = env.host ? env.host : ip.address(); 
const appUrl = 'http://' + appHost + ':' + appPort;
// append middleware
/*app.use(express.json());
app.use(express.urlencoded({
    extended: true
})); */



// ********************************************
// ***************** Start server *************
// ********************************************

// the main app error handler
app.use(function(err, req, res, next) {
    logger.error('Unhandled error occurred: ' + err);
    console.log ("1. Are you here?")
    res.header("Content-Type", "text/html");
    console.log ("2. Are you here?")
    res.send("Server error occurred");
});

// set server port
app.set('port', appPort);

logger.info('Starting of the application server on ' + appUrl + '...');

appServer.listen(appPort, () => {
    // set the server check-point message which should be generated every minute 
    serverIntervalID = setInterval(function() { 
        logger.debug('Server check-point at ' + common.getIsoDateTime() + ' (UTC)');
    }, 60*1000);

    logger.info('The application server started successfully, listening on port ' + appPort);

    if (conf.IS_PROCESS_TIMEZONE_UTC) {
        process.env.TZ = 'UTC';
        logger.info('The main application process default timezone: UTC');
    }
}).on('error', function(err) {
    clearInterval(serverIntervalID);
    logger.info('Application server starting error: "' + err.message + '", process terminated');
    process.exit(1);
});

process.on('exit', function () {
    clearInterval(serverIntervalID);   
    logger.info('The application server stopped');
});
