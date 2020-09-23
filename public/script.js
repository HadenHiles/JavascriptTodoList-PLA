window.addEventListener('load', function () {
    /* 
    * LOAD list.json contents
    */
    // Retrieve current items from the list.json
    renderTodoList();

    /*
    * EVENTS
    */
    // Add button
    document.getElementById('add-item').addEventListener('click', () => {
        var list = document.querySelector('.list'); // create reference to the list element
        var itemText = document.getElementById('item-text') // get the input text

        // validate the input
        if (itemText.value != "" && itemText.value != null) {
            // call the server and update dom after successful creation in list.json
            httpGetAsync(`/add?title=${itemText.value}`, (item) => {
                var newItem = buildItem(item); // get a new list item from the template
                list.append(newItem); // append the item to the list in the DOM
                document.getElementById('item-text').value = ""; // reset the item text input value
            });

            // Reset the input in case there was an error
            itemText.removeAttribute('class');
            itemText.setAttribute('placeholder', 'Enter todo item here');
        } else {
            itemText.setAttribute('class', 'error');
            itemText.setAttribute('placeholder', 'Please enter a value');
        }
    });
});

/**
 * Render the items in the list.json todo list
 */
function renderTodoList() {
    loadJSON('/list', (items) => {
        var listItems = items; // assign the json response to a variable for looping through
        var list = document.querySelector('.list'); // Create references to the list

        // Ensure there are items in the list.json to display
        if (listItems.items && listItems.items.length > 0) {
            list.innerHTML = ""; // Clear the default text

            // re-order the list based on checked values
            listItems.items.sort(function(item1, item2) {
                // false values first
                return (item1 === item2)? 0 : item1.data.checked? 1 : -1;
            });
            
            // Loop through the list items in the json file
            listItems.items.forEach(item => {
                var existingItem = buildItem(item); // generate item from the template

                list.append(existingItem); // append each existing list item to the list
            });
        }
    });
}

/**
 * Generate a new list item from the item template html
 * @param {any} item the item object returned from the list.json file/express server
 */
function buildItem(item) {
    var itemTemplate = document.getElementById('item-template'); // the item template to use

    // Build the list item
    var newItem = document.createElement('li');
    newItem.setAttribute('class', 'item'); // make sure it has the right class
    newItem.setAttribute('id', item.uuid); // give the item a unique id
    newItem.innerHTML = itemTemplate.innerHTML; // Setup it's html from list template

    var children = newItem.childNodes; // Retrieve the child nodes of the new item so we can update the text and checkbox
    var checkbox = children[1]; // The checkbox
    checkbox.setAttribute('onchange', `toggleComplete('${item.uuid}')`);
    var itemText = children[3]; // The item text
    var deleteBtn = children[5]; // The delete button
    deleteBtn.setAttribute(`onclick`, `deleteItem('${item.uuid}')`); // pass the onclick event to the dom to avoid unnecessarily refreshing event listeners every time an item is added

    itemText.innerHTML = item.data.title; // Set the todo item text

    // If item is checked put a line-through and check the box
    if (item.data.checked) {
        checkbox.setAttribute('checked', true); // Set if the item is checked
        itemText.setAttribute('class', 'strikethrough');
    }

    return newItem;
}

/**
 * Deletes the item by specified id (uuid)
 * @param {String} id 
 */
function deleteItem(id) {
    httpGetAsync(`/delete?id=${id}`, (success) => {
        if (success) {
            document.getElementById(id).remove();
        }
    });
}

/**
 * Toggles the completed status of a given item id (uuid)
 * @param {String} id 
 */
function toggleComplete(id) {
    // toggle the ui strikethrough regardless of server success
    var children = document.getElementById(id).childNodes;
    var checkbox = children[1]; // The checkbox
    var itemText = children[3]; // The item text
    if (checkbox.checked) {
        checkbox.removeAttribute('checked');
        itemText.removeAttribute('class');

        var list = document.querySelector('.list'); // Create references to the list
        list.append(document.getElementById(id)); // Move the item to the bottom of the list
    } else {
        checkbox.setAttribute('checked', true);
        itemText.setAttribute('class', 'strikethrough');
    }

    httpGetAsync(`/toggle?id=${id}`, (result) => {
        if (result.success) {
            // toggle the current checked state depending on success
            checkbox.setAttribute('checked', result.checked);
            if (result.checked) {
                itemText.setAttribute('class', 'strikethrough');
            } else {
                itemText.removeAttribute('class');
            }
        }
    });
}

// Load json file from express server
function loadJSON(url, callback) {
    var xmlHttp = new XMLHttpRequest();

    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.status == 200 && xmlHttp.readyState == 4) {
            callback(JSON.parse(xmlHttp.responseText));
        }
    }

    xmlHttp.open("GET", url, true);
    xmlHttp.overrideMimeType('application/json');
    xmlHttp.send(null);
}

// Make an http request
function httpGetAsync(url, callback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.status == 200 && xmlHttp.readyState == 4) {
            callback(JSON.parse(xmlHttp.responseText));
        }
    }
    xmlHttp.open("GET", url, true); // true = asynchronous 
    xmlHttp.send(null);
}