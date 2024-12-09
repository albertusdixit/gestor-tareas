const taskList = document.getElementById('task-list');
const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskButton = taskForm.querySelector('button'); // Selecciona el botón del formulario

// Fetch tasks from the API
const fetchTasks = async () => {
    try {
        const response = await fetch('/tasks');
        if (!response.ok) throw new Error('Error fetching tasks');
        const tasks = await response.json();

        // Clear the task list before rendering
        taskList.innerHTML = '';

        tasks.forEach(task => {
            const li = document.createElement('li');
            li.className = 'task-item';
            if (task.completed) {
                li.classList.add('completed'); // Add completed class if task is completed
            }

            const taskText = document.createElement('span');
            taskText.className = 'task-text';
            taskText.textContent = task.title;

            const taskActions = document.createElement('div');
            taskActions.className = 'task-actions';

            const completeButton = document.createElement('button');
            completeButton.textContent = task.completed ? 'Desmarcar' : 'Completar';
            completeButton.onclick = () => toggleTaskCompletion(task.id, task.completed);

            const editButton = document.createElement('button');
            editButton.textContent = 'Editar';
            editButton.onclick = () => startEditingTask(task.id, task.title);

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Eliminar';
            deleteButton.onclick = () => deleteTask(task.id);

            taskActions.appendChild(completeButton);
            taskActions.appendChild(editButton);
            taskActions.appendChild(deleteButton);

            li.appendChild(taskText);
            li.appendChild(taskActions);
            taskList.appendChild(li);

            // Animation class
            setTimeout(() => li.classList.add('visible'), 10);
        });
    } catch (error) {
        console.error('Error al cargar las tareas:', error.message);
        showToast('No se pudieron cargar las tareas. Intenta nuevamente.', 'red');
    }
};

// Función para agregar una nueva tarea
const addTask = async (title) => {
    try {
        const response = await fetch('/tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title }),
        });
        if (!response.ok) throw new Error('Error al agregar la tarea');
        fetchTasks();
        showToast('Tarea agregada exitosamente', '#4CAF50'); // Verde para éxito
    } catch (error) {
        console.error('Error al agregar la tarea:', error.message);
        showToast('Error al agregar la tarea', 'red');
    }
};

// Función para iniciar la edición de una tarea
const startEditingTask = (id, currentTitle) => {
    taskInput.value = currentTitle; // Llena el campo con el título actual
    taskButton.textContent = 'Actualizar Tarea'; // Cambia el texto del botón
    taskForm.onsubmit = (event) => {
        event.preventDefault();
        const updatedTitle = taskInput.value.trim();
        if (updatedTitle === '') {
            showToast('El título no puede estar vacío.', 'red');
            return;
        }
        editTask(id, updatedTitle);
        taskInput.value = ''; // Limpia el campo después de editar
        taskButton.textContent = 'Agregar Tarea'; // Restaura el texto del botón
        taskForm.onsubmit = handleFormSubmit; // Restaura el comportamiento original
    };
};

// Función para editar una tarea
const editTask = async (id, title) => {
    try {
        const response = await fetch(`/tasks/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title }),
        });
        if (!response.ok) throw new Error('Error al editar la tarea');
        fetchTasks();
        showToast('Tarea editada exitosamente', '#FFC107'); // Amarillo para edición
    } catch (error) {
        console.error('Error al editar la tarea:', error.message);
        showToast('Error al editar la tarea', 'red');
    }
};

// Función para eliminar una tarea
const deleteTask = async (id) => {
    try {
        const response = await fetch(`/tasks/${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Error al eliminar la tarea');
        fetchTasks();
        showToast('Tarea eliminada exitosamente', '#2196F3'); // Azul para eliminación
    } catch (error) {
        console.error('Error al eliminar la tarea:', error.message);
        showToast('Error al eliminar la tarea', 'red');
    }
};

// Manejo original del envío del formulario
const handleFormSubmit = (event) => {
    event.preventDefault();
    const title = taskInput.value.trim();
    if (title === '') {
        showToast('El título de la tarea no puede estar vacío.', 'red');
        return;
    }
    addTask(title);
    taskInput.value = '';
};

// Asocia el evento de envío al formulario
taskForm.onsubmit = handleFormSubmit;

// Función para mostrar notificaciones (toasts)
const showToast = (message, color = "green") => {
    Toastify({
        text: message,
        duration: 3000,
        gravity: "top",
        position: "center",
        backgroundColor: color,
        stopOnFocus: true,
    }).showToast();
};

const toggleTaskCompletion = async (id, currentStatus) => {
    try {
        const response = await fetch(`/tasks/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ completed: !currentStatus }),
        });
        if (!response.ok) throw new Error('Error toggling task completion');
        fetchTasks(); // Refresh the task list
    } catch (error) {
        console.error('Error toggling task completion:', error.message);
        alert('Failed to update task completion status.');
    }
};

// Carga las tareas al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    fetchTasks();
});
