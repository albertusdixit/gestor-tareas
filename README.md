# Gestor de Tareas

Este proyecto es un gestor de tareas básico construido con Node.js y una interfaz web. Proporciona una API REST funcional con capacidades CRUD (Crear, Leer, Actualizar, Eliminar) y una interfaz visual para gestionar tareas.

---

## **Características**

### **1. API REST**
El backend incluye las siguientes rutas principales:
- **GET /tasks:** Devuelve todas las tareas almacenadas.
- **POST /tasks:** Permite agregar una nueva tarea con un `id` único.
- **PUT /tasks/:id:** Actualiza una tarea específica identificada por su `id`.
- **DELETE /tasks/:id:** Elimina una tarea específica según su `id`.

### **2. Interfaz Web**
La interfaz web está compuesta por:
- `index.html`: Página principal que incluye un formulario para agregar tareas y una lista para mostrarlas.
- `styles.css`: Estilos básicos para la interfaz.
- `app.js`: Maneja la comunicación con la API y actualiza dinámicamente la interfaz.

---

## **Estructura del Proyecto**

```plaintext
gestor-tareas/
├── public/
│   ├── app.js          # Lógica del frontend
│   ├── index.html      # Página principal
│   ├── styles.css      # Estilos de la página
├── server.js           # Servidor Node.js
├── tasks.json          # Archivo para almacenar las tareas
├── package.json        # Configuración de dependencias
├── package-lock.json   # Bloqueo de dependencias
└── .gitignore          # Exclusiones para Git
```

## Problemas Encontrados y Soluciones

1. **Archivo `tasks.json` no encontrado:**
   - **Causa:** Se utilizaban rutas relativas al leer el archivo.
   - **Solución:** Uso de `path.join(__dirname, 'tasks.json')` para garantizar rutas absolutas.

2. **Interferencia entre rutas estáticas y de la API:**
   - **Causa:** Las solicitudes a `/tasks` eran interpretadas como rutas estáticas.
   - **Solución:** Priorizar las rutas de la API y limitar las rutas estáticas a la carpeta `public/`.

3. **Archivos estáticos no cargaban correctamente:**
   - **Causa:** Rutas incorrectas en `index.html`.
   - **Solución:** Ajustar las referencias para incluir `/public/` o reconfigurar el servidor.

---

## Pruebas Realizadas

Se llevaron a cabo pruebas manuales con herramientas como `curl` y el navegador para verificar:
- La funcionalidad de cada ruta de la API (GET, POST, PUT, DELETE).
- La correcta integración entre la API y la interfaz web.
- Persistencia de datos en `tasks.json`.

---

## Cómo Ejecutar el Proyecto

### 1. Requisitos
- Node.js (versión 14 o superior)
- npm (incluido con Node.js)

### 2. Instalación
1. Clonar el repositorio:
``` bash
git clone https://github.com/tu-usuario/gestor-tareas.git cd gestor-tareas
``` 
2. Instalar dependencias:
``` bash
npm install
``` 


### 3. Ejecución
Iniciar el servidor:
``` bash
npm start
``` 

Abrir en el navegador:

http://localhost:3000


---

## Lo que Queda por Hacer

1. Validar las entradas del usuario en la interfaz.
2. Añadir funcionalidad para editar tareas desde la interfaz.
3. Mejorar la experiencia de usuario con animaciones y notificaciones.
4. Implementar un sistema de respaldo automático para `tasks.json`.
5. Refactorizar el código para garantizar claridad y eficiencia.

---

## Licencia
Este proyecto se distribuye bajo la Licencia MIT. Puedes modificarlo y distribuirlo libremente.

