const taskList = document.getElementById('task-list');
const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');

// Función para cargar las tareas desde la API
const fetchTasks = async () => {
    const response = await fetch('/tasks');
    const tasks = await response.json();

    // Limpia la lista antes de renderizar
    taskList.innerHTML = '';

    // Renderiza cada tarea en la lista
    tasks.forEach(task => {
        const li = document.createElement('li');
        li.textContent = task.title;

        // Botón para eliminar
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Eliminar';
        deleteButton.onclick = () => deleteTask(task.id);

        li.appendChild(deleteButton);
        taskList.appendChild(li);
    });
};

// Función para agregar una nueva tarea
const addTask = async (title) => {
    await fetch('/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
    });
    fetchTasks();
};

// Función para eliminar una tarea
const deleteTask = async (id) => {
    await fetch(`/tasks/${id}`, { method: 'DELETE' });
    fetchTasks();
};

// Evento para manejar el envío del formulario
taskForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const title = taskInput.value.trim(); // Elimina espacios en blanco
    if (title === '') {
        // Muestra un mensaje de error si la entrada es inválida
        alert('El título de la tarea no puede estar vacío.');
        return;
    }
    addTask(title); // Llama a la función para agregar la tarea
    taskInput.value = ''; // Limpia el campo después de agregar
});


// Carga las tareas al cargar la página
fetchTasks();
