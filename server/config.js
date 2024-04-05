const ip = require('ip');
const fs = require('fs');
const path = require("path");
const log4js = require('log4js');
const common = require('./common');

// main web-application default parameters
const DEFAULT_APP_HOST = 'localhost';
const DEFAULT_APP_PORT = 5000;
const IS_LOG_TO_FILE = false;
const APP_LOG_LEVEL = 'DEBUG';
const APP_LOG_DIR = __dirname + '/log/';
const APP_LOG_FILE = APP_LOG_DIR + 'log_' + common.getIsoDateTime('_', '-') + '.log';
const IS_PROCESS_TIMEZONE_UTC = true; // if true, the timezone of the nodejs process is UTC (default), overwise - the current local system timezone

// ********************************************************
// ******************** Logger config *********************
// ********************************************************

function getLogger(level, log2file) { 
	// init the application logger
	let logger;
	if (log2file) {
		// create the server log folder if required
		try {
			if (!fs.existsSync(APP_LOG_DIR)) {
				fs.mkdirSync(APP_LOG_DIR); 
			}
		}
		catch(e) {
			console.log("WARNING: Cannot create the 'log' directory: " + e.message);
			return null;
		}

		// configure the application logger
		log4js.configure({
			appenders: { f: { type: 'file', filename: APP_LOG_FILE }, c: { type: 'console' } },
			categories: { default: { appenders: ['f', 'c'], level: level } }
		});
	}
	else {
		// configure the console application logger only
		log4js.configure({
			appenders: { c: { type: 'console' } },
			categories: { default: { appenders: ['c'], level: level } }
		});
	}

	logger = log4js.getLogger('test-app');    	
	return logger;
};

function initAppSettings() {
    var p = { host: DEFAULT_APP_HOST, port: DEFAULT_APP_PORT, log_level: APP_LOG_LEVEL };
	return p;
};

function collectParams() {
	var env = initAppSettings();
	const params = ['host', 'port'];

	// replace the existing parameters collection with the command line ones
	for (var i=0; i < process.argv.length; i++) {
	    var k = process.argv[i];
		var v = process.argv[i+1];

	    if (k && v && v.trim() != '' && params.indexOf(v) < 0) {
	    	v = v.trim();

	    	switch(k) {
    			case 'host':
	    			env.host = v;
		    		break;
    			case 'port':
	    			env.port = parseInt(v);
		    		break;
	    	}
	    }
	}

	return env;
};

function printParams(env) {
	var level = env.log_level ? env.log_level : APP_LOG_LEVEL;
	
	if (level === 'DEBUG') {
		var str = '';

		for (k in env) {
			let v = env[k];
		    str += ("[" + k + "]").padEnd(15) + "\t => \t" + v + '\n';
		}

		console.log('Initial application parameters: \n' + str.trim());    
	}
};


// **********************************************
// ****** Init the application environment ******
// **********************************************

// set the full parameters collection
const env = collectParams();
// init the main application logger
const logger = getLogger(env.log_level, IS_LOG_TO_FILE);        


module.exports.ENVIRONMENT = env;
module.exports.DEFAULT_LOGGER = logger;
module.exports.APP_LOG_DIR = APP_LOG_DIR;
module.exports.APP_LOG_FILE = APP_LOG_FILE;
module.exports.collectParams = collectParams;
module.exports.printParams = printParams;
module.exports.getLogger = getLogger;
module.exports.IS_PROCESS_TIMEZONE_UTC = IS_PROCESS_TIMEZONE_UTC;
