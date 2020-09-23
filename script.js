window.addEventListener('load', function () {
    // Retrieve current items from the list.json
    var list = {};
    fetch('list.json')
        .then(response => response.json())
        .then(jsonResponse => list = jsonResponse);
});