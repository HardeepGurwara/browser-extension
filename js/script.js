let addItemForm = document.querySelector("#addItemForm");
addItemForm.addEventListener("submit", (e) => {
  e.preventDefault();
  // grabbing the input value from a form and we pass the input name field itemText, not the variable name
  let itemText = addItemForm.elements.namedItem("itemText").value;
  if (itemText) {
    add(itemText);
    renderActionItem(itemText);
    addItemForm.elements.namedItem("itemText").value = "";
  }
});

//adds the itemTask text to the chrome storage.
const add = (text) => {
  //Single item text
  let actionItem = {
    id: 1,
    added: new Date().toString(),
    text: text,
    completed: null,
  };
  console.log(actionItem);
  chrome.storage.sync.get(["actionItems"], (data) => {
    let items = data.actionItems;
    console.log(items);

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
      // callback function to get the items from the chrome local storage as this process is async, it will not wait if you're not using a callback
      () => {
        chrome.storage.sync.get(["actionItems"], (data) => {
          console.log(data);
        });
      }
    );
  });
};

const renderActionItem = (text) => {
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

  textEl.textContent = text;

  deleteEl.innerHTML = ` <i class="fas fa-times"></i>`;

  mainElement.appendChild(checkEl);
  mainElement.appendChild(textEl);
  mainElement.appendChild(deleteEl);

  element.appendChild(mainElement);

  document.querySelector(".actionItems").prepend(element);
};

var circle = new ProgressBar.Circle("#container", {
  color: "#010101",
  // This has to be the same size as the maximum width to
  // prevent clipping
  strokeWidth: 4,
  trailWidth: 2,
  easing: "easeInOut",
  duration: 1400,
  text: {
    autoStyleContainer: false,
  },
  from: { color: "#7fdf67", width: 1 },
  to: { color: "#7fdf67", width: 4 },
  // Set default step function for all animate calls
  step: function (state, circle) {
    circle.path.setAttribute("stroke", state.color);
    circle.path.setAttribute("stroke-width", state.width);

    var value = Math.round(circle.value() * 100);
    if (value === 0) {
      circle.setText("");
    } else {
      circle.setText(value);
    }
  },
});
circle.text.style.fontFamily = '"Raleway", Helvetica, sans-serif';
circle.text.style.fontSize = "2rem";

circle.animate(1.0); // Number from 0.0 to 1.0