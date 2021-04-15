class ActionItems {
  //adds the itemTask text to the chrome storage.
  add = (text) => {
    //Single item text
    let actionItem = {
      id: uuidv4(),
      added: new Date().toString(),
      text: text,
      completed: null,
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
      chrome.storage.sync.set({
        actionItems: items,
      });
    });
  };
  markUnmarkCompleted = (id, completedStatus) => {
    storage.get(["actionItems"], (data) => {
      let items = data.actionItems;
      let foundItemIndex = items.findIndex((item) => item.id == id);
      if (foundItemIndex >= 0) {
        items[foundItemIndex].completed = completedStatus;
        storage.set(
          {
            actionItems: items,
          },
          () => {
            this.setProgress();
          }
        );
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
}
