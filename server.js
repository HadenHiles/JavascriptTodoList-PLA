var express = require('express');
var fs = require('fs');
var list = require('./public/list.json');
var app = express();

// view at http://localhost:8080
app.use(express.static(__dirname + '/public'));

// Return the list json data
app.get('/list', (req, res) => {
    res.send(list);
});

// Add item to list with provided title
app.get('/add', (req, res) => {
    var title = req.query.title;
    var uuid = create_UUID();

    var item = {uuid: uuid, data: { "title": title, "checked": false }};
    console.log(item);
    list.items.push(item);

    writeList(list);

    res.send(item);
});

// delete the specified item by uuid
app.get('/delete', (req, res) => {
    var id = req.query.id;
    var success = false;
    list.items = list.items.filter(item => {
        success = item.uuid == id;
        return item.uuid != id;
    });

    writeList(list);
    res.send({ "success": success });
});

// toggle the current checked status
app.get('/toggle', (req, res) => {
    var id = req.query.id;
    var success = false;
    // filter based on uuid (could return multiple so being careful here)
    var targetItem = list.items.filter(item => {
        return item.uuid == id;
    })[0];

    targetItem.data.checked = !targetItem.data.checked;

    writeList(list);
    res.send({ "success": targetItem != null, "checked": targetItem.data.checked });
});

// fix the favicon error in browser console
app.get('/favicon.ico', (req, res) => {
    res.sendStatus(200);
});

console.log("Todo list running on http://localhost:8080");
app.listen(8080);

// convenience function for writing to the list.json file
function writeList(list) {
    fs.writeFile('./public/list.json', JSON.stringify(list), function (err) {
        if (err) {
            return console.log(err);
        }
    });
}

// SOURCE: https://www.w3resource.com/javascript-exercises/javascript-math-exercise-23.php
function create_UUID(){
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (dt + Math.random()*16)%16 | 0;
        dt = Math.floor(dt/16);
        return (c=='x' ? r :(r&0x3|0x8)).toString(16);
    });
    return uuid;
}