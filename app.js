//  Storage Controller
const StorageCtrl = (function() {
  // Public Methods
  return {
    storeItem: function(item) {
      let items;
      // check if any items in LS
      if (localStorage.getItem("items") === null) {
        items = [];
        // Push new items
        items.push(item);
        // set LS
        localStorage.setItem("items", JSON.stringify(items));
      } else {
        items = JSON.parse(localStorage.getItem("items"));
        // push new item
        items.push(item);
        // set LS
        localStorage.setItem("items", JSON.stringify(items));
      }
    },

    getItemsFromStorage: function() {
      let items;
      if (localStorage.getItem("items") === null) {
        items = [];
      } else {
        items = JSON.parse(localStorage.getItem("items"));
      }
      return items;
    },

    updateItemStorage: function(updatedItem) {
      let items = JSON.parse(localStorage.getItem("items"));

      items.forEach(function(item, index) {
        if (updatedItem.id === item.id) {
          items.splice(index, 1, updatedItem);
        }
      });
      // set LS
      localStorage.setItem("items", JSON.stringify(items));
    },

    deleteItemFromStorage: function(id) {
      let items = JSON.parse(localStorage.getItem("items"));

      items.forEach(function(item, index) {
        if (id === item.id) {
          items.splice(index, 1);
        }
      });
      // set LS
      localStorage.setItem("items", JSON.stringify(items));
    },
    clearAllFromStorage: function() {
      localStorage.removeItem("items");
    }
  };
})();

// Item Controller
const ItemCtrl = (function() {
  // Item Constructor
  const Item = function(id, name, calories) {
    this.id = id;
    this.name = name;
    this.calories = calories;
  };
  // Data Structure (STATE)
  const data = {
    items: StorageCtrl.getItemsFromStorage(),
    currentItem: null,
    totalCalories: 0
  };

  // Public Methods
  return {
    getItems: function() {
      return data.items;
    },

    addItem: function(name, calories) {
      // create ID for new item
      let ID;
      if (data.items.length > 0) {
        // auto i++
        ID = data.items[data.items.length - 1].id + 1;
      } else {
        ID = 0;
      }
      // Parse Calories
      calories = parseInt(calories);
      // create new item
      newItem = new Item(ID, name, calories);
      // add to items array (state)
      data.items.push(newItem);

      return newItem;
    },

    getItemById: function(id) {
      let found = null;
      // loop through items
      data.items.forEach(function(item) {
        if (item.id === id) {
          found = item;
        }
      });
      return found;
    },

    updateItem: function(name, calories) {
      // parse cals
      calories = parseInt(calories);

      let found = null;

      data.items.forEach(function(item) {
        if (item.id === data.currentItem.id) {
          item.name = name;
          item.calories = calories;
          found = item;
        }
      });

      return found;
    },

    deleteItem: function(id) {
      // Get IDs
      const ids = data.items.map(function(item) {
        return item.id;
      });
      // Get Index
      const index = ids.indexOf(id);
      // Remove item
      data.items.splice(index, 1);
    },

    clearAllItems: function() {
      data.items = [];
    },

    setCurrentItem: function(item) {
      data.currentItem = item;
    },

    getCurrentItem: function() {
      return data.currentItem;
    },

    logData: function() {
      return data;
    },

    getTotalCalories: function() {
      let total = 0;
      // loop through items in data structure
      data.items.forEach(function(item) {
        // add each items calories to total
        total += item.calories;
      });
      // set total calories in data structure
      data.totalCalories = total;
      return data.totalCalories;
    }
  };
})();

