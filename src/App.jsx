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
  const [movieProfileSelected, setMovieProfileSelected] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const user = Math.round(Math.random() * 1000).toString();
  const avatarURL = "https://i.pravatar.cc/48";
  const full = false;
  const [rating, setRating] = useState(0);
  const [tempRating, setTempRating] = useState(0);

  console.log(rating);

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

  const clickedOnAsearchResult = (movie) => {
    setMovieProfileSelected(!movieProfileSelected);
    setSelectedMovie({ movie });
    console.log(selectedMovie);
  };

  const printSomething = (number) => {
    console.log(`${number}csillag klikk`);
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

  {
    /*return */
  }
  {
    /*return */
  }
  {
    /*return */
  }
  {
    /*return */
  }
  {
    /*return */
  }
  {
    /*return */
  }
  {
    /*return */
  }
  {
    /*return */
  }

  return (
    <div class="relative flex flex-col items-start max-w-screen-xl px-4 mx-auto md:flex-row sm:px-6 p-8">
      <div class="flex items-center py-5 md:w-1/2 md:pb-20 md:pt-10 md:pr-10">
        <div class="text-left">
          <p class="max-w-md mx-auto mt-3 text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            <div class="bg-white p-8 rounded-2xl w-full max-w-sm ">
              {/*LOG IN part */}
              {/*LOG IN part */}
              {/*LOG IN part */}
              {/*LOG IN part */}
              {/*LOG IN part */}
              {/*LOG IN part */}

              <div class="flex-col items-center">
                <div class="flex items-center">
                  <img
                    src={avatarURL}
                    alt="Profile Picture"
                    class="w-8 h-8 rounded-full mt-4"
                  />
                  <div class="m-2">
                    <h2 class="text-sm font-semibold mt-2">Hi, guest{user}!</h2>
                    <p class="text-gray-500 text-xs">Long time not see..</p>
                  </div>
                </div>
              </div>

              {/*MAin title: MOVIE SCORE */}
              {/*MAin title: MOVIE SCORE */}
              {/*MAin title: MOVIE SCORE */}
              {/*MAin title: MOVIE SCORE */}
              {/*MAin title: MOVIE SCORE */}
              {/*MAin title: MOVIE SCORE */}
              {/*MAin title: MOVIE SCORE */}
              {/*MAin title: MOVIE SCORE */}

              <h2 class="text-5xl font-extrabold leading-10 tracking-tight text-gray-800 sm:text-5xl sm:leading-none md:text-5xl">
                Movie
                <span class="font-bold text-blue-500">Score</span>
                {/*<span class="text-xs font-semibold rounded-full text-blueGray-500">
                    by kar3sz
                  </span>*/}
              </h2>
            </div>
          </p>

          {/*search */}
          {/*search */}
          {/*search */}
          {/*search */}
          {/*search */}
          {/*search */}
          {/*search */}

          <div class="mx-7 sm:flex md:mt-8">
            <div class="rounded-md ">
              <div class="bg-white  rounded-lg">
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

          {/* search result MOVIE-CARD*/}
          {/* search result MOVIE-CARD*/}
          {/* search result MOVIE-CARD*/}
          {/* search result MOVIE-CARD*/}
          {/* search result MOVIE-CARD*/}
          {/* search result MOVIE-CARD*/}
          {/* search result MOVIE-CARD*/}
          {/* search result MOVIE-CARD*/}

          {movies && (
            <ul class="bg-white rounded-lg shadow divide-y divide-gray-200 max-w-sm">
              {movies.map((movie) => (
                <li
                  onClick={() => clickedOnAsearchResult(movie)}
                  key={movie.imdbID}
                  class="px-6 py-4"
                >
                  <div class="flex justify-between">
                    <span class="font-semibold text-lg">{movie.Title}</span>
                    <span class="text-gray-500 text-xs">{movie.Year}</span>
                  </div>
                  <img src={movie.Poster} />

                  {/*      START stars        */}
                  {/*      START stars        */}
                  {/*      START stars        */}
                  {/*      START stars        */}
                  {/*      START stars        */}

                  <div class="flex justify-center items-center bg-white p-8 mr-9 shadow-slate-200 rounded-lg w-auto space-x-1 lg:space-x-2">
                    <button onClick={() => setRating(1)}>
                      <svg
                        class="text-yellow-500 w-5 h-auto fill-current hover:bg-sky-700"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 576 512"
                      >
                        {rating >= 1 || tempRating >= 1 ? (
                          <path d="M381.2 150.3L524.9 171.5C536.8 173.2 546.8 181.6 550.6 193.1C554.4 204.7 551.3 217.3 542.7 225.9L438.5 328.1L463.1 474.7C465.1 486.7 460.2 498.9 450.2 506C440.3 513.1 427.2 514 416.5 508.3L288.1 439.8L159.8 508.3C149 514 135.9 513.1 126 506C116.1 498.9 111.1 486.7 113.2 474.7L137.8 328.1L33.58 225.9C24.97 217.3 21.91 204.7 25.69 193.1C29.46 181.6 39.43 173.2 51.42 171.5L195 150.3L259.4 17.97C264.7 6.954 275.9-.0391 288.1-.0391C300.4-.0391 311.6 6.954 316.9 17.97L381.2 150.3z" />
                        ) : (
                          <path d=" M287.9 0C297.1 0 305.5 5.25 309.5 13.52L378.1 154.8L531.4 177.5C540.4 178.8 547.8 185.1 550.7 193.7C553.5 202.4 551.2 211.9 544.8 218.2L433.6 328.4L459.9 483.9C461.4 492.9 457.7 502.1 450.2 507.4C442.8 512.7 432.1 513.4 424.9 509.1L287.9 435.9L150.1 509.1C142.9 513.4 133.1 512.7 125.6 507.4C118.2 502.1 114.5 492.9 115.1 483.9L142.2 328.4L31.11 218.2C24.65 211.9 22.36 202.4 25.2 193.7C28.03 185.1 35.5 178.8 44.49 177.5L197.7 154.8L266.3 13.52C270.4 5.249 278.7 0 287.9 0L287.9 0zM287.9 78.95L235.4 187.2C231.9 194.3 225.1 199.3 217.3 200.5L98.98 217.9L184.9 303C190.4 308.5 192.9 316.4 191.6 324.1L171.4 443.7L276.6 387.5C283.7 383.7 292.2 383.7 299.2 387.5L404.4 443.7L384.2 324.1C382.9 316.4 385.5 308.5 391 303L476.9 217.9L358.6 200.5C350.7 199.3 343.9 194.3 340.5 187.2L287.9 78.95z" />
                        )}
                      </svg>
                    </button>

                    <button
                      onClick={() => setRating(2)}
                      onMouseEnter={() => setTempRating(2)}
                      onMouseLeave={() => setTempRating(0)}
                    >
                      <svg
                        class="text-yellow-500 w-5 h-auto fill-current"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 576 512"
                      >
                        {rating >= 2 || tempRating >= 2 ? (
                          <path d="M381.2 150.3L524.9 171.5C536.8 173.2 546.8 181.6 550.6 193.1C554.4 204.7 551.3 217.3 542.7 225.9L438.5 328.1L463.1 474.7C465.1 486.7 460.2 498.9 450.2 506C440.3 513.1 427.2 514 416.5 508.3L288.1 439.8L159.8 508.3C149 514 135.9 513.1 126 506C116.1 498.9 111.1 486.7 113.2 474.7L137.8 328.1L33.58 225.9C24.97 217.3 21.91 204.7 25.69 193.1C29.46 181.6 39.43 173.2 51.42 171.5L195 150.3L259.4 17.97C264.7 6.954 275.9-.0391 288.1-.0391C300.4-.0391 311.6 6.954 316.9 17.97L381.2 150.3z" />
                        ) : (
                          <path d=" M287.9 0C297.1 0 305.5 5.25 309.5 13.52L378.1 154.8L531.4 177.5C540.4 178.8 547.8 185.1 550.7 193.7C553.5 202.4 551.2 211.9 544.8 218.2L433.6 328.4L459.9 483.9C461.4 492.9 457.7 502.1 450.2 507.4C442.8 512.7 432.1 513.4 424.9 509.1L287.9 435.9L150.1 509.1C142.9 513.4 133.1 512.7 125.6 507.4C118.2 502.1 114.5 492.9 115.1 483.9L142.2 328.4L31.11 218.2C24.65 211.9 22.36 202.4 25.2 193.7C28.03 185.1 35.5 178.8 44.49 177.5L197.7 154.8L266.3 13.52C270.4 5.249 278.7 0 287.9 0L287.9 0zM287.9 78.95L235.4 187.2C231.9 194.3 225.1 199.3 217.3 200.5L98.98 217.9L184.9 303C190.4 308.5 192.9 316.4 191.6 324.1L171.4 443.7L276.6 387.5C283.7 383.7 292.2 383.7 299.2 387.5L404.4 443.7L384.2 324.1C382.9 316.4 385.5 308.5 391 303L476.9 217.9L358.6 200.5C350.7 199.3 343.9 194.3 340.5 187.2L287.9 78.95z" />
                        )}
                      </svg>
                    </button>

                    <button onClick={() => setRating(3)}>
                      <svg
                        class="text-yellow-500 w-5 h-auto fill-current"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 576 512"
                      >
                        {/*  <path d="M381.2 150.3L524.9 171.5C536.8 173.2 546.8 181.6 550.6 193.1C554.4 204.7 551.3 217.3 542.7 225.9L438.5 328.1L463.1 474.7C465.1 486.7 460.2 498.9 450.2 506C440.3 513.1 427.2 514 416.5 508.3L288.1 439.8L159.8 508.3C149 514 135.9 513.1 126 506C116.1 498.9 111.1 486.7 113.2 474.7L137.8 328.1L33.58 225.9C24.97 217.3 21.91 204.7 25.69 193.1C29.46 181.6 39.43 173.2 51.42 171.5L195 150.3L259.4 17.97C264.7 6.954 275.9-.0391 288.1-.0391C300.4-.0391 311.6 6.954 316.9 17.97L381.2 150.3z" />
                         */}
                        <path d="M287.9 0C297.1 0 305.5 5.25 309.5 13.52L378.1 154.8L531.4 177.5C540.4 178.8 547.8 185.1 550.7 193.7C553.5 202.4 551.2 211.9 544.8 218.2L433.6 328.4L459.9 483.9C461.4 492.9 457.7 502.1 450.2 507.4C442.8 512.7 432.1 513.4 424.9 509.1L287.9 435.9L150.1 509.1C142.9 513.4 133.1 512.7 125.6 507.4C118.2 502.1 114.5 492.9 115.1 483.9L142.2 328.4L31.11 218.2C24.65 211.9 22.36 202.4 25.2 193.7C28.03 185.1 35.5 178.8 44.49 177.5L197.7 154.8L266.3 13.52C270.4 5.249 278.7 0 287.9 0L287.9 0zM287.9 78.95L235.4 187.2C231.9 194.3 225.1 199.3 217.3 200.5L98.98 217.9L184.9 303C190.4 308.5 192.9 316.4 191.6 324.1L171.4 443.7L276.6 387.5C283.7 383.7 292.2 383.7 299.2 387.5L404.4 443.7L384.2 324.1C382.9 316.4 385.5 308.5 391 303L476.9 217.9L358.6 200.5C350.7 199.3 343.9 194.3 340.5 187.2L287.9 78.95z" />
                      </svg>
                    </button>

                    <button onClick={() => setRating(4)}>
                      <svg
                        class="text-yellow-500 w-5 h-auto fill-current"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 576 512"
                      >
                        <path d="M287.9 0C297.1 0 305.5 5.25 309.5 13.52L378.1 154.8L531.4 177.5C540.4 178.8 547.8 185.1 550.7 193.7C553.5 202.4 551.2 211.9 544.8 218.2L433.6 328.4L459.9 483.9C461.4 492.9 457.7 502.1 450.2 507.4C442.8 512.7 432.1 513.4 424.9 509.1L287.9 435.9L150.1 509.1C142.9 513.4 133.1 512.7 125.6 507.4C118.2 502.1 114.5 492.9 115.1 483.9L142.2 328.4L31.11 218.2C24.65 211.9 22.36 202.4 25.2 193.7C28.03 185.1 35.5 178.8 44.49 177.5L197.7 154.8L266.3 13.52C270.4 5.249 278.7 0 287.9 0L287.9 0zM287.9 78.95L235.4 187.2C231.9 194.3 225.1 199.3 217.3 200.5L98.98 217.9L184.9 303C190.4 308.5 192.9 316.4 191.6 324.1L171.4 443.7L276.6 387.5C283.7 383.7 292.2 383.7 299.2 387.5L404.4 443.7L384.2 324.1C382.9 316.4 385.5 308.5 391 303L476.9 217.9L358.6 200.5C350.7 199.3 343.9 194.3 340.5 187.2L287.9 78.95z" />
                      </svg>
                    </button>

                    <button onClick={() => setRating(5)} class="mr-2">
                      <svg
                        class="text-yellow-500 w-5 h-auto fill-current"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 576 512"
                      >
                        <path d="M287.9 0C297.1 0 305.5 5.25 309.5 13.52L378.1 154.8L531.4 177.5C540.4 178.8 547.8 185.1 550.7 193.7C553.5 202.4 551.2 211.9 544.8 218.2L433.6 328.4L459.9 483.9C461.4 492.9 457.7 502.1 450.2 507.4C442.8 512.7 432.1 513.4 424.9 509.1L287.9 435.9L150.1 509.1C142.9 513.4 133.1 512.7 125.6 507.4C118.2 502.1 114.5 492.9 115.1 483.9L142.2 328.4L31.11 218.2C24.65 211.9 22.36 202.4 25.2 193.7C28.03 185.1 35.5 178.8 44.49 177.5L197.7 154.8L266.3 13.52C270.4 5.249 278.7 0 287.9 0L287.9 0zM287.9 78.95L235.4 187.2C231.9 194.3 225.1 199.3 217.3 200.5L98.98 217.9L184.9 303C190.4 308.5 192.9 316.4 191.6 324.1L171.4 443.7L276.6 387.5C283.7 383.7 292.2 383.7 299.2 387.5L404.4 443.7L384.2 324.1C382.9 316.4 385.5 308.5 391 303L476.9 217.9L358.6 200.5C350.7 199.3 343.9 194.3 340.5 187.2L287.9 78.95z" />
                      </svg>
                    </button>

                    <span class="text-slate-400 font-medium">Rate Here!</span>
                  </div>

                  {/*      END stars        */}
                  {/*      END stars        */}
                  {/*      END stars        */}
                  {/*      END stars        */}
                  {/*      END stars        */}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <div>
        {movieProfileSelected && selectedMovie && (
          <div class="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
            <div class="md:flex">
              <div class="md:shrink-0">
                <img
                  class="h-48 w-full object-cover md:h-full md:w-48"
                  src={selectedMovie.Poster}
                  alt="User profile picture"
                />
              </div>
              <div class="p-8">
                <div class="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
                  {selectedMovie.Title}
                  {console.log(selectedMovie.Title)}
                </div>
                <p class="mt-2 text-slate-500">
                  "This product changed my life! I can't imagine going back to
                  how things were before. Absolutely revolutionary."
                </p>
                <div class="mt-4">
                  <span class="text-slate-900 font-bold">Sarah Johnson</span>
                  <span class="text-slate-600 text-sm ml-2">
                    CEO, TechInnovate
                  </span>
                </div>
                <div class="mt-4 flex items-center">
                  <svg
                    class="h-5 w-5 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                  <svg
                    class="h-5 w-5 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                  <svg
                    class="h-5 w-5 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                  <svg
                    class="h-5 w-5 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                  <svg
                    class="h-5 w-5 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        )}
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
    </div>
  );
}

export default App;
