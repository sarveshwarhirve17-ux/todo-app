console.log("JS connected"); // heart beat of code
const input = document.getElementById("taskInput");  // by this we give the control of html element to java sript 
const button = document.getElementById("addbtn");
const list = document.getElementById("tasklist");

button.addEventListener("click", addTask); // by this we can take input by one click on web site.


input.addEventListener("keypress", function(event){
    if(event.key === "Enter"){                             // this piece of code is for: when we type "Enter" the task will be added
        addTask();                           
    }
});


function addTask() {

    if(input.value === ""){
        alert("Write something!"); // id we cannot write any thing this will tell us write some this 
        return; // this will stop the code here only
    }

    const li = document.createElement("li"); // this will make the new list 
    li.textContent = input.value;

    const delBtn = document.createElement("button"); // here we have added the delete button if we have to delete the task
    delBtn.textContent = "Delete";

    delBtn.onclick = function(){
        li.remove(); // if we delete the task list will be remove 
        saveData();  // the data will be save 
    }

    li.appendChild(delBtn); // we put deleted button inside 
    list.appendChild(li); 

    input.value = ""; // after reload the block will remain empty 

    saveData();
}

function saveData(){
    localStorage.setItem("tasks", list.innerHTML); // this will store data at broswer
}

function showData(){
    const data = localStorage.getItem("tasks");

    if(data){
        list.innerHTML = data;
        attachDeleteEvents();
    }
}

function attachDeleteEvents(){
    const deleteButtons = document.querySelectorAll("#tasklist button");

    deleteButtons.forEach(function(btn){
        btn.onclick = function(){
            btn.parentElement.remove();
            saveData();
        }
    });
}

showData(); // this is will show privious task