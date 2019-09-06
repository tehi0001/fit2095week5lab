function isValidForm() {
    let required = document.querySelectorAll("[required]");
    let valid = true;
    for(let i = 0; i < required.length; i++) {
        if(required[i].value === "") {
            required[i].classList.add("error-field");
            valid = false
        }
        else {
            required[i].classList.remove("error-field");
        }
    }

    return valid;
}

function addTask() {
    if(isValidForm()) {
        let data = {
            taskName: document.querySelector("#task-name").value,
            assignTo: document.querySelector("#assign-to").value,
            taskDate: document.querySelector("#date").value,
            taskStatus: document.querySelector("#status").value,
            taskDescription: document.querySelector("#description").value
        };

        data = JSON.stringify(data);

        let xhr = new XMLHttpRequest();

        xhr.onreadystatechange = function() {
            if(this.readyState == 4 && this.status == 200) {
                if(this.responseText === "done") {
                    loadPage("/viewtasks", event);
                }
            }
        }

        xhr.open("POST", "/addtask", true);
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.send(data);
    }

    return false;
}

function addDev() {
    return false;
}

function closeModal() {
    document.querySelector(".backdrop").style.display = 'none';
}

function showModal() {
    document.querySelector(".backdrop").style.display = 'block';
}

function loadPage(url, event) {
    event.preventDefault();
    let xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function() {
        if(this.readyState == 4 && this.status == 200) {
            if(this.responseText === "done") {
                loadPage('/viewtasks', event);
            }
            else {
                document.querySelector(".modal-body").innerHTML = this.responseText;
                showModal();
            }
        }
    }

    xhr.open("GET", url, true);
    xhr.send();
}