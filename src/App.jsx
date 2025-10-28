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
    <div class="relative flex flex-col items-center max-w-screen-xl px-4 mx-auto md:flex-row sm:px-6 p-8">
      <div class="flex items-center py-5 md:w-1/2 md:pb-20 md:pt-10 md:pr-10">
        <div class="text-left">
          <h2 class="text-4xl font-extrabold leading-10 tracking-tight text-gray-800 sm:text-5xl sm:leading-none md:text-6xl">
            Hero
            <span class="font-bold text-blue-500">Section</span>
            <span class="text-xl font-semibold rounded-full text-blueGray-500">
              2.0
            </span>
          </h2>
          <p class="max-w-md mx-auto mt-3 text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
            vulputate dignissim augue, Nullam vulputate dignissim augue.
          </p>
          <div class="mt-5 sm:flex md:mt-8">
            <div class="rounded-md shadow">
              <input
                type="Text"
                placeholder="new Todo.."
                onChange={(e) => setNewTodo(e.target.value)}
                value={newTodo}
              ></input>
              <button onClick={addTodo}>add Todo item</button>
              {/*<a
                href=""
                class="flex items-center justify-center w-full px-8 py-3 text-base font-medium leading-6 text-white transition duration-150 ease-in-out bg-blue-500 border border-transparent rounded-md hover:bg-blue-600 focus:outline-none focus:shadow-outline-blue md:py-4 md:text-lg md:px-10"
              >
                Getting started
              </a>*/}
            </div>
            <div class="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
              {/*<a
                href=""
                class="flex items-center justify-center w-full px-8 py-3 text-base font-medium leading-6 text-blue-500 transition duration-150 ease-in-out bg-white border border-transparent rounded-md hover:text-blue-600 focus:outline-none focus:shadow-outline-blue md:py-4 md:text-lg md:px-10"
              >
                Contribute
              </a>*/}
            </div>
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

                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="bg-blue-400"
                >
                  delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div class="flex items-center py-5 md:w-1/2 md:pb-20 md:pt-10 md:pl-10">
        <div class="relative w-full p-3 rounded  md:p-8">
          <div class="rounded-lg bg-white text-black w-full">
            <img src="https://picsum.photos/400/300" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
