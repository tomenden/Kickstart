/**
 * Created by tome on 7/8/15.
 */
// ------------------------------------------------
// Predefined utility functions
// ------------------------------------------------
function log(str) {
    var line = document.createElement("div");
    line.textContent = str;
    document.body.appendChild(line);
}

function addJsonStubHeaders(xhr) {
    // Missing header
    // ...
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('JsonStub-User-Key', '1ae16189-309a-4b53-84de-7ae7bd85bb7f');
    xhr.setRequestHeader('JsonStub-Project-Key', 'e3ea1297-5a15-49b7-be01-0b091fa28c1c');
    return xhr;
}

/*

 General Instructions:

 - All requests are made to http://jsonstub.com/{API NAME}
 - In order for JsonStub requests to work you should use the `addJsonStubHeaders` function to set needed headers on the request
 - To print/log messages use the `log` function, it will output lines to the screen

 Assignments:

 1. The `addJsonStubHeaders` function is missing a `Content-Type` header for JSON, add it to the request

 2. Issue a request to /deepThought/theAnswer and print the answer to the Ultimate Question of Life, the Universe, and Everything.
 It returns this JSON: {"value": Number, "time": String}
 It accepts GET only

 3. Now issue a POST request to the same API.
 Inspect the Network/Console in DevTools, what was the response?

 4. Say Hi to Deep Thought by POST'ing to /deepThought/sayHi
 It returns this JSON: {"message": String}
 It accepts POST only
 Log the message.

 5. Issue a request to /deepThought/teapot
 It accepts GET/POST
 What HTTP response code did you get?
 What does it mean?

 6. Issue a request to /deepThought/foo
 Inspect the Network/Console in DevTools, what was the response?
 Log the response.

 */

var request = (function () {
    // private variables here
    var xhr = new XMLHttpRequest();
    var baseUrl = "http://jsonstub.com/";
    //return an object
    return {
        setBaseUrl: function (url) {
            baseUrl = url;
        },
        getJson: function (path, callback) {
            xhr.open('get', baseUrl + path);
            addJsonStubHeaders(xhr);
            xhr.onload = function () {
                var json = JSON.parse(xhr.textContent);
                if (callback) {
                    callback(json);
                }
            };

        }

    };
}());


var stub = function (method, url, callback) {
    var xhr = new XMLHttpRequest();
    var baseUrl = "http://jsonstub.com/";
    var fullPath = baseUrl + url;
    xhr.open(method, fullPath);
    addJsonStubHeaders(xhr);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            var json = JSON.parse(xhr.responseText);
            if (xhr.status === 200) {
                callback(json);
            } else {
                callback(json);
            }
        }
    };
    xhr.send(null);

};


var logValue = function(json) {
    log('Get The Answer: ' + json.value);

};


stub('get', 'deepThought/theAnswer', logValue);

//stub('post', 'deepThought/theAnswer', logValue);


var logMessage = function(json) {
    log("Hi to Deep Thought: " + json.message);
};

stub('post', 'deepThought/sayHi', logMessage);

//var

var getTeaPot = stub('get', 'deepThought/teapot', log);
var postTeaPot = stub('post', 'deepThought/teapot', log);

var getFoo = stub('get', 'deepThought/foo', log);
var postFoo = stub('post', 'deepThought/foo', log);






