// UI Controller
const UICtrl = (function() {
  const UISelectors = {
    itemList: "#item-list",
    listItems: "#item-list li",
    addBtn: ".add-btn",
    deleteBtn: ".delete-btn",
    updateBtn: ".update-btn",
    backBtn: ".back-btn",
    clearBtn: ".clear-btn",
    itemNameInput: "#item-name",
    itemCaloriesInput: "#item-calories",
    totalCalories: ".total-calories"
  };
  // Public methods
  return {
    populateItemList: function(items) {
      let html = "";

      items.forEach(item => {
        html += `<li class="collection-item" id="item-${item.id}">
        <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
        <a href="#" class="secondary-content">
          <i class="edit-item fa fa-pencil"></i>
        </a>
      </li>`;
      });
      // Insert li into DOM
      document.querySelector(UISelectors.itemList).innerHTML = html;
    },
    // by creating this method we are able to use our UISelectors anywhere we want
    getSelectors: function() {
      return UISelectors;
    },
    // Get input value
    getItemInput: function() {
      return {
        name: document.querySelector(UISelectors.itemNameInput).value,
        calories: document.querySelector(UISelectors.itemCaloriesInput).value
      };
    },

    addListItem: function(item) {
      // Show the list
      document.querySelector(UISelectors.itemList).style.display = "block";
      // Create li element
      const li = document.createElement("li");
      // Add Class
      li.className = "collection-item";
      // Add id
      li.id = `item-${item.id}`;
      // Add HTML
      li.innerHTML = `
      <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
      <a href="#" class="secondary-content">
        <i class="edit-item fa fa-pencil"></i>
      </a>
      `;
      // Insert into DOM
      document
        .querySelector(UISelectors.itemList)
        .insertAdjacentElement("beforeend", li);
    },

    updateListItem: function(item) {
      let listItems = document.querySelectorAll(UISelectors.listItems);
      // Turn node list into an array
      listItems = Array.from(listItems);
      // now loop through the items
      listItems.forEach(function(listItem) {
        const itemId = listItem.getAttribute("id");

        if (itemId === `item-${item.id}`) {
          document.querySelector(`#${itemId}`).innerHTML = `
          <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
            <a href="#" class="secondary-content">
              <i class="edit-item fa fa-pencil"></i>
            </a>
          `;
        }
      });
    },

    deleteListItem: function(id) {
      const itemId = `#item-${id}`;
      const item = document.querySelector(itemId);
      item.remove();
    },

    clearAllItems: function() {
      let listItems = document.querySelectorAll(UISelectors.listItems);

      // Turn node list into array
      listItems = Array.from(listItems);

      listItems.forEach(function(item) {
        item.remove();
      });
    },

    clearInput: function() {
      document.querySelector(UISelectors.itemNameInput).value = "";
      document.querySelector(UISelectors.itemCaloriesInput).value = "";
    },

    addItemToForm: function() {
      document.querySelector(
        UISelectors.itemNameInput
      ).value = ItemCtrl.getCurrentItem().name;
      document.querySelector(
        UISelectors.itemCaloriesInput
      ).value = ItemCtrl.getCurrentItem().calories;
      UICtrl.showEditState();
    },

    hideList: function() {
      document.querySelector(UISelectors.itemList).style.display = "none";
    },

    showTotalCalories: function(totalCalories) {
      document.querySelector(
        UISelectors.totalCalories
      ).textContent = totalCalories;
    },

    setInitState: function() {
      UICtrl.clearInput();
      document.querySelector(UISelectors.addBtn).style.display = "inline";
      document.querySelector(UISelectors.backBtn).style.display = "none";
      document.querySelector(UISelectors.deleteBtn).style.display = "none";
      document.querySelector(UISelectors.updateBtn).style.display = "none";
    },

    showEditState: function() {
      document.querySelector(UISelectors.addBtn).style.display = "none";
      document.querySelector(UISelectors.backBtn).style.display = "inline";
      document.querySelector(UISelectors.deleteBtn).style.display = "inline";
      document.querySelector(UISelectors.updateBtn).style.display = "inline";
    }
  };
})();

