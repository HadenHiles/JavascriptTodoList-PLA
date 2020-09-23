window.addEventListener('load', function () {
    // Retrieve current items from the list.json
    var listItems = loadJSON('/list');

    // Create references to the list and item template elements
    var list = document.querySelector('.list');
    var itemTemplate = document.getElementById('item-template');

    // Ensure there are items in the list.json to display
    if (listItems.items && listItems.items.length > 0) {
        list.innerHTML = ""; // Clear the default text

        // Loop through the list items in the json file
        listItems.items.forEach((item, x) => {
            // Build the list item from the list template
            var newItem = document.createElement('li');
            newItem.setAttribute('class', 'item');
            newItem.setAttribute('id', `item-${x}`); // give the item a unique id
            newItem.innerHTML = itemTemplate.innerHTML; // Setup it's html

            // Retrieve the child nodes of the new item so we can update the text and checkbox
            var children = newItem.childNodes;
            var checkbox = children[1]; // The checkbox
            var itemText = children[3]; // The item text

            itemText.innerHTML = item.title; // Set the todo item text

            // If item is checked put a line-through and check the box
            if (item.checked) {
                checkbox.setAttribute('checked', true); // Set if the item is checked
                itemText.setAttribute('class', 'strikethrough');
            }

            list.append(newItem);
        });
    }
});

// Load json file from express server
function loadJSON(path) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", path, false);
    xmlhttp.overrideMimeType('application/json');
    
    xmlhttp.send();
    if(xmlhttp.status == 200) {
        return JSON.parse(xmlhttp.responseText);
    } else {
        return null;
    }
}