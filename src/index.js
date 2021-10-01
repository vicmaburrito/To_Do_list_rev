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
    <div class="flex">
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

function addEventsToCheckboxes() {
  const checkboxes = document.querySelectorAll('.checkbox');
  checkboxes.forEach((checkbox, index) => {
    checkbox.addEventListener('change', () => {
      update(todos[index]);
      saveTodosLocally();
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
});