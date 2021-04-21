class ActionItems {
  addQuickActionItem = (text, tab, callback) => {
    let website = {
      url: tab.url,
      fav_icon: tab.favIconUrl,
      title: tab.title,
    };

    this.add(text, website, (actionItem) => {
      callback(actionItem);
    });
  };

  //adds the itemTask text to the chrome storage.
  add = (text, website = null, callback) => {
    //Single item text
    let actionItem = {
      id: uuidv4(),
      added: new Date().toString(),
      text: text,
      completed: null,
      website: website,
    };

    chrome.storage.sync.get(["actionItems"], (data) => {
      let items = data.actionItems;
      // if items does not exist then create one otherwise push it to the exisitng one
      if (!items) {
        items = [actionItem];
        console.log(items);
      } else {
        items.push(actionItem);
      }
      //save the data in chrome storage
      chrome.storage.sync.set(
        {
          actionItems: items,
        },
        // calling back so the data id wouldn't be undefined
        () => {
          callback(actionItem);
        }
      );
    });
  };
  markUnmarkCompleted = (id, completedStatus) => {
    storage.get(["actionItems"], (data) => {
      let items = data.actionItems;
      let foundItemIndex = items.findIndex((item) => item.id == id);
      if (foundItemIndex >= 0) {
        items[foundItemIndex].completed = completedStatus;
        storage.set({
          actionItems: items,
        });
      }
    });
  };
  setProgress = () => {
    storage.get(["actionItems"], (data) => {
      let actionItems = data.actionItems;
      let completeItems;
      let totalItems = actionItems.length;
      completeItems = actionItems.filter((item) => item.completed).length;
      let progress = 0;

      progress = completeItems / totalItems;
      console.log(progress);
      circle.animate(progress);
    });
  };

  remove = (id, callback) => {
    storage.get(["actionItems"], (data) => {
      let items = data.actionItems;
      let foundItemIndex = items.findIndex((item) => item.id == id);
      if (foundItemIndex >= 0) {
        items.splice(foundItemIndex, 1);
        storage.set(
          {
            actionItems: items,
          },
          // calling back again to remove the id properly
          callback
        );
      }
    });
  };
}
