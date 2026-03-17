// ===== GET ELEMENTS =====

const input = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const list = document.getElementById("taskList");
const counter = document.getElementById("taskCounter");
const searchInput = document.getElementById("searchInput");
const priority = document.getElementById("priority");
const themeBtn = document.getElementById("themeBtn");


// ===== VARIABLES =====

let tasks = [];
let filter = "all";


// ===== EVENTS =====

// add task
addBtn.addEventListener("click", addTask);

// enter key
input.addEventListener("keypress", function(e){
if(e.key === "Enter"){
addTask();
}
});

// search
searchInput.addEventListener("input", showTasks);

// dark mode toggle
themeBtn.addEventListener("click", function(){

document.body.classList.toggle("dark");

// save theme
if(document.body.classList.contains("dark")){
localStorage.setItem("theme","dark");
}else{
localStorage.setItem("theme","light");
}

});


// ===== ADD TASK =====

function addTask(){

if(input.value.trim() === ""){
alert("Write a task");
return;
}

// create object
tasks.push({
text: input.value,
completed: false,
priority: priority.value
});

saveData();
showTasks();

input.value = "";
}


// ===== SAVE DATA =====

function saveData(){
localStorage.setItem("tasks", JSON.stringify(tasks));
}


// ===== FILTER =====

function filterTasks(type){
filter = type;
showTasks();
}


// ===== SHOW TASKS =====

function showTasks(){

list.innerHTML = "";

tasks.forEach(function(task,index){

// filter
if(filter === "completed" && !task.completed) return;
if(filter === "pending" && task.completed) return;

// search
const keyword = searchInput.value.toLowerCase();
if(!task.text.toLowerCase().includes(keyword)) return;


// ===== CREATE LI =====
const li = document.createElement("li");
li.draggable = true;


// ===== DRAG EVENTS =====
li.addEventListener("dragstart", function(){
li.classList.add("dragging");
});

li.addEventListener("dragend", function(){
li.classList.remove("dragging");
updateTaskOrder(); // save order
});


// ===== CHECKBOX =====
const checkbox = document.createElement("input");
checkbox.type = "checkbox";
checkbox.checked = task.completed;

checkbox.onchange = function(){
task.completed = checkbox.checked;
saveData();
showTasks();
};

li.appendChild(checkbox);


// ===== TASK TEXT =====
const textSpan = document.createElement("span");
textSpan.classList.add("task-text");
textSpan.textContent = task.text;

li.appendChild(textSpan);


// ===== PRIORITY =====
const priorityTag = document.createElement("span");
priorityTag.textContent = " (" + task.priority + ")";

if(task.priority === "High") priorityTag.style.color = "red";
if(task.priority === "Medium") priorityTag.style.color = "orange";
if(task.priority === "Low") priorityTag.style.color = "green";

li.appendChild(priorityTag);


// ===== EDIT BUTTON =====
const editBtn = document.createElement("button");
editBtn.textContent = "Edit";

editBtn.onclick = function(){

const newTask = prompt("Edit task", task.text);

if(newTask){
task.text = newTask;
saveData();
showTasks();
}

};

li.appendChild(editBtn);


// ===== DELETE BUTTON =====
const delBtn = document.createElement("button");
delBtn.textContent = "Delete";
delBtn.classList.add("deleteBtn");

delBtn.onclick = function(){
tasks.splice(index,1);
saveData();
showTasks();
};

li.appendChild(delBtn);


// add to list
list.appendChild(li);

});

updateCounter();
}


// ===== DRAG DROP LOGIC =====

list.addEventListener("dragover", function(e){
e.preventDefault();

const dragging = document.querySelector(".dragging");
const afterElement = getDragAfterElement(list, e.clientY);

if(afterElement == null){
list.appendChild(dragging);
}else{
list.insertBefore(dragging, afterElement);
}
});


// helper
function getDragAfterElement(container, y){

const elements = [...container.querySelectorAll("li:not(.dragging)")];

return elements.reduce((closest, child) => {

const box = child.getBoundingClientRect();
const offset = y - box.top - box.height / 2;

if(offset < 0 && offset > closest.offset){
return { offset: offset, element: child };
}else{
return closest;
}

}, { offset: Number.NEGATIVE_INFINITY }).element;
}


// ===== UPDATE ORDER =====

function updateTaskOrder(){

const items = document.querySelectorAll("#taskList li");

let newTasks = [];

items.forEach(function(item){

const text = item.querySelector(".task-text").textContent;

const task = tasks.find(t => t.text === text);

if(task){
newTasks.push(task);
}

});

tasks = newTasks;

saveData();
}


// ===== COUNTER =====

function updateCounter(){

let total = tasks.length;

let completed = tasks.filter(function(task){
return task.completed;
}).length;

counter.textContent = "Total: " + total + " | Completed: " + completed;
}


// ===== LOAD DATA =====

function loadTasks(){

let stored = localStorage.getItem("tasks");

if(stored){
tasks = JSON.parse(stored);
}

showTasks();
}


// ===== LOAD THEME =====

let savedTheme = localStorage.getItem("theme");

if(savedTheme === "dark"){
document.body.classList.add("dark");
}


// start app
loadTasks();