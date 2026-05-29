let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let timer = 1500;
let interval = null;


let draggedIndex = null;


window.onload = function () {
  renderTasks();
  loadNotes();
  updateStats();
  greetUser();
};


function greetUser() {
  let hour = new Date().getHours();
  let greet = "Good Night 🌙";

  if (hour < 12) greet = "Good Morning ☀️";
  else if (hour < 18) greet = "Good Afternoon 🌤️";
  else greet = "Good Evening 🌙";

  document.getElementById("greet").innerText = greet;
}


function addTask() {
  let input = document.getElementById("taskInput");
  if (!input.value.trim()) return;

  tasks.push({
    text: input.value,
    done: false
  });

  input.value = "";
  saveTasks();
  renderTasks();
  updateStats();
}

function renderTasks() {
  let list = document.getElementById("list");
  list.innerHTML = "";

  tasks.forEach((task, index) => {
    let li = document.createElement("li");
    li.draggable = true;
    li.classList.add("task-enter");

    let span = document.createElement("span");
    span.innerText = task.text;

    if (task.done) {
      span.style.textDecoration = "line-through";
      span.style.opacity = "0.6";
    }

  
    span.onclick = () => {
      tasks[index].done = !tasks[index].done;
      saveTasks();
      renderTasks();
      updateStats();
    };

  
    span.ondblclick = () => {
      let newText = prompt("Edit task:", task.text);
      if (newText) {
        tasks[index].text = newText;
        saveTasks();
        renderTasks();
      }
    };

   
    let del = document.createElement("button");
    del.innerText = "X";

    del.onclick = (e) => {
      e.stopPropagation();
      tasks.splice(index, 1);
      saveTasks();
      renderTasks();
      updateStats();
    };

   
    li.addEventListener("dragstart", () => {
      draggedIndex = index;
      li.classList.add("dragging");
    });

    li.addEventListener("dragend", () => {
      li.classList.remove("dragging");
    });

    li.addEventListener("dragover", (e) => {
      e.preventDefault();
      let draggedItem = tasks[draggedIndex];
      tasks.splice(draggedIndex, 1);
      tasks.splice(index, 0, draggedItem);
      draggedIndex = index;
      renderTasks();
    });

    li.appendChild(span);
    li.appendChild(del);
    list.appendChild(li);
  });
}

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}


function updateStats() {
  let total = tasks.length;
  let done = tasks.filter(t => t.done).length;

  document.getElementById("stats").innerText =
    `Tasks: ${done}/${total}`;

  let percent = total ? (done / total) * 100 : 0;
  document.getElementById("bar").style.width = percent + "%";
}


function start() {
  if (interval) return;

  interval = setInterval(() => {
    if (timer <= 0) {
      clearInterval(interval);
      interval = null;
      alert("Time's up! 🔔");
      return;
    }

    timer--;

    let m = Math.floor(timer / 60);
    let s = timer % 60;

    document.getElementById("time").innerText =
      `${m}:${s < 10 ? "0" + s : s}`;
  }, 1000);
}

function reset() {
  clearInterval(interval);
  interval = null;
  timer = 1500;
  document.getElementById("time").innerText = "25:00";
}


function saveNotes() {
  localStorage.setItem("myNotes",
    document.getElementById("notes").value
  );
}

function loadNotes() {
  document.getElementById("notes").value =
    localStorage.getItem("myNotes") || "";
}

document.getElementById("notes")
  .addEventListener("input", saveNotes);


function toggleTheme() {
  document.body.classList.toggle("dark");
}
