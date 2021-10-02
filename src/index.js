import './style.css';
import update from './update.js';
import { createTodo, destroyTodo, updateTodo } from './controller.js';

const button = document.querySelector('button');
class Todo {
  constructor(description, completed, index) {
    this.description = description;
    this.completed = completed;
    this.index = index;
  }
}

let todos = [];

function createTodoItem(todo) {
  const li = document.createElement('li');
  li.innerHTML = `
    <div class="flex todo-element">
      <div>
          <input type="checkbox" class="checkbox" 
          ${todo.completed ? 'checked' : ''}>
          <span>${todo.description}</span>
      </div>
      <span class="material-icons edit-icon" style="cursor: pointer">
          more_vert
      </span>
    </div>
    <hr>`;

  return li;
}

function ReplaceTodoItem(todo) {
  const html = `
  <div>
    <input type="checkbox" class="checkbox" 
    ${todo.completed ? 'checked' : ''}>
    <span>${todo.description}</span>
  </div>
  <span class="material-icons edit-icon" style=" cursor: pointer">
      more_vert
  </span>
    `;
  return html;
}

function addTodoItem(todo) {
  const li = createTodoItem(todo);
  button.parentElement.insertBefore(li, button);
}

function populate() {
  todos.sort((a, b) => (a.index > b.index ? 1 : -1));
  todos.forEach((todo) => {
    addTodoItem(todo);
  });
}

function saveTodosLocally() {
  localStorage.setItem('todos', JSON.stringify(todos));
}

function ReplaceTodoItemForCompletedTask(todo) {
  const html = `
  
  <div>
  <span class="material-icons edit-icon" style=" cursor: pointer; color: green">
      done
  </span>
    <strike><span>${todo.description}</span></strike>
  </div>
  <span class="material-icons edit-icon" style=" cursor: pointer">
      more_vert
  </span>
    `;

  return html;
}

function changeElementToCompleted(index) {
  update(todos[index]);
  saveTodosLocally();
  if (todos[index].completed) {
    const completedElement = ReplaceTodoItemForCompletedTask(todos[index]);
    const todoElements = document.querySelectorAll('.todo-element');
    todoElements[index].innerHTML = completedElement;
  }
}

function addEventsToCheckboxes(recievedIndex) {
  const checkboxes = document.querySelectorAll('.checkbox');

  checkboxes.forEach((checkbox, index) => {
    if (recievedIndex) {
      if (recievedIndex === index) {
        checkbox.addEventListener('change', () => {
          changeElementToCompleted(index);
        });
      }
    } else {
      checkbox.addEventListener('change', () => {
        changeElementToCompleted(index);
      });
    }
  });
}

function addEventsToEditIcons() {
  const editIcons = document.querySelectorAll('.edit-icon');
  const todoElements = document.querySelectorAll('.todo-element');

  todos.forEach((todo, index) => {
    editIcons[index].addEventListener('click', () => {
      const div = document.createElement('div');
      div.classList.add('flex', 'todo-element');
      div.style.backgroundColor = '#FFFBAE';

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.classList.add('checkbox');
      checkbox.checked = todo.completed;

      const input = document.createElement('input');
      input.type = 'text';
      input.classList.add('edit-input');
      input.value = todo.description;
      input.style.backgroundColor = 'transparent';

      const span = document.createElement('span');
      span.classList.add('material-icons', 'edit-icon');
      span.style.marginLeft = 'auto';
      span.style.cursor = 'pointer';
      span.innerHTML = 'delete';

      div.appendChild(checkbox);
      div.appendChild(input);
      div.appendChild(span);

      todoElements[index].replaceWith(div);

      input.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
          const todo = todos[index];
          todo.description = input.value;
          updateTodo(todo, todos[index]);
          const html = ReplaceTodoItem(todo);
          div.innerHTML = html;
          addEventsToEditIcons();
          saveTodosLocally();
          div.style.backgroundColor = 'white';
        }
      });

      span.addEventListener('click', () => {
        saveTodosLocally();
        destroyTodo(todo, todos);
        div.parentElement.remove();
        saveTodosLocally();
      });
    });
  });
}

window.addEventListener('load', () => {
  const oldTodos = JSON.parse(localStorage.getItem('todos'));
  if (oldTodos) {
    todos = oldTodos;
  }
  populate();
  addEventsToCheckboxes();
  addEventsToEditIcons();
});

function addEventListenerToInput() {
  const input = document.querySelector('#input');
  input.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
      const todo = new Todo(input.value, false, todos.length + 1);
      createTodo(todo, todos);
      addTodoItem(todo);
      saveTodosLocally();
      input.value = '';
      addEventsToEditIcons(todos.length);
      addEventsToCheckboxes(todos.length - 1);
    }
  });
}

addEventListenerToInput();

button.addEventListener('click', () => {
  const todoElements = document.querySelectorAll('.todo-element');
  const removedTodos = [];
  for (let i = 0; i < todos.length; i += 1) {
    if (todos[i].completed === true) {
      removedTodos.push(todos[i]);
      todoElements[i].parentNode.remove();
    }
  }

  removedTodos.forEach((todo) => {
    destroyTodo(todo, todos);
  });

  saveTodosLocally();
});