// ===== GET HTML ELEMENTS =====

const counter = document.getElementById("taskCounter");
const input = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const list = document.getElementById("taskList");
const searchInput = document.getElementById("searchInput");
const priority = document.getElementById("priority");


// ===== VARIABLES =====

let tasks = [];
let filter = "all";


// ===== EVENTS =====

addBtn.addEventListener("click", addTask);

input.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        addTask();
    }
});

searchInput.addEventListener("input", showTasks);


// ===== ADD TASK =====

function addTask() {

    if (input.value.trim() === "") {
        alert("Write a task");
        return;
    }

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

function saveData() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}


// ===== FILTER BUTTON =====

function filterTasks(type) {
    filter = type;
    showTasks();
}


// ===== SHOW TASKS =====

function showTasks() {

    list.innerHTML = "";

    tasks.forEach(function (task, index) {

        // filter completed
        if (filter === "completed" && !task.completed) {
            return;
        }

        // filter pending
        if (filter === "pending" && task.completed) {
            return;
        }

        // search filter
        const keyword = searchInput.value.toLowerCase();

        if (!task.text.toLowerCase().includes(keyword)) {
            return;
        }

        // create list item
        const li = document.createElement("li");
        li.draggable = true;
        li.addEventListener("dragstart", function () {
            li.classList.add("dragging");
        });
        li.addEventListener("dragend", function () {
            li.classList.remove("dragging");
        });

        // checkbox
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;

        checkbox.onchange = function () {
            task.completed = checkbox.checked;
            saveData();
            showTasks();
        };

        li.appendChild(checkbox);

        // strike if completed
        if (task.completed) {
            li.style.textDecoration = "line-through";
        }

        // text
        li.append(" " + task.text);

        // add priority 
        const priorityTag = document.createElement("span");
        priorityTag.textContent = "(" + task.priority + ")";
        li.appendChild(priorityTag);


        // color by priority
        if (task.priority === "High") {
            priorityTag.style.color = "red";
        }

        if (task.priority === "Medium") {
            priorityTag.style.color = "orange";
        }

        if (task.priority === "Low") {
            priorityTag.style.color = "green";
        }



        // edit button
        const editBtn = document.createElement("button");
        editBtn.textContent = "Edit";

        editBtn.onclick = function () {

            const newTask = prompt("Edit task", task.text);

            if (newTask) {
                task.text = newTask;
                saveData();
                showTasks();
            }

        };

        li.appendChild(editBtn);


        // delete button
        const delBtn = document.createElement("button");
        delBtn.textContent = "Delete";

        delBtn.onclick = function () {

            tasks.splice(index, 1);
            saveData();
            showTasks();

        };

        li.appendChild(delBtn);

        list.appendChild(li);

    });

    updateCounter();
}

list.addEventListener("dragover", function (e) {
    e.preventDefault();

    const dragging =
        document.querySelector(".dragging");

    const afterElement =
        getDragAfterElement(list, e.clientY);

    if (afterElement == null) {
        list.appendChild(dragging);
    }
    else {
        list.insertBefore(dragging, afterElement);
    }
})

function getDragAfterElement(container, y){

    const draggableElements = [...container.querySelectorAll("li:not(.dragging)")];

    return draggableElements.reduce((closest, child) => {

        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;

        if(offset < 0 && offset > closest.offset){
            return { offset: offset, element: child };
        }else{
            return closest;
        }

    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

// ===== UPDATE COUNTER =====

function updateCounter() {

    let total = tasks.length;

    let completed = tasks.filter(function (task) {
        return task.completed;
    }).length;

    counter.textContent = "Total: " + total + " | Completed: " + completed;

}


// ===== LOAD TASKS =====

function loadTasks() {

    let stored = localStorage.getItem("tasks");

    if (stored) {
        tasks = JSON.parse(stored);
    }

    showTasks();

}

loadTasks();