// ===== get elements from HTML =====
const input = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const list = document.getElementById("taskList");

// our main data array
let tasks = [];

// button click
addBtn.addEventListener("click", addTask);

// Enter key press
input.addEventListener("keypress", function(e){
    if(e.key === "Enter"){
        addTask();
    }
});

// ===== ADD TASK =====
function addTask(){

    if(input.value.trim() === ""){
        alert("Please write a task");
        return;
    }

    tasks.push(input.value);

    saveData();
    showTasks();

    input.value = "";
}

// ===== SAVE DATA =====
function saveData(){
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// ===== SHOW TASKS =====
function showTasks(){

    list.innerHTML = "";

    tasks.forEach(function(task, index){

        const li = document.createElement("li");

        // create checkbox
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";

        checkbox.onchange = function(){

        if(checkbox.checked){
            li.style.textDecoration = "line-through"; // task completed
        } 
        else{
            li.style.textDecoration = "none"; // task not completed
        }

    };
        // add checkbox to li
        li.appendChild(checkbox);

        // add task text
        li.append(" " + task);

        const delBtn = document.createElement("button");
        delBtn.textContent = "Delete";
        delBtn.classList.add("deleteBtn");

        delBtn.onclick = function(){
            tasks.splice(index,1);
            saveData();
            showTasks();
        };

        li.appendChild(delBtn);
        list.appendChild(li);
    });
}

// ===== LOAD AFTER REFRESH =====
function loadTasks(){
    let stored = localStorage.getItem("tasks");

    if(stored){
        tasks = JSON.parse(stored);
        showTasks();
    }
}

// run on page load
loadTasks();
// its takes auto focus
input.autofocus(); 