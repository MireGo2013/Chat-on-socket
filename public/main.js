let socket = io();
let userName;
let colorMessage;
let counterPrint = 0;
let arrName = [];
let names;
let text;
let idSetInterval;

const formAauthorizationEl = document.getElementById("form_authorization");
const nameUserEl = document.getElementById("name_user");

const messagesEl = document.getElementById("messages");
const formEl = document.getElementById("form");
const inputEl = document.getElementById("input");

function openChat() {
  document.querySelector(".wrapper").classList.add("open");
}

formAauthorizationEl.addEventListener("submit", (e) => {
  e.preventDefault();
  if (nameUserEl.value) {
    openChat();
    userName = nameUserEl.value;
    socket.emit("name user", userName);
    nameUserEl.value = "";
    colorMessage = randomColor();
    socket.on("connectClient", (text) => {
      let item = document.createElement("p");
      item.classList.add("connect_user_mes");
      item.textContent = `${text}`;
      messagesEl.appendChild(item);
    });
  }
  socket.on("disconnectClient", (text) => {
    let item = document.createElement("p");
    item.classList.add("disconnect_user_mes");
    item.textContent = `${text}`;
    messagesEl.appendChild(item);
  });
});

formEl.addEventListener("submit", (e) => {
  e.preventDefault();
  if (inputEl.value) {
    socket.emit("chat message", userName, colorMessage, inputEl.value);
    inputEl.value = "";
    inputEl.focus();
  }
});

socket.on("notPrintMsg", (name) => {
  arrName.splice(arrName.indexOf(name), 1);
  if (arrName.length === 0 && document.querySelector(".print_msg")) {
    document.querySelector(".print_msg").remove();
    clearInterval(idSetInterval);
  } else {
    names = arrName.join(", ");
    text = `${names} prints message`;
    if (document.querySelector(".print_msg")) {
      document.querySelector(".print_msg").textContent = text;
    }
  }
});

inputEl.addEventListener("change", () =>
  socket.emit("not print msg", userName)
);
inputEl.addEventListener("input", printMessage);

function printMessage() {
  socket.emit("print msg", userName);
}

socket.on("printMsg", (name) => {
  if (document.querySelector(".wrapper").classList.contains("open")) {
    if (messagesEl.lastChild) {
      messagesEl.lastChild.scrollIntoView(false);
    }
    if (arrName.indexOf(name) == -1) {
      arrName.push(name);
    }
    if (!document.querySelector(".print_msg")) {
      names = arrName.join(", ");
      let item = document.createElement("p");
      text = `${names} prints message`;
      item.textContent = text;
      item.classList.add("print_msg");
      item.style.textAlign = "start";
      messagesEl.appendChild(item);
      idSetInterval = setInterval(() => {
        document.querySelector(".print_msg").textContent =
          document.querySelector(".print_msg").textContent + ".";
        if (counterPrint >= 4) {
          document.querySelector(".print_msg").textContent = text;
          counterPrint = 0;
        }
        counterPrint++;
      }, 350);
    } else {
      names = arrName.join(", ");
      text = `${names} prints message`;
    }
  }
});

socket.on("chat message", (name, color, msg) => {
  if (document.querySelector(".wrapper").classList.contains("open")) {
    let item = document.createElement("li");
    item.classList.add(`message_${name}`);
    item.textContent = `${name}: ${msg}`;
    messagesEl.appendChild(item);
    item.style.background = color;
    messagesEl.lastChild.scrollIntoView(false);
  }
});

function randomColor() {
  let r = Math.floor(Math.random() * 200);
  let g = Math.floor(Math.random() * 200);
  let b = Math.floor(Math.random() * 200);
  let color = `rgba(${r}, ${g}, ${b}, 0.6)`;
  return color;
}

window.addEventListener("unload", () => {
  socket.emit("not print msg", userName);
});
