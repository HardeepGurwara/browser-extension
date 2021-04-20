let addItemForm = document.querySelector("#addItemForm");
let itemsList = document.querySelector(".actionItems");
let storage = chrome.storage.sync;

// Initiating a class
const actionItemsUtils = new ActionItems();

// getting the data from the chrome storage
storage.get(["actionItems"], (data) => {
  let actionItems = data.actionItems;
  // passing the data to loop through each item
  getCurrentTab();
  renderActionItems(actionItems);
  createQuickActionListener();
  actionItemsUtils.setProgress();
  console.log(data.actionItems);
  //changing setprogress everytime everytime something happens to chrome local storage
  chrome.storage.onChanged.addListener(() => {
    actionItemsUtils.setProgress();
  });
});

//Making the data loop to display it
const renderActionItems = (actionItems) => [
  actionItems.forEach((item) => {
    //item is a object so we access the item text and displayed it
    renderActionItem(item.text, item.id, item.completed);
  }),
];

const handleQuickActionListener = (e) => {
  const text = e.target.getAttribute("data-text");
  actionItemsUtils.add(text, (actionItem) => {
    renderActionItem(actionItem.text, actionItem.id, actionItem.completed);
  });
};

const createQuickActionListener = () => {
  let buttons = document.querySelectorAll(".quick-action");
  buttons.forEach((button) => {
    button.addEventListener("click", handleQuickActionListener);
  });
};

// getting a current tab of google  chrome
const getCurrentTab = () => {
  chrome.tabs.query(
    {
      active: true,
      windowId: chrome.WINDOW_ID_CURRENT,
    },
    (tabs) => {
      console.log(tabs);
    }
  );
};

addItemForm.addEventListener("submit", (e) => {
  e.preventDefault();
  // grabbing the input value from a form and we pass the input name field itemText, not the variable name
  let itemText = addItemForm.elements.namedItem("itemText").value;
  if (itemText) {
    actionItemsUtils.add(itemText, (actionItem) => {
      renderActionItem(actionItem.text, actionItem.id, actionItem.completed);
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

const renderActionItem = (text, id, completed) => {
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

  document.querySelector(".actionItems").prepend(element);
};
