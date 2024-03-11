import React, { useState, useEffect } from 'react';
import './App.css';
import { NewTodoForm } from './NewTodoForm';
import { TodoList } from './TodoList';

const App = () => {
  const [todos, setTodos] = useState(() => {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      return JSON.parse(savedTodos);
    } else {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  console.log('Todos:', todos);

  function fetchTodos() {
    fetch('https://playground.4geeks.com/apis/fake/todos/user/marcelobencini')
      .then((response) => response.json())
      .then((data) => {
        setTodos(data);
        console.log("data" ,data)
      })
      .catch((error) => console.log(error));
  }

  function addTodo(title) {
    if (!title.trim()) {
      return; 
    }

    const newTodo = {
      id: todos.length > 0 ? todos[todos.length - 1].id + 1 : 1,
      title,
      completed: false,
    };
    const updatedTodos = [...todos, newTodo];
    setTodos(updatedTodos);
  }

  function toggleTodo(id, completed) {
    const updatedTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, completed } : todo
    );
    setTodos(updatedTodos);
  }

  function deleteTodo(id) {
    const updatedTodos = todos.filter((todo) => todo.id !== id);
    setTodos(updatedTodos);
  }

  function deleteAllTodos() {
    const updatedTodos = [];
    setTodos(updatedTodos);
  }
  function syncTodos(updatedTodos) {
    fetch('https://playground.4geeks.com/apis/fake/todos/user/marcelobencini', {
      method: "PUT",
      body: JSON.stringify(updatedTodos),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        console.log("Todos synced successfully:", data);
      })
      .catch((error) => {
        console.error('There was a problem with the fetch operation:', error);
      });
  }

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  return (
    <>
      <NewTodoForm addTodo={addTodo} />
      <h1 className="header">Lista de Tareas:</h1>

      <TodoList todos={todos} toggleTodo={toggleTodo} deleteTodo={deleteTodo} />
      <button className="borrar-todo" onClick={deleteAllTodos}>
        Borrar todas las tareas
      </button>
    </>
  );
};

export default App;
