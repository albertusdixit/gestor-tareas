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
    const serveFile = async (filePath, contentType) => {
        try {
            const content = await fs.readFile(filePath);
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content);
        } catch (err) {
            console.error('Error serving file:', filePath, err.message); // Debugging log
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('File not found');
        }
    };

    if (req.method === 'GET' && req.url === '/') {
        // Serve the main HTML file
        const filePath = path.join(__dirname, 'public', 'index.html');
        await serveFile(filePath, 'text/html');
    } else if (req.method === 'GET' && req.url.startsWith('/public/')) {
        // Serve files from the public directory
        const filePath = path.join(__dirname, req.url);
        const contentType = getContentType(filePath);
        await serveFile(filePath, contentType);
    } else if (req.method === 'GET' && req.url.startsWith('/node_modules/')) {
        // Serve files from the node_modules directory
        const filePath = path.join(__dirname, req.url);
        const contentType = getContentType(filePath);
        await serveFile(filePath, contentType);
    } else if (req.method === 'GET' && req.url === '/tasks') {
        // Handle GET /tasks
        const tasks = await getTasks();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(tasks));
    } else if (req.method === 'POST' && req.url === '/tasks') {
        // Handle POST /tasks
        let body = '';
        req.on('data', chunk => {
            body += chunk;
        });
        req.on('end', async () => {
            try {
                const newTask = JSON.parse(body);
                if (!newTask.title || newTask.title.trim() === '') {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'Task title cannot be empty.' }));
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
                res.end(JSON.stringify({ message: 'Error processing the request' }));
            }
        });
    } else if (req.method === 'PUT' && req.url.startsWith('/tasks/')) {
        // Handle PUT /tasks/:id
        const id = req.url.split('/')[2];
        let body = '';
        req.on('data', chunk => {
            body += chunk;
        });
        req.on('end', async () => {
            try {
                const updatedTask = JSON.parse(body);
                if (!updatedTask.title || updatedTask.title.trim() === '') {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'Task title cannot be empty.' }));
                    return;
                }
                const tasks = await getTasks();
                const taskIndex = tasks.findIndex(task => task.id === id);
                if (taskIndex === -1) {
                    res.writeHead(404, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'Task not found.' }));
                    return;
                }
                tasks[taskIndex].title = updatedTask.title.trim();
                await saveTasks(tasks);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(tasks[taskIndex]));
            } catch (error) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Error processing the request' }));
            }
        });
    } else if (req.method === 'DELETE' && req.url.startsWith('/tasks/')) {
        // Handle DELETE /tasks/:id
        const id = req.url.split('/')[2];
        const tasks = await getTasks();
        const filteredTasks = tasks.filter(task => task.id !== id);
        if (tasks.length === filteredTasks.length) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Task not found.' }));
            return;
        }
        await saveTasks(filteredTasks);
        res.writeHead(204);
        res.end();
    } else {
        // Route not found
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Route not found.' }));
    }
});

// Determine the content type based on file extension
const getContentType = (filePath) => {
    const extname = path.extname(filePath).toLowerCase();
    const contentTypes = {
        '.html': 'text/html',
        '.css': 'text/css',
        '.js': 'application/javascript',
    };
    return contentTypes[extname] || 'application/octet-stream';
};

// Start the server
server.listen(3000, () => {
    console.log('Server is running at http://localhost:3000');
});
