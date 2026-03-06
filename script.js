// ===== GET ELEMENTS FROM HTML =====

// element showing task counter
const counter = document.getElementById("taskCounter");

// input field
const input = document.getElementById("taskInput");

// add button
const addBtn = document.getElementById("addBtn");

// task list container
const list = document.getElementById("taskList");


// ===== MAIN ARRAY TO STORE TASKS =====
// each task will be an object like:
// { text: "Study", completed: false }
let tasks = [];


// ===== BUTTON CLICK EVENT =====
addBtn.addEventListener("click", addTask);


// ===== ENTER KEY EVENT =====
input.addEventListener("keypress", function(e){
    if(e.key === "Enter"){
        addTask();
    }
});


// ===== FUNCTION TO ADD TASK =====
function addTask(){

    // stop if input empty
    if(input.value.trim() === ""){
        alert("Please write a task");
        return;
    }

    // add new task object into array
    tasks.push({
        text: input.value,
        completed: false
    });

    // save tasks in browser storage
    saveData();

    // redraw task list
    showTasks();

    // clear input box
    input.value = "";
}


// ===== SAVE DATA IN LOCAL STORAGE =====
function saveData(){

    // convert array → string
    localStorage.setItem("tasks", JSON.stringify(tasks));

}


// ===== DISPLAY TASKS ON SCREEN =====
function showTasks(){

    // clear previous list
    list.innerHTML = "";

    // loop through tasks array
    tasks.forEach(function(task, index){

        // create list item
        const li = document.createElement("li");


        // ===== CREATE CHECKBOX =====
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";

        // checkbox state based on task.completed
        checkbox.checked = task.completed;

        // when checkbox changes
        checkbox.onchange = function(){

            // update completed value
            task.completed = checkbox.checked;

            // save updated data
            saveData();

            // apply line-through style
            if(checkbox.checked){
                li.style.textDecoration = "line-through";
            } else {
                li.style.textDecoration = "none";
            }

            // update counter
            updateCounter();
        };

        // add checkbox to li
        li.appendChild(checkbox);


        // ===== TASK TEXT =====
        li.append(" " + task.text);


        // ===== EDIT BUTTON =====
        const editBtn = document.createElement("button");
        editBtn.textContent = "Edit";

        editBtn.onclick = function(){

            // ask user for new text
            const newTask = prompt("Edit your task:", task.text);

            if(newTask){
                tasks[index].text = newTask;
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

            // remove task from array
            tasks.splice(index,1);

            saveData();
            showTasks();
        };

        li.appendChild(delBtn);


        // add li to ul
        list.appendChild(li);

    });

    // update counter after rendering tasks
    updateCounter();
}


// ===== UPDATE TASK COUNTER =====
function updateCounter(){

    // count completed tasks
    let completed = tasks.filter(function(task){
        return task.completed;
    }).length;

    // show counter text
    counter.textContent = "Total: " + tasks.length + " | Completed: " + completed;

}


// ===== LOAD TASKS AFTER PAGE REFRESH =====
function loadTasks(){

    // get stored tasks
    let stored = localStorage.getItem("tasks");

    if(stored){
        tasks = JSON.parse(stored);
        showTasks();
    }

}


// run when page loads
loadTasks();


// focus cursor in input field
input.focus();