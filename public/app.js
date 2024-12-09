const taskList = document.getElementById('task-list');
const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskButton = taskForm.querySelector('button'); // Selecciona el botón del formulario

// Función para cargar las tareas desde la API
const fetchTasks = async () => {
    try {
        const response = await fetch('/tasks');
        if (!response.ok) throw new Error('Error al obtener las tareas');
        const tasks = await response.json();

        // Limpia la lista antes de renderizar
        taskList.innerHTML = '';

        // Renderiza cada tarea en la lista
        tasks.forEach(task => {
            const li = document.createElement('li');
            li.className = 'task-item';

            // Contenedor del texto de la tarea
            const taskText = document.createElement('span');
            taskText.className = 'task-text';
            taskText.textContent = task.title;

            // Contenedor de botones
            const taskActions = document.createElement('div');
            taskActions.className = 'task-actions';

            const editButton = document.createElement('button');
            editButton.textContent = 'Editar';
            editButton.onclick = () => startEditingTask(task.id, task.title);

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Eliminar';
            deleteButton.onclick = () => deleteTask(task.id);

            taskActions.appendChild(editButton);
            taskActions.appendChild(deleteButton);

            li.appendChild(taskText);
            li.appendChild(taskActions);
            taskList.appendChild(li);

            // Clase de animación
            setTimeout(() => li.classList.add('visible'), 10);
        });
    } catch (error) {
        console.error('Error al cargar las tareas:', error.message);
        alert('No se pudieron cargar las tareas. Por favor, intenta nuevamente.');
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
        showToast('Tarea agregada exitosamente');
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
            alert('El título de la tarea no puede estar vacío.');
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
        showToast('Tarea editada exitosamente');
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
        showToast('Tarea eliminada exitosamente');
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
        alert('El título de la tarea no puede estar vacío.');
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

// Carga las tareas al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    fetchTasks();
});
