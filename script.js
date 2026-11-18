
const form = document.getElementById("task-form");
const input = document.getElementById("task-input");
const taskList = document.getElementById("task-list");
const counter = document.getElementById("task-counter");
const emptyState = document.getElementById("empty-state");
const clearCompleted = document.getElementById("clear-completed");
const filters = document.querySelectorAll(".filter");

let tasks = JSON.parse(localStorage.getItem("devtasks")) || [];
let currentFilter = "all";

function saveTasks() {
    localStorage.setItem("devtasks", JSON.stringify(tasks));
}

function updateDate() {
    const dateElement = document.getElementById("current-date");

    dateElement.textContent = new Date().toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric"
    });
}

function renderTasks() {
    taskList.innerHTML = "";

    let filteredTasks = tasks.filter(task => {
        if (currentFilter === "pending") return !task.completed;
        if (currentFilter === "completed") return task.completed;
        return true;
    });

    filteredTasks.forEach(task => {
        const li = document.createElement("li");
        li.className = `task-item ${task.completed ? "done" : ""}`;

        const checkButton = document.createElement("button");
        checkButton.className = "check-button";
        checkButton.setAttribute("aria-label", "Alternar conclusão");
        checkButton.textContent = task.completed ? "✓" : "";

        checkButton.addEventListener("click", () => {
            toggleTask(task.id);
        });

        const text = document.createElement("span");
        text.className = "task-text";
        text.textContent = task.text;

        const deleteButton = document.createElement("button");
        deleteButton.className = "delete-button";
        deleteButton.textContent = "×";
        deleteButton.setAttribute("aria-label", "Excluir tarefa");

        deleteButton.addEventListener("click", () => {
            deleteTask(task.id);
        });

        li.append(checkButton, text, deleteButton);
        taskList.appendChild(li);
    });

    const pending = tasks.filter(task => !task.completed).length;

    counter.textContent = pending === 1
        ? "1 tarefa pendente"
        : `${pending} tarefas pendentes`;

    emptyState.style.display = filteredTasks.length === 0
        ? "block"
        : "none";

    if (filteredTasks.length === 0 && currentFilter !== "all") {
        emptyState.querySelector("h3").textContent = "Nada encontrado";
        emptyState.querySelector("p").textContent =
            "Não existem tarefas neste filtro.";
    } else {
        emptyState.querySelector("h3").textContent =
            "Nenhuma tarefa por aqui";
        emptyState.querySelector("p").textContent =
            "Adicione uma tarefa e comece a organizar seu dia.";
    }

    saveTasks();
}

function addTask(text) {
    const task = {
        id: Date.now(),
        text: text.trim(),
        completed: false
    };

    if (!task.text) return;

    tasks.unshift(task);
    renderTasks();
}

function toggleTask(id) {
    tasks = tasks.map(task =>
        task.id === id
            ? { ...task, completed: !task.completed }
            : task
    );

    renderTasks();
}

function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    renderTasks();
}

form.addEventListener("submit", function(event) {
    event.preventDefault();

    const text = input.value.trim();

    if (text) {
        addTask(text);
        input.value = "";
        input.focus();
    }
});

filters.forEach(button => {
    button.addEventListener("click", () => {
        filters.forEach(filter => filter.classList.remove("active"));

        button.classList.add("active");
        currentFilter = button.dataset.filter;

        renderTasks();
    });
});

clearCompleted.addEventListener("click", () => {
    tasks = tasks.filter(task => !task.completed);
    renderTasks();
});

updateDate();
renderTasks();
