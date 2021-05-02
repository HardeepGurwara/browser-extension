let addItemForm = document.querySelector("#addItemForm");
let itemsList = document.querySelector(".actionItems");
let storage = chrome.storage.sync;

// Initiating a class
const actionItemsUtils = new ActionItems();

// getting the data from the chrome storage
storage.get(["actionItems", "name"], (data) => {
  let actionItems = data.actionItems;

  let name = data.name;
  // passing the data to loop through each item
  greeting();
  setUserName(name);
  renderActionItems(actionItems);
  createQuickActionListener();
  actionItemsUtils.setProgress();
  console.log(data.actionItems);
  createUpdateNameDialogListener();
  createUpdateNameListener();
  //changing setprogress everytime everytime something happens to chrome local storage
  chrome.storage.onChanged.addListener(() => {
    actionItemsUtils.setProgress();
  });
});

const setUserName = (name) => {
  let newName = name ? name : "Add Name";
  document.querySelector(".name_value").innerHTML = name;
};

//Making the data loop to display it
const renderActionItems = (actionItems) => [
  actionItems.forEach((item) => {
    //item is a object so we access the item text and displayed it
    renderActionItem(item.text, item.id, item.completed, item.website);
  }),
];

const handleUpdateName = (e) => {
  //get the input

  const name = document.getElementById("inputName").value;
  if (name) {
    //save the name
    actionItemsUtils.saveName(name, () => {
      //set the user's name on front end
      setUserName(name);
      $("#updateNameModal").modal("hide");
    });
  }
};

const createUpdateNameListener = () => {
  let element = document.querySelector("#updateName");

  element.addEventListener("click", handleUpdateName);
};

const createUpdateNameDialogListener = () => {
  let greetingName = document.querySelector(".greeting__name");

  greetingName.addEventListener("click", () => {
    //open the modal
    storage.get(["name"], () => {
      let name = data.name ? data.name : " ";
      document.getElementById("inputName").value = name;
    });

    $("#updateNameModal").modal("show");
  });
};

const handleQuickActionListener = (e) => {
  const text = e.target.getAttribute("data-text");
  const id = e.target.getAttribute("data-id");
  getCurrentTab().then((tab) => {
    console.log(tab);
    actionItemsUtils.addQuickActionItem(id, text, tab, (actionItem) => {
      renderActionItem(
        actionItem.text,
        actionItem.id,
        actionItem.completed,
        actionItem.website
      );
    });
  });

  // actionItemsUtils.add(text, (actionItem) => {
  //   renderActionItem(actionItem.text, actionItem.id, actionItem.completed);
  // });
};

const createQuickActionListener = () => {
  let buttons = document.querySelectorAll(".quick-action");
  buttons.forEach((button) => {
    button.addEventListener("click", handleQuickActionListener);
  });
};

// getting a current tab of google  chrome
async function getCurrentTab() {
  return await new Promise((resolve, reject) => {
    // chromes enables us to get  tabs currrently open
    chrome.tabs.query(
      {
        active: true,
        windowId: chrome.WINDOW_ID_CURRENT,
      },
      (tabs) => {
        resolve(tabs[0]);
      }
    );
  });
}

addItemForm.addEventListener("submit", (e) => {
  e.preventDefault();
  // grabbing the input value from a form and we pass the input name field itemText, not the variable name
  let itemText = addItemForm.elements.namedItem("itemText").value;
  if (itemText) {
    actionItemsUtils.add(itemText, null, (actionItem) => {
      renderActionItem(
        actionItem.text,
        actionItem.id,
        actionItem.completed,
        actionItem.website
      );
      addItemForm.elements.namedItem("itemText").value = "";
    });
  }
});

const handleCompletedEventListener = (e) => {
  const id = e.target.parentElement.parentElement.getAttribute("data-id");
  console.log(id);
  const parent = e.target.parentElement.parentElement;
  if (parent.classList.contains("completed")) {
    actionItemsUtils.markUnmarkCompleted(id, null);
    parent.classList.remove("completed");
  } else {
    actionItemsUtils.markUnmarkCompleted(id, new Date().toString());
    parent.classList.add("completed");
  }
};

const handleDeleteEventListener = (e) => {
  const id = e.target.parentElement.parentElement.getAttribute("data-id");
  console.log(id);
  const parent = e.target.parentElement.parentElement;
  // remove from chrome storage
  actionItemsUtils.remove(id, () => {
    parent.remove();
  });
};

const renderActionItem = (text, id, completed, website = null) => {
  let element = document.createElement("div");
  element.classList.add("actionItem__item");
  let mainElement = document.createElement("div");
  mainElement.classList.add("actionItem__main");
  let checkEl = document.createElement("div");
  checkEl.classList.add("actionItem__check");
  let textEl = document.createElement("div");
  textEl.classList.add("actionItem__text");
  let deleteEl = document.createElement("div");
  deleteEl.classList.add("actionItem__delete");

  checkEl.innerHTML = `   <div class="actionItem__checkBox">
  <i class="fas fa-check" aria-hidden="true"></i>
</div>
  `;

  if (completed) {
    element.classList.add("completed");
  }
  //setting the ID
  element.setAttribute("data-id", id);

  checkEl.addEventListener("click", handleCompletedEventListener);

  textEl.textContent = text;

  deleteEl.innerHTML = ` <i class="fas fa-times"></i>`;

  deleteEl.addEventListener("click", handleDeleteEventListener);
  mainElement.appendChild(checkEl);
  mainElement.appendChild(textEl);
  mainElement.appendChild(deleteEl);

  element.appendChild(mainElement);
  if (website) {
    let linkContainer = createLinkContainer(
      website.url,
      website.fav_icon,
      website.title
    );
    element.append(linkContainer);
  }

  document.querySelector(".actionItems").prepend(element);
};

const createLinkContainer = (url, favIcon, title) => {
  let element = document.createElement("div");
  element.classList.add("actionItem__linkContainer");

  element.innerHTML = `
  <a href="${url}" target = "_blank">
  <div class="actionItem__link">
      <div class="actionItem__favIcon">
          <img src="${favIcon}" alt="">
      </div>
      <div class="actionItem__title">
          <span>${title}</span>
      </div>
  </div>
 
</a>
  `;
  return element;
};

const greeting = () => {
  let greeting = "Good ";
  const date = new Date();

  const hours = date.getHours();

  if (hours >= 5 && hours <= 11) {
    greeting += "Morning";
  } else if (hours >= 12 && hours <= 16) {
    greeting += "Morning";
  } else if (hours >= 17 && hours <= 20) {
    greeting += "Evening";
  } else {
    greeting += "Night";
  }

  document.querySelector(".greeting__type").innerText = greeting;
};
