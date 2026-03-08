// ===== GET HTML ELEMENTS =====

const counter = document.getElementById("taskCounter");
const input = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const list = document.getElementById("taskList");
const searchInput = document.getElementById("searchInput");


// ===== VARIABLES =====

let tasks = [];
let filter = "all";


// ===== EVENTS =====

addBtn.addEventListener("click", addTask);

input.addEventListener("keypress", function(e){
    if(e.key === "Enter"){
        addTask();
    }
});

searchInput.addEventListener("input", showTasks);


// ===== ADD TASK =====

function addTask(){

    if(input.value.trim() === ""){
        alert("Write a task");
        return;
    }

    tasks.push({
        text: input.value,
        completed: false
    });

    saveData();
    showTasks();

    input.value = "";
}


// ===== SAVE DATA =====

function saveData(){
    localStorage.setItem("tasks", JSON.stringify(tasks));
}


// ===== FILTER BUTTON =====

function filterTasks(type){
    filter = type;
    showTasks();
}


// ===== SHOW TASKS =====

function showTasks(){

    list.innerHTML = "";

    tasks.forEach(function(task,index){

        // filter completed
        if(filter === "completed" && !task.completed){
            return;
        }

        // filter pending
        if(filter === "pending" && task.completed){
            return;
        }

        // search filter
        const keyword = searchInput.value.toLowerCase();

        if(!task.text.toLowerCase().includes(keyword)){
            return;
        }

        // create list item
        const li = document.createElement("li");

        // checkbox
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;

        checkbox.onchange = function(){
            task.completed = checkbox.checked;
            saveData();
            showTasks();
        };

        li.appendChild(checkbox);

        // strike if completed
        if(task.completed){
            li.style.textDecoration = "line-through";
        }

        // text
        li.append(" " + task.text);


        // edit button
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


        // delete button
        const delBtn = document.createElement("button");
        delBtn.textContent = "Delete";

        delBtn.onclick = function(){

            tasks.splice(index,1);
            saveData();
            showTasks();

        };

        li.appendChild(delBtn);

        list.appendChild(li);

    });

    updateCounter();
}


// ===== UPDATE COUNTER =====

function updateCounter(){

    let total = tasks.length;

    let completed = tasks.filter(function(task){
        return task.completed;
    }).length;

    counter.textContent = "Total: " + total + " | Completed: " + completed;

}


// ===== LOAD TASKS =====

function loadTasks(){

    let stored = localStorage.getItem("tasks");

    if(stored){
        tasks = JSON.parse(stored);
    }

    showTasks();

}

loadTasks();