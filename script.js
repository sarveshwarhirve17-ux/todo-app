// ===== GET HTML ELEMENTS =====

// task counter
const counter = document.getElementById("taskCounter");

// input box
const input = document.getElementById("taskInput");

// add button
const addBtn = document.getElementById("addBtn");

// task list
const list = document.getElementById("taskList");


// ===== MAIN TASK ARRAY =====
let tasks = [];

// current filter
let filter = "all";


// ===== ADD BUTTON EVENT =====
addBtn.addEventListener("click", addTask);


// ===== ENTER KEY EVENT =====
input.addEventListener("keypress", function(e){
if(e.key === "Enter"){
addTask();
}
});


// ===== ADD TASK =====
function addTask(){

// prevent empty task
if(input.value.trim() === ""){
alert("Please write a task");
return;
}

// push task object
tasks.push({
text: input.value,
completed:false
});

// save in browser
saveData();

// redraw UI
showTasks();

// clear input
input.value = "";
}


// ===== SAVE DATA IN LOCAL STORAGE =====
function saveData(){

// convert array → string
localStorage.setItem("tasks", JSON.stringify(tasks));

}


// ===== FILTER BUTTON CLICK =====
function filterTasks(type, event){

// change filter
filter = type;

// remove active class
const buttons = document.querySelectorAll(".filterBtn");
buttons.forEach(function(btn){
btn.classList.remove("active");
});

// highlight clicked button
event.target.classList.add("active");

// redraw tasks
showTasks();
}


// ===== SHOW TASKS =====
function showTasks(){

// clear list
list.innerHTML = "";

// loop tasks
tasks.forEach(function(task, index){

// filter logic
if(filter === "completed" && !task.completed){
return;
}

if(filter === "pending" && task.completed){
return;
}

// create list item
const li = document.createElement("li");

// checkbox
const checkbox = document.createElement("input");
checkbox.type = "checkbox";
checkbox.checked = task.completed;

// checkbox change
checkbox.onchange = function(){

task.completed = checkbox.checked;

saveData();
showTasks();

};

li.appendChild(checkbox);

// task text
li.append(" " + task.text);


// EDIT BUTTON
const editBtn = document.createElement("button");
editBtn.textContent = "Edit";

editBtn.onclick = function(){

const newTask = prompt("Edit your task:", task.text);

if(newTask){
tasks[index].text = newTask;

saveData();
showTasks();
}

};

li.appendChild(editBtn);


// DELETE BUTTON
const delBtn = document.createElement("button");
delBtn.textContent = "Delete";
delBtn.classList.add("deleteBtn");

delBtn.onclick = function(){

tasks.splice(index,1);

saveData();
showTasks();

};

li.appendChild(delBtn);

// add li to ul
list.appendChild(li);

});

// ===== UPDATE COUNTER =====

let total = tasks.length;

let completed = tasks.filter(function(task){
return task.completed;
}).length;

counter.textContent =
"Total: " + total + " | Completed: " + completed;

}


// ===== LOAD TASKS AFTER REFRESH =====
function loadTasks(){

let stored = localStorage.getItem("tasks");

if(stored){
tasks = JSON.parse(stored);
showTasks();
}

}


// run when page loads
loadTasks();


// focus input
input.focus();