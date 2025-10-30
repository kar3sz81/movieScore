//1 npm install @supabase/supabase-js
//ignore row level security a security policybe vagy hol

import { useState } from "react";
import "./App.css";
import supabase from "./supabase-client";
import { useEffect } from "react";

function App() {
  const [todoList, setTodoList] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [movies, setMovies] = useState([]);
  const [searchWord, setSearchWord] = useState("dune");

  useEffect(() => {
    fetchTodos();
    fetch(`http://www.omdbapi.com/?s=${searchWord}&apikey=960ffa73`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data.Search);
        setMovies(data.Search);
      });
  }, [searchWord]);

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
    <div class="relative flex flex-col items-start max-w-screen-xl px-4 mx-auto md:flex-row sm:px-6 p-8">
      <div class="flex items-center py-5 md:w-1/2 md:pb-20 md:pt-10 md:pr-10">
        <div class="text-left">
          <h2 class="text-4xl font-extrabold leading-10 tracking-tight text-gray-800 sm:text-5xl sm:leading-none md:text-6xl">
            Movie
            <span class="font-bold text-blue-500">Score</span>
            <span class="text-xs font-semibold rounded-full text-blueGray-500">
              by kar3sz
            </span>
          </h2>
          <p class="max-w-md mx-auto mt-3 text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
            vulputate dignissim augue, Nullam vulputate dignissim augue.
          </p>
          <div class="mt-5 sm:flex md:mt-8">
            <div class="rounded-md shadow">
              <div class="bg-white p-4 rounded-lg">
                <div class="relative bg-inherit">
                  <input
                    type="text"
                    id="username"
                    name="username"
                    class="peer bg-transparent h-10 w-72 rounded-lg text-gray-800 placeholder-transparent ring-2 px-2 ring-gray-500 focus:ring-sky-600 focus:outline-none focus:border-rose-600"
                    onChange={(e) => setSearchWord(e.target.value)}
                    value={searchWord}
                  />
                  <label
                    for="username"
                    class="absolute cursor-text left-0 -top-3 text-sm text-gray-500 bg-inherit mx-1 px-1 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-2 peer-focus:-top-3 peer-focus:text-sky-600 peer-focus:text-sm transition-all"
                  >
                    search for a movie
                  </label>
                </div>
              </div>
            </div>
            <div class="mt-3 rounded-md shadow sm:mt-0 sm:ml-3"></div>
          </div>

          {movies && (
            <ul class="bg-white rounded-lg shadow divide-y divide-gray-200 max-w-sm">
              {movies.map((movie) => (
                <li key={movie.imdbID} class="px-6 py-4">
                  <div class="flex justify-between">
                    <span class="font-semibold text-lg">{movie.Title}</span>
                    <span class="text-gray-500 text-xs">{movie.Year}</span>
                  </div>
                  <img src={movie.Poster} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <ul class="bg-white rounded-lg shadow divide-y divide-gray-200 max-w-sm mt-16">
        {todoList.map((todo) => (
          <li key={todo.id} class="px-6 py-4">
            <div class="flex justify-between">
              <span class="font-semibold text-lg">List Item {todo.id}</span>
              <span class="text-gray-500 text-xs">1 day ago</span>
            </div>
            <p class="text-gray-700">{todo.name}</p>

            <div class="flex flex-wrap justify-center gap-6">
              <a class="relative" href="#">
                <span class="absolute top-0 left-0 mt-1 ml-1 h-full w-full rounded bg-black"></span>
                <span
                  onClick={() => pipa(todo.id, todo.isCompleted)}
                  class="fold-bold relative inline-block h-full w-full rounded border-2 border-black bg-white px-3 py-1 text-base font-bold text-black transition duration-100 hover:bg-yellow-400 hover:text-gray-900"
                >
                  {todo.isCompleted ? "undo" : "complete"}
                </span>
              </a>
              <a href="#" class="relative">
                <span class="absolute top-0 left-0 mt-1 ml-1 h-full w-full rounded bg-gray-700"></span>
                <span
                  onClick={() => deleteTodo(todo.id)}
                  class="fold-bold relative inline-block h-full w-full rounded border-2 border-black bg-black px-3 py-1 text-base font-bold text-white transition duration-100 hover:bg-gray-900 hover:text-yellow-500"
                >
                  delete
                </span>
              </a>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