// App Controller
const App = (function(ItemCtrl, StorageCtrl, UICtrl) {
  //  Function to load in all the event listeners
  const loadEventListeners = function() {
    // get UISelectors
    const UISelectors = UICtrl.getSelectors();

    // Add Item event listener
    document
      .querySelector(UISelectors.addBtn)
      .addEventListener("click", itemAddSubmit);

    // Edit Item
    document
      .querySelector(UISelectors.itemList)
      .addEventListener("click", itemEditClick);

    // update item
    document
      .querySelector(UISelectors.updateBtn)
      .addEventListener("click", itemUpdateSubmit);

    // delete item
    document
      .querySelector(UISelectors.deleteBtn)
      .addEventListener("click", itemDeleteSubmit);

    // clear all
    document
      .querySelector(UISelectors.clearBtn)
      .addEventListener("click", clearAll);

    // back button
    document
      .querySelector(UISelectors.backBtn)
      .addEventListener("click", function(e) {
        e.preventDefault();
        UICtrl.setInitState();
      });

    // disable enter key
    document.addEventListener("keypress", function(e) {
      if (e.keyCode === 13) {
        e.preventDefault();
        return false;
      }
    });
  };

  // callbacks from event listeners above
  const itemDeleteSubmit = function(e) {
    e.preventDefault();

    // get current item
    const currentItem = ItemCtrl.getCurrentItem();

    // delete from data structure
    ItemCtrl.deleteItem(currentItem.id);

    // delete from UI
    UICtrl.deleteListItem(currentItem.id);

    // get total calories
    const totalCalories = ItemCtrl.getTotalCalories();

    // show total calories in UI
    UICtrl.showTotalCalories(totalCalories);

    // Delete from Local Storage
    StorageCtrl.deleteItemFromStorage(currentItem.id);

    UICtrl.setInitState();
  };

  const itemUpdateSubmit = function(e) {
    e.preventDefault();

    // get item input
    const input = UICtrl.getItemInput();

    // update item
    const updatedItem = ItemCtrl.updateItem(input.name, input.calories);

    // update UI to reflect changes
    UICtrl.updateListItem(updatedItem);

    // get total calories
    const totalCalories = ItemCtrl.getTotalCalories();
    // show total calories in UI
    UICtrl.showTotalCalories(totalCalories);

    // Update Local Storage
    StorageCtrl.updateItemStorage(updatedItem);

    UICtrl.setInitState();
  };

  const clearAll = function(e) {
    e.preventDefault();

    // Delete all items from data structure
    ItemCtrl.clearAllItems();

    // get total calories
    const totalCalories = ItemCtrl.getTotalCalories();

    // show total calories in UI
    UICtrl.showTotalCalories(totalCalories);

    // Remove from UI
    UICtrl.clearAllItems();

    // Remove from Local Storage
    StorageCtrl.clearAllFromStorage();

    // hide UL
    UICtrl.hideList();
  };

  const itemEditClick = function(e) {
    e.preventDefault();

    if (e.target.classList.contains("edit-item")) {
      // get list item id -> parent of the parent of the icon that was clicked
      const listId = e.target.parentNode.parentNode.id;
      // break into an array. example: 'item-0' -> ['item', '0']
      const listIdArray = listId.split("-");
      // grab number value from array
      const id = parseInt(listIdArray[1]);
      // get item
      const itemToEdit = ItemCtrl.getItemById(id);
      // set current item
      ItemCtrl.setCurrentItem(itemToEdit);
      // add item to form
      UICtrl.addItemToForm();
    }
  };

  // itemAddSubmit
  const itemAddSubmit = function(e) {
    e.preventDefault();
    // Get form input from UI Controller
    const input = UICtrl.getItemInput();
    // Check for values in input fields on submission
    if (input.name !== "" && input.calories !== "") {
      // add item
      const newItem = ItemCtrl.addItem(input.name, input.calories);
      // add item to UI
      UICtrl.addListItem(newItem);
      // get total calories
      const totalCalories = ItemCtrl.getTotalCalories();
      // show total calories in UI
      UICtrl.showTotalCalories(totalCalories);
      // add item to Local Storage
      StorageCtrl.storeItem(newItem);
      // clear input fields after submission
      UICtrl.clearInput();
    }
  };

  return {
    init: function() {
      // Set State
      UICtrl.setInitState();
      // Fetch items from data structure
      const items = ItemCtrl.getItems();

      // Check if any items
      if (items.length === 0) {
        UICtrl.hideList();
      } else {
        // Populate list with items
        UICtrl.populateItemList(items);
      }

      // get total calories
      const totalCalories = ItemCtrl.getTotalCalories();
      // show total calories in UI
      UICtrl.showTotalCalories(totalCalories);

      // load event listeners
      loadEventListeners();
    }
  };
})(ItemCtrl, StorageCtrl, UICtrl);

App.init();
