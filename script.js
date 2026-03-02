// ===== get elements from HTML =====
const input = document.getElementById("taskInput"); // textbox
const addBtn = document.getElementById("addBtn");   // add button
const list = document.getElementById("taskList");   // <ul> list

// our REAL data (main database)
let tasks = [];


// ===== when Add button clicked =====
addBtn.addEventListener("click", addTask);


// ===== when Enter key pressed =====
input.addEventListener("keypress", function(e){
    if(e.key === "Enter"){
        addTask();
    }
});


// ================= ADD TASK =================
function addTask(){

    // stop empty input
    if(input.value.trim() === ""){
        alert("Please write a task");
        return;
    }

    // add task into array
    tasks.push(input.value);

    // save into browser memory
    saveData();

    // redraw screen
    showTasks();

    // clear textbox
    input.value = "";
}


// ================= SAVE DATA =================
function saveData(){

    // localStorage stores only TEXT
    // convert array → text
    localStorage.setItem("tasks", JSON.stringify(tasks));
}


// ================= SHOW TASKS =================
function showTasks(){

    // clear screen first
    list.innerHTML = "";

    // loop through array
    tasks.forEach(function(task, index){

        // create <li>
        const li = document.createElement("li");
        li.textContent = task;

        // create Delete button
        const delBtn = document.createElement("button");
        delBtn.textContent = "Delete";
        delBtn.classList.add("deleteBtn");

        // delete task
        delBtn.onclick = function(){

            // remove from array
            tasks.splice(index,1);

            // update storage
            saveData();

            // update screen
            showTasks();
        };

        // put button inside li
        li.appendChild(delBtn);

        // put li inside ul
        list.appendChild(li);
    });
}


// ================= LOAD AFTER REFRESH =================
function loadTasks(){

    // get saved data
    let stored = localStorage.getItem("tasks");

    // if data exists
    if(stored){
        tasks = JSON.parse(stored); // text → array
        showTasks();                // show on screen
    }
}

// run when page opens
loadTasks();