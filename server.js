var express = require('express');
var list = require('./public/list.json');
var app = express();

// view at http://localhost:8080
app.use(express.static(__dirname + '/public'));

app.get('/list', (req, res) => {
    console.log(list);
    res.send(list);
});

console.log("Todo list running on http://localhost:8080");
app.listen(8080);