window.addEventListener('load', function () {
    // Retrieve current items from the list.json
    var listItems = {};
    fetch('list.json')
        .then(response => response.json())
        .then(jsonResponse => listItems = jsonResponse);

    var list = document.querySelector('.list');
    var itemTemplate = document.getElementById('item-template');

    if (listItems.items) {
        // Clear the default text
        list.innerHTML();

        // Loop through the list items in the json file
        listItems.items.forEach(x, item => {
            // Build the list item from the list template
            var newItem = itemTemplate.innerHTML;
            newItem.removeAttribute('id');
            newItem.setAttribute('id', `item-${x}`); // give the item a unique id

            // Retrieve the child nodes of the new item so we can update the text and checkbox
            var children = newItem.childNodes;
            var checkbox = children[1]; // The checkbox
            var itemText = children[2]; // The item text
            
            itemText.innerHTML = item.title; // Set the todo item text
            checkbox.setAttribute('checked', item.checked); // Set if the item is checked

            // If it is then put a line-through the item text label
            if (item.checked) {
                itemText.setAttribute('class', 'strikethrough');
            }

            list.append(newItem);
        });
    }
});