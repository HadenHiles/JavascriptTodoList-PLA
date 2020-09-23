var express = require('express');
var app = express();

// view at http://localhost:8080
app.use(express.static(__dirname + '/public'));

console.log("Todo list running on http://localhost:8080");
app.listen(8080);