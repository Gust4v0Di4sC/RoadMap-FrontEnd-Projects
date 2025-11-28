const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');
let tasks = [];

// Adicionar tarefa ao pressionar Enter
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && taskInput.value.trim()) {
        addTask(taskInput.value.trim());
        taskInput.value = '';
    }
});

// Adicionar nova tarefa
function addTask(taskText) {
    const task = {
        id: Date.now(),
        text: taskText,
        completed: false
    };
    
    tasks.push(task);
    renderTasks();
}

// Renderizar tarefas na tela
function renderTasks() {
    taskList.innerHTML = '';
    
    tasks.forEach(task => {
        const li = document.createElement('li');
        li.className = task.completed ? 'completed' : '';
        
        li.innerHTML = `
            <input type="checkbox" ${task.completed ? 'checked' : ''} onchange="toggleTask(${task.id})">
            <span>${task.text}</span>
            <button class="delete" onclick="deleteTask(${task.id})"><i class="fas fa-trash-alt"></i></button>
        `;
        
        taskList.appendChild(li);
    });
}

// Marcar tarefa como concluída
function toggleTask(id) {
    tasks = tasks.map(task => 
        task.id === id ? { ...task, completed: !task.completed } : task
    );
    
    renderTasks();
}

// Deletar tarefa
function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    renderTasks();
}