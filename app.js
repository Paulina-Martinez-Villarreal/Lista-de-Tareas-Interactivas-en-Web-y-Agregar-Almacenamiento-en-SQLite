// Función para cargar tareas desde el servidor
function loadTasksFromServer() {
    fetch('http://localhost:3000/tasks')
        .then(response => response.json())
        .then(tasks => {
            tasks.forEach(task => {
                const li = document.createElement('li');
                li.textContent = task.text;

                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Eliminar';
                deleteButton.className = 'delete-btn';
                deleteButton.onclick = () => removeTask(li, task.id);

                li.appendChild(deleteButton);

                if (task.completed) {
                    li.classList.add('completed');
                }

                taskList.appendChild(li);
            });

            updateEmptyMessage();
        });
}

// Función para agregar una tarea
function addTask(event) {
    event.preventDefault(); 

    const taskText = newTaskInput.value.trim(); 

    if (taskText === '') {
        errorMessage.style.display = 'block';
        return;
    } else {
        errorMessage.style.display = 'none';
    }

    const newTask = { text: taskText, completed: false };

    fetch('http://localhost:3000/tasks', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newTask)
    })
        .then(response => response.json())
        .then(task => {
            const li = document.createElement('li');
            li.textContent = task.text;

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Eliminar';
            deleteButton.className = 'delete-btn';
            deleteButton.onclick = () => removeTask(li, task.id);

            li.appendChild(deleteButton);
            taskList.appendChild(li);
            newTaskInput.value = '';
            updateEmptyMessage();
        });
}

// Función para eliminar una tarea
function removeTask(taskItem, taskId) {
    taskItem.remove();

    fetch(`http://localhost:3000/tasks/${taskId}`, {
        method: 'DELETE'
    });

    updateEmptyMessage();
}

// Función para eliminar todas las tareas
function clearAllTasks() {
    taskList.innerHTML = ''; 
    fetch('http://localhost:3000/tasks', { method: 'DELETE' });
    updateEmptyMessage(); 
}

// Cargar tareas almacenadas desde el servidor cuando se carga la página
window.onload = loadTasksFromServer;
