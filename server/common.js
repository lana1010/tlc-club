const fs = require('fs');

// *************************************
// ****** Common helper functions ******
// *************************************

newGuid = function() {
	return 'xxxxxxxx-xxxx-xxxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
	    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
	    return v.toString(16);
	});
};

objectSize = function(obj) {
	return obj && Object.keys(obj) ? Object.keys(obj).length : null;
};

inArray = function(el, arr) {
	return arr.indexOf(el) >= 0;
};

hasObjectKey = function(key, obj) {
	return obj && Object.keys(obj) && inArray(key, Object.keys(obj));
};

sleep = function(ms){
    return new Promise(resolve=>{
        setTimeout(resolve, ms);
    });
};

getIsoDateTime = function (delimeter1 = " ", delimeter2 = ":") {
	return (new Date().toISOString().replace(/T/, delimeter1).replace(/\..+/, '').replace(/:/g, delimeter2));	
};

readJsonDataFromFile = function(filePath, isEcho = true) {
    var ret = null;
    var fp = sanitizeHtml(filePath);

    if (fs.existsSync(fp)) {
        try {
            ret = JSON.parse(fs.readFileSync(fp).toString());
        }
        catch(e) {
           if (isEcho) {
               console.log('Error reading JSON data from file: ' + e);
           }
        }
    }

    return ret;
};

writeJsonDataToFile = function(data, path) {
    if (!data || data.length == 0 || !path) {
        return;
    }

    fs.writeFile(path, JSON.stringify(data), function(err) {
        if(err) {
            console.log('Error occurred during json data saving: ' + err);
        }
    });
};

createDirSync = function(dir) {
    if (!fs.existsSync(dir)) {
        try {
            fs.mkdirSync(dir);
        }
        catch(e) {
            console.log('Cannot create the directory "' + dir + '": ' + e);
            return false;
        }
    }

    return true;
};

isString = function(s) {
    return typeof(s) === 'string' || s instanceof String;
};

isNumber = function(n) {
    return typeof(n) === 'number' || n instanceof Number;
};

isObject = function (v) {
    return v !== null && typeof(v) === 'object';
};

isNullable = function (v) {
    return v === null || v === undefined || v === 'null' || v.trim() === '';
};

isValidDate = function(d) {
    return d && d instanceof Date && d.getTime && !isNaN(d.getTime());
};

tsToDate = function(timestamp) { // in milliseconds
    let d = undefined;

    if (timestamp) {
        if (isNumber(timestamp)) {
            d = new Date(timestamp); 
        }
        else if (isString(timestamp) && timestamp.trim() != "" && timestamp != "0") {
            try {
                d = new Date(parseInt(timestamp.trim()));
            }
            catch(e) {
                console.log('Cannot convert the timestamp to a valid date: ' +  timestamp);
            }
        }
    }

    return d;
};

tsToUTCString = function (ts) { // in milliseconds
    var d = tsToDate(ts);
    if (!d) return '';

    var D = [d.getUTCMonth()+1, d.getUTCDate(), d.getUTCFullYear()], 
        T = [d.getUTCHours(), d.getUTCMinutes(), d.getUTCSeconds()], tail = '', s = ' ';

    if (T[0] >= 12) {     
        T[0] -= 12;
        tail = ' PM'; 
    }
    else tail = ' AM';

    var dd = new Array(), tt = new Array();

    for (var i=0; i < 3; i++) {
        dd.push(D[i] < 10 ? '0' + D[i] : D[i]); 
           tt.push(T[i] < 10 ? '0' + T[i] : T[i]); 
    }

    return dd.join('/') + s + tt.join(':') + tail;
};

function toBoolean(val) { 
    return val === true || val ? val.toString().trim().toLowerCase() === 'true' : false;
};


module.exports.newGuid = newGuid;
module.exports.objectSize = objectSize;
module.exports.inArray = inArray;
module.exports.hasObjectKey = hasObjectKey;
module.exports.sleep = sleep;
module.exports.getIsoDateTime = getIsoDateTime;
module.exports.readJsonDataFromFile = readJsonDataFromFile;
module.exports.writeJsonDataToFile = writeJsonDataToFile;
module.exports.tsToUTCString = tsToUTCString;
module.exports.createDirSync = createDirSync;
module.exports.toBoolean = toBoolean;
