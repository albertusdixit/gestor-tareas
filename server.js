const http = require('http');
const fs = require('fs').promises;
const path = require('path');

// Define the absolute path for tasks.json
const tasksFilePath = path.join(__dirname, 'tasks.json');
console.log('Using tasks.json path:', tasksFilePath); // Debugging log

// Función para obtener las tareas desde tasks.json
const getTasks = async () => {
    try {
        console.log('Reading tasks from:', tasksFilePath); // Debugging log
        const data = await fs.readFile(tasksFilePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading tasks.json:', error.message); // Debugging log
        return []; // Si no existe el archivo o hay un error, devuelve un array vacío
    }
};

// Función para guardar tareas en tasks.json
const saveTasks = async (tasks) => {
    try {
        console.log('Writing tasks to:', tasksFilePath); // Debugging log
        await fs.writeFile(tasksFilePath, JSON.stringify(tasks, null, 2));
        console.log('Tasks successfully saved.'); // Debugging log
    } catch (error) {
        console.error('Error writing to tasks.json:', error.message); // Debugging log
    }
};

// Crear el servidor
const server = http.createServer(async (req, res) => {
    if (req.method === 'GET' && req.url === '/') {
        // Servir la página principal
        const filePath = path.join(__dirname, 'public', 'index.html');
        try {
            const content = await fs.readFile(filePath);
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(content);
        } catch (err) {
            console.error('Error serving index.html:', err.message); // Debugging log
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Error interno del servidor');
        }
    } else if (req.method === 'GET' && req.url.startsWith('/public/')) {
        // Servir archivos estáticos de la carpeta public
        const filePath = path.join(__dirname, req.url);
        try {
            const content = await fs.readFile(filePath);
            res.writeHead(200, { 'Content-Type': getContentType(filePath) });
            res.end(content);
        } catch (err) {
            console.error('Error serving static file:', err.message); // Debugging log
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Archivo no encontrado');
        }
    } else if (req.method === 'GET' && req.url === '/tasks') {
        // Manejar GET /tasks
        const tasks = await getTasks();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(tasks));
    } else if (req.method === 'POST' && req.url === '/tasks') {
        let body = '';
        req.on('data', chunk => {
            body += chunk;
        });
        req.on('end', async () => {
            try {
                const newTask = JSON.parse(body);
                // Validar que el título no esté vacío
                if (!newTask.title || newTask.title.trim() === '') {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'El título de la tarea no puede estar vacío.' }));
                    return;
                }
                const tasks = await getTasks();
                newTask.id = Date.now().toString();
                tasks.push(newTask);
                await saveTasks(tasks);
                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(newTask));
            } catch (error) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Error al procesar la solicitud' }));
            }
        });
    } else if (req.method === 'PUT' && req.url.startsWith('/tasks/')) {
        const id = req.url.split('/')[2]; // Extraer el ID de la URL
        let body = '';
        req.on('data', chunk => {
            body += chunk;
        });
        req.on('end', async () => {
            try {
                const updatedTask = JSON.parse(body);
                if (!updatedTask.title || updatedTask.title.trim() === '') {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'El título de la tarea no puede estar vacío.' }));
                    return;
                }
    
                const tasks = await getTasks();
                const taskIndex = tasks.findIndex(task => task.id === id);
    
                if (taskIndex === -1) {
                    res.writeHead(404, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'Tarea no encontrada' }));
                    return;
                }
    
                // Actualizar solo el título
                tasks[taskIndex].title = updatedTask.title.trim();
                await saveTasks(tasks);
    
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(tasks[taskIndex]));
            } catch (error) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Error al procesar la solicitud' }));
            }
        });
    } else if (req.method === 'DELETE' && req.url.startsWith('/tasks/')) {
        // Manejar DELETE /tasks/:id
        const id = req.url.split('/')[2];
        const tasks = await getTasks();
        const filteredTasks = tasks.filter(task => task.id !== id);

        if (tasks.length === filteredTasks.length) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Tarea no encontrada' }));
            return;
        }

        await saveTasks(filteredTasks);

        res.writeHead(204); // No Content
        res.end();
    } else {
        // Ruta no encontrada
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Ruta no encontrada' }));
    }
});

// Determinar el tipo de contenido basado en la extensión del archivo
const getContentType = (filePath) => {
    const extname = path.extname(filePath).toLowerCase();
    const contentTypes = {
        '.html': 'text/html',
        '.css': 'text/css',
        '.js': 'application/javascript',
    };
    return contentTypes[extname] || 'application/octet-stream';
};

// Iniciar el servidor
server.listen(3000, () => {
    console.log('Servidor escuchando en http://localhost:3000');
});
