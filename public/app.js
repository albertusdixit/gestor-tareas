const taskList = document.getElementById('task-list');
const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');

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
            li.textContent = task.title;

            // Botón para editar
            const editButton = document.createElement('button');
            editButton.textContent = 'Editar';
            editButton.onclick = () => startEditingTask(task.id, task.title);

            // Botón para eliminar
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Eliminar';
            deleteButton.onclick = () => deleteTask(task.id);

            li.appendChild(editButton);
            li.appendChild(deleteButton);
            taskList.appendChild(li);
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
    } catch (error) {
        console.error('Error al agregar la tarea:', error.message);
        alert('No se pudo agregar la tarea. Por favor, intenta nuevamente.');
    }
};

// Función para iniciar la edición de una tarea
const startEditingTask = (id, currentTitle) => {
    taskInput.value = currentTitle; // Llena el campo con el título actual
    taskForm.onsubmit = (event) => {
        event.preventDefault();
        const updatedTitle = taskInput.value.trim();
        if (updatedTitle === '') {
            alert('El título de la tarea no puede estar vacío.');
            return;
        }
        editTask(id, updatedTitle);
        taskInput.value = ''; // Limpia el campo después de editar
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
    } catch (error) {
        console.error('Error al editar la tarea:', error.message);
        alert('No se pudo editar la tarea. Por favor, intenta nuevamente.');
    }
};

// Función para eliminar una tarea
const deleteTask = async (id) => {
    try {
        const response = await fetch(`/tasks/${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Error al eliminar la tarea');
        fetchTasks();
    } catch (error) {
        console.error('Error al eliminar la tarea:', error.message);
        alert('No se pudo eliminar la tarea. Por favor, intenta nuevamente.');
    }
};

// Manejo original del envío del formulario
const handleFormSubmit = (event) => {
    event.preventDefault();
    const title = taskInput.value.trim(); // Elimina espacios en blanco
    if (title === '') {
        alert('El título de la tarea no puede estar vacío.');
        return;
    }
    addTask(title);
    taskInput.value = '';
};
taskForm.onsubmit = handleFormSubmit; // Establecer el comportamiento original

// Carga las tareas al cargar la página
fetchTasks();
