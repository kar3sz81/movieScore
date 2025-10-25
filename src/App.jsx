//1 npm install @supabase/supabase-js
//ignore row level security a security policybe vagy hol

import { useState } from "react";
import "./App.css";
import supabase from "./supabase-client";
import { useEffect } from "react";

function App() {
  const [todoList, setTodoList] = useState([]);
  const [newTodo, setNewTodo] = useState("");

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    const { data, error } = await supabase.from("todoList").select("*");
    if (error) {
      console.log("baj van a feccsel", error);
    } else {
      setTodoList(data);
    }
  };

  const addTodo = async () => {
    const newTodoData = {
      name: newTodo,
      isCompleted: false,
    };
    const { data, error } = await supabase
      .from("todoList")
      .insert([newTodoData])
      .select()
      .single();

    if (error) {
      console.log("error adding todo: ", error);
    } else {
      setTodoList((prev) => [...prev, data]);
      console.log("todo added");
      setNewTodo("");
    }
  };

  const pipa = async (id, isCompleted) => {
    const { data, error } = await supabase
      .from("todoList")
      .update({ isCompleted: !isCompleted })
      .eq("id", id);

    if (error) {
      console.log("error pipa muvelettel: ", error);
    } else {
      const newTodoList = todoList.map((todo) =>
        todo.id === id ? { ...todo, isCompleted: !isCompleted } : todo
      );
      setTodoList(newTodoList);
    }
  };

  const deleteTodo = async (id) => {
    console.log("delete soon");
    const { data, error } = await supabase
      .from("todoList")
      .delete()
      .eq("id", id);

    if (error) {
      console.log("error torlessel: ", error);
    } else {
      const filteredTodos = todoList.filter((todo) => todo.id !== id);
      setTodoList(filteredTodos);
    }
  };

  return (
    <div className="text-xl text-grey-400">
      {"                 "}
      <h1>Todo List</h1>
      <div>
        <input
          type="Text"
          placeholder="new Todo.."
          onChange={(e) => setNewTodo(e.target.value)}
          value={newTodo}
        ></input>
        <button onClick={addTodo}>add Todo item</button>
      </div>
      <ul>
        {todoList.map((todo) => (
          <li key={todo.id}>
            <p>{todo.name}</p>

            <button
              className="bg-amber-400"
              onClick={() => pipa(todo.id, todo.isCompleted)}
            >
              {todo.isCompleted ? "undo" : "complete Tasks"}
            </button>

            <button onClick={() => deleteTodo(todo.id)} className="bg-blue-400">
              delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
